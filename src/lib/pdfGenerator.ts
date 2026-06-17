import PDFDocument from 'pdfkit';
import path from 'path';
import fs from 'fs';
import sharp from 'sharp';

export interface PDFParams {
  application: any;
  photographBuffer?: Buffer;
  signatureBuffer?: Buffer;
  receiptBuffer?: Buffer;
}

export function isValidImageForPDF(buffer: Buffer): boolean {
  if (!buffer || buffer.length < 4) return false;
  
  // PNG Magic Bytes: 89 50 4E 47
  if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47) {
    return true;
  }
  
  // JPEG Magic Bytes: FF D8 FF
  if (buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF) {
    return true;
  }
  
  return false;
}

export function slugifyName(prefix: string, firstName: string, lastName: string): string {
  const fullName = [prefix, firstName, lastName].filter(Boolean).join(' ');
  return fullName
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // remove special chars except spaces and hyphens
    .trim()
    .replace(/\s+/g, '-') // replace spaces with hyphens
    .replace(/-+/g, '-'); // remove duplicate hyphens
}

export function formatTimestampForPDF(isoString: string): string {
  const date = new Date(isoString);
  const pad = (num: number) => String(num).padStart(2, '0');
  
  const yyyy = date.getUTCFullYear();
  const mm = pad(date.getUTCMonth() + 1);
  const dd = pad(date.getUTCDate());
  const hh = pad(date.getUTCHours());
  const min = pad(date.getUTCMinutes());
  const ss = pad(date.getUTCSeconds());
  
  return `${yyyy}-${mm}-${dd}-${hh}-${min}-${ss}`;
}

export async function compressImage(buffer: Buffer, maxWidth: number, quality: number = 75): Promise<Buffer> {
  try {
    if (!buffer || buffer.length === 0) return buffer;
    
    // Check if it's a valid JPEG or PNG
    const isPng = buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47;
    const isJpg = buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF;
    
    if (!isPng && !isJpg) {
      return buffer;
    }
    
    let pipeline = sharp(buffer);
    const metadata = await pipeline.metadata();
    
    // Resize image if its width exceeds maxWidth
    if (metadata.width && metadata.width > maxWidth) {
      pipeline = pipeline.resize({ width: maxWidth, withoutEnlargement: true });
    }
    
    // Flatten alpha transparency to white background (prevents black background in JPEG conversion)
    pipeline = pipeline.flatten({ background: '#ffffff' });
    
    // Convert to highly optimized JPEG
    return await pipeline
      .jpeg({ quality, chromaSubsampling: '4:2:0', force: true })
      .toBuffer();
  } catch (err) {
    console.error("Failed to compress image:", err);
    return buffer;
  }
}

// Helper to draw section headers
function drawSectionHeader(doc: any, text: string, y: number): number {
  const height = 22;
  const startX = 50;
  const width = 495;
  
  // Accent background block
  doc.rect(startX, y, width, height).fill('#051F20');
  
  // Left side border bar (sage color)
  doc.rect(startX, y, 6, height).fill('#8EB69B');
  
  // Text inside the block
  doc.fontSize(9)
     .font('Helvetica-Bold')
     .fillColor('#DAF1DE')
     .text(text, startX + 16, y + 6.5);
     
  return y + height + 10;
}

// Helper to draw formatted tables
function drawTable(
  doc: any,
  startX: number,
  startY: number,
  width: number,
  rows: [string, string][],
  columnWidths: number[]
): number {
  let currentY = startY;
  const rowHeight = 22;
  const paddingX = 8;
  const paddingY = 6;
  
  rows.forEach((row, rowIndex) => {
    const isEven = rowIndex % 2 === 0;
    const bgFill = isEven ? '#F8FAFC' : '#FFFFFF';
    
    // Calculate row height dynamically based on content length
    let maxTextHeight = rowHeight;
    row.forEach((text, i) => {
      const fontSize = 8;
      const fontName = i === 0 ? 'Helvetica-Bold' : 'Helvetica';
      const cellWidth = columnWidths[i] - paddingX * 2;
      
      doc.font(fontName).fontSize(fontSize);
      const textHeight = doc.heightOfString(text || 'N/A', { width: cellWidth }) + paddingY * 2;

      if (textHeight > maxTextHeight) {
        maxTextHeight = textHeight;
      }
    });

    // Draw row background
    doc.rect(startX, currentY, width, maxTextHeight).fill(bgFill);
    
    // Draw row borders
    doc.strokeColor('#E2E8F0').lineWidth(0.5)
       .moveTo(startX, currentY)
       .lineTo(startX + width, currentY)
       .stroke();
       
    doc.moveTo(startX, currentY + maxTextHeight)
       .lineTo(startX + width, currentY + maxTextHeight)
       .stroke();

    // Draw side borders and middle column separator
    doc.moveTo(startX, currentY)
       .lineTo(startX, currentY + maxTextHeight)
       .stroke();
       
    doc.moveTo(startX + width, currentY)
       .lineTo(startX + width, currentY + maxTextHeight)
       .stroke();
       
    doc.moveTo(startX + columnWidths[0], currentY)
       .lineTo(startX + columnWidths[0], currentY + maxTextHeight)
       .stroke();

    // Draw cell text
    let cellXOffset = startX;
    row.forEach((text, i) => {
      const fontName = i === 0 ? 'Helvetica-Bold' : 'Helvetica';
      const textColor = i === 0 ? '#475569' : '#0F172A';
      
      doc.fontSize(8)
         .font(fontName)
         .fillColor(textColor)
         .text(text || 'N/A', cellXOffset + paddingX, currentY + paddingY, { width: columnWidths[i] - paddingX * 2 });
      cellXOffset += columnWidths[i];
    });
    
    currentY += maxTextHeight;
  });
  
  return currentY;
}

// Helper to draw statement of intent box
function drawStatementBox(doc: any, text: string, y: number): number {
  const startX = 50;
  const width = 495;
  const padding = 12;
  const fontSize = 8.5;
  
  // Calculate text height
  doc.font('Helvetica').fontSize(fontSize);
  const textHeight = doc.heightOfString(text || 'No statement provided.', { width: width - padding * 2, lineGap: 3 });
  const boxHeight = textHeight + padding * 2;
  
  // Draw light shaded background
  doc.rect(startX, y, width, boxHeight).fill('#F8FAFC');
  
  // Draw left border accent using BRS forest green
  doc.rect(startX, y, 4, boxHeight).fill('#235347');
  
  // Draw box border outline
  doc.rect(startX, y, width, boxHeight).strokeColor('#E2E8F0').lineWidth(0.5).stroke();
  
  // Render text inside
  doc.fontSize(fontSize)
     .font('Helvetica')
     .fillColor('#0F172A')
     .text(text || 'No statement provided.', startX + padding + 2, y + padding, {
       width: width - padding * 2 - 4,
       align: 'justify',
       lineGap: 3
     });
     
  return y + boxHeight;
}

// Helper to draw side-by-side document overview boxes
function drawDocumentBox(
  doc: any,
  x: number,
  y: number,
  width: number,
  boxHeight: number,
  title: string,
  buffer: Buffer | undefined,
  urlPath: string | undefined
) {
  const previewHeight = 115;
  const infoHeight = 55;
  const padding = 2;
  
  // Draw outer box
  doc.rect(x, y, width, boxHeight).strokeColor('#DAF1DE').lineWidth(0.5).stroke();
  
  const isImg = buffer && isValidImageForPDF(buffer);
  const fileName = urlPath ? (urlPath.split('/').pop() || 'document.dat') : 'No file uploaded';
  const fileExt = fileName.split('.').pop()?.toUpperCase() || 'N/A';
  
  if (buffer && isImg) {
    // Draw preview box background
    doc.rect(x + padding, y + padding, width - padding * 2, previewHeight - padding).fill('#F8FAFC');
    try {
      doc.image(buffer, x + padding + 4, y + padding + 4, {
        width: width - padding * 2 - 8,
        height: previewHeight - padding * 2 - 8,
        fit: [width - padding * 2 - 8, previewHeight - padding * 2 - 8]
      });
    } catch (err) {
      console.error("Failed to render document preview in PDF:", err);
      doc.fontSize(8).fillColor('#FF0000').text('Preview Error', x + 5, y + previewHeight / 2 - 4, { width: width - 10, align: 'center' });
    }
  } else if (buffer) {
    // Non-image card (e.g. PDF)
    doc.rect(x + padding, y + padding, width - padding * 2, previewHeight - padding).fill('#F1F5F9');
    
    // Draw PDF icon mockup
    doc.rect(x + width / 2 - 20, y + 25, 40, 45).fill('#E2E8F0');
    doc.rect(x + width / 2 - 20, y + 25, 40, 45).strokeColor('#94A3B8').lineWidth(0.5).stroke();
    doc.fontSize(8.5).font('Helvetica-Bold').fillColor('#DC2626').text('PDF', x + width / 2 - 20, y + 42, { width: 40, align: 'center' });
    
    doc.fontSize(7).font('Helvetica').fillColor('#475569').text(`File Type: ${fileExt}`, x + 5, y + 78, { width: width - 10, align: 'center' });
    doc.fontSize(7).font('Helvetica-Bold').fillColor('#16A34A').text('Uploaded successfully', x + 5, y + 88, { width: width - 10, align: 'center' });
  } else {
    // Empty card
    doc.rect(x + padding, y + padding, width - padding * 2, previewHeight - padding).fill('#F8FAFC');
    doc.fontSize(8).font('Helvetica-Oblique').fillColor('#94A3B8').text('No upload', x + 5, y + previewHeight / 2 - 4, { width: width - 10, align: 'center' });
  }
  
  // Draw separator line
  doc.strokeColor('#DAF1DE').lineWidth(0.5)
     .moveTo(x, y + previewHeight)
     .lineTo(x + width, y + previewHeight)
     .stroke();
     
  // Info area background
  doc.rect(x + padding, y + previewHeight + padding, width - padding * 2, infoHeight - padding * 2).fill('#FFFFFF');
  
  // Title with check icon
  doc.fontSize(8).font('Helvetica-Bold').fillColor(buffer ? '#235347' : '#94A3B8').text(`${buffer ? '✓ ' : '✗ '}${title}`, x + 6, y + previewHeight + 6);
  
  // Filename
  doc.fontSize(6).font('Helvetica').fillColor('#64748B').text(fileName, x + 6, y + previewHeight + 18, { width: width - 12, height: 18, ellipsis: true });
  
  // File type and upload status
  const statusStr = buffer ? 'Status: Active' : 'Status: Missing';
  doc.fontSize(6).font('Helvetica').fillColor(buffer ? '#16A34A' : '#94A3B8').text(statusStr, x + 6, y + previewHeight + 38);
}

export async function generateMembershipPDF(params: PDFParams): Promise<Buffer> {
  const { application } = params;
  let { photographBuffer, signatureBuffer, receiptBuffer } = params;

  // Compress buffers asynchronously before starting PDF generation
  if (photographBuffer) {
    photographBuffer = await compressImage(photographBuffer, 300, 75);
  }
  if (signatureBuffer) {
    signatureBuffer = await compressImage(signatureBuffer, 400, 75);
  }
  if (receiptBuffer) {
    receiptBuffer = await compressImage(receiptBuffer, 800, 75);
  }

  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50, size: 'A4' });
      const chunks: Buffer[] = [];
      
      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', (err) => reject(err));
      
      // ─── PAGE 1: APPLICATION DETAIL FORM ───
      
      // 1. Logo & Header Block
      const logoPath = path.join(process.cwd(), 'public', 'logo_high_res_v4.png');
      if (fs.existsSync(logoPath)) {
        try {
          doc.image(logoPath, 50, 45, { width: 55 });
        } catch (logoErr) {
          console.error("Failed to load logo in PDFKit:", logoErr);
        }
      }
      
      // Society text next to logo
      doc.fontSize(15).font('Helvetica-Bold').fillColor('#051F20').text('BATTERY RESEARCH SOCIETY OF INDIA', 115, 48);
      doc.fontSize(9).font('Helvetica').fillColor('#235347').text('E-mail: brsoffice.india@gmail.com | Website: brsindia.org.in', 115, 68);
      doc.fontSize(9).font('Helvetica-Oblique').fillColor('#555555').text('Registered Office: Indian Institute of Science (IISc), Bangalore', 115, 82);
      
      // Photo box on the top-right
      const photoX = 455;
      const photoY = 45;
      const photoW = 90;
      const photoH = 105;
      
      doc.rect(photoX, photoY, photoW, photoH).strokeColor('#8EB69B').lineWidth(0.5).stroke();
      if (photographBuffer && isValidImageForPDF(photographBuffer)) {
        try {
          doc.image(photographBuffer, photoX + 2, photoY + 2, { 
            width: photoW - 4, 
            height: photoH - 4,
            fit: [photoW - 4, photoH - 4]
          });
        } catch (photoErr) {
          console.error("Failed to draw photograph image in PDF:", photoErr);
          doc.fontSize(7).fillColor('#ff0000').text('Failed to load image', photoX + 5, photoY + 45, { width: photoW - 10, align: 'center' });
        }
      } else if (photographBuffer) {
        doc.fontSize(7).fillColor('#555555').text('Non-image file (PDF)\nSee BRS Admin Panel', photoX + 5, photoY + 40, { width: photoW - 10, align: 'center' });
      } else {
        doc.fontSize(7).fillColor('#8EB69B').text('PASSPORT\nPHOTO', photoX + 5, photoY + 42, { width: photoW - 10, align: 'center' });
      }
      
      // Form Title
      doc.fontSize(12).font('Helvetica-Bold').fillColor('#235347').text('MEMBERSHIP APPLICATION FORM', 50, 130);
      const submissionDate = application.created_at ? new Date(application.created_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) : new Date().toLocaleString('en-IN');
      doc.fontSize(8.5).font('Helvetica').fillColor('#555555').text(`Submission Date/Time: ${submissionDate} (IST)`, 50, 146);
      
      // Main Divider
      doc.strokeColor('#235347').lineWidth(1).moveTo(50, 160).lineTo(545, 160).stroke();
      
      let currentY = 175;
      
      // Section 1: PERSONAL & CONTACT INFORMATION
      currentY = drawSectionHeader(doc, 'PERSONAL & CONTACT INFORMATION', currentY);
      
      const fullName = `${application.prefix || ''} ${application.first_name || ''} ${application.last_name || ''}`.trim();
      const fullAddress = [
        application.street_address,
        application.address_line2,
        `${application.city || ''}, ${application.state_region || ''} ${application.zip_code || ''}`,
        application.country
      ].filter(Boolean).join(', ');

      const personalRows: [string, string][] = [
        ['Full Name', fullName],
        ['Email Address', application.email],
        ['Contact Number', application.contact_number],
        ['Mailing Address', fullAddress],
        ['Membership Category', application.membership_type],
        ['Application Fee Status', `Paid: INR ${application.amount || '0'}`]
      ];
      
      currentY = drawTable(doc, 50, currentY, 495, personalRows, [160, 335]) + 15;
      
      // Section 2: ACADEMIC & PROFESSIONAL DETAILS
      currentY = drawSectionHeader(doc, 'ACADEMIC & PROFESSIONAL DETAILS', currentY);
      
      const academicRows: [string, string][] = [
        ['Academic Degree', application.academic_degree],
        ['Present Affiliation / Institution', application.present_affiliation],
        ['Past Professional Affiliations', application.past_affiliations || 'None specified'],
        ['Selected Publications / Patents / Honors', application.publications || 'None specified']
      ];
      
      drawTable(doc, 50, currentY, 495, academicRows, [160, 335]);
      
      // Page 1 footer
      doc.fontSize(7.5).font('Helvetica').fillColor('#999999').text('Page 1 of 2', 50, 780, { align: 'center', width: 495 });
      
      // ─── PAGE 2: STATEMENT, SIGNATURES & PROOFS ───
      doc.addPage();
      
      let p2Y = 50;
      
      // Section 3: STATEMENT OF INTENT
      p2Y = drawSectionHeader(doc, 'STATEMENT OF INTENT', p2Y);
      p2Y = drawStatementBox(doc, application.statement, p2Y) + 15;
      
      // Section 4: SUBMITTED DOCUMENTS
      p2Y = drawSectionHeader(doc, 'SUBMITTED DOCUMENTS', p2Y);
      
      const cardWidth = 150;
      const cardHeight = 170;
      const spacing = 22.5;
      
      drawDocumentBox(doc, 50, p2Y, cardWidth, cardHeight, 'Photograph', photographBuffer, application.photograph_url);
      drawDocumentBox(doc, 50 + cardWidth + spacing, p2Y, cardWidth, cardHeight, 'Signature Specimen', signatureBuffer, application.signature_url);
      drawDocumentBox(doc, 50 + (cardWidth + spacing) * 2, p2Y, cardWidth, cardHeight, 'Payment Screenshot', receiptBuffer, application.receipt_url);
      
      p2Y += cardHeight + 15;
      
      // Section 5: DECLARATION & SIGN-OFF
      p2Y = drawSectionHeader(doc, 'DECLARATION & SIGN-OFF', p2Y);
      
      doc.fontSize(7.5)
         .font('Helvetica-Oblique')
         .fillColor('#475569')
         .text(
           'I hereby declare that the details furnished in this application are true and correct to the best of my knowledge and belief, and I agree to abide by the rules and regulations of the Battery Research Society of India.',
           50, p2Y, { width: 495, lineGap: 2.5 }
         );
         
      p2Y += 35;
      
      // Submission Date (Left)
      const dateText = application.created_at ? new Date(application.created_at).toLocaleDateString('en-IN') : new Date().toLocaleDateString('en-IN');
      doc.fontSize(8).font('Helvetica-Bold').fillColor('#555555').text('Date of Submission', 50, p2Y);
      doc.fontSize(8.5).font('Helvetica').fillColor('#000000').text(dateText, 50, p2Y + 12);
      
      // Signature overlay (Right)
      const sigX = 345;
      doc.fontSize(8).font('Helvetica-Bold').fillColor('#555555').text('Applicant Signature Specimen', sigX, p2Y);
      
      doc.strokeColor('#94A3B8').lineWidth(0.5).moveTo(sigX, p2Y + 45).lineTo(sigX + 200, p2Y + 45).stroke();
      
      if (signatureBuffer && isValidImageForPDF(signatureBuffer)) {
        try {
          doc.image(signatureBuffer, sigX + 10, p2Y + 10, {
            width: 180,
            height: 32,
            fit: [180, 32]
          });
        } catch (sigErr) {
          console.error("Failed to render signature overlay:", sigErr);
        }
      }
      
      doc.fontSize(6.5).font('Helvetica-Oblique').fillColor('#64748B').text(
        signatureBuffer ? 'Electronic Verification Specimen' : 'Specimen not uploaded / PDF format',
        sigX, p2Y + 49
      );
      
      // Page 2 footer
      doc.fontSize(7.5).font('Helvetica').fillColor('#999999').text('Page 2 of 2', 50, 780, { align: 'center', width: 495 });
      
      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}
