import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { randomUUID } from 'crypto';
import { generateMembershipPDF, slugifyName, formatTimestampForPDF } from '@/lib/pdfGenerator';
import { escapeHtml } from '@/lib/utils';

const resend = new Resend(process.env.RESEND_API_KEY);

function logDebug(message: string, error?: any) {
  console.log(`[PDF-DEBUG] ${message}`, error || '');
}

async function uploadToStorage(file: File, folder: string): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${randomUUID()}.${fileExt}`;
  const filePath = `${folder}/${fileName}`;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const { error } = await supabaseAdmin.storage
    .from('brs-india')
    .upload(filePath, buffer, {
      contentType: file.type,
      duplex: 'half'
    });

  if (error) {
    throw new Error(`Upload failed for ${file.name}: ${error.message}`);
  }

  return filePath;
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    
    // Extract fields
    const prefix = formData.get('prefix') as string || '';
    const firstName = formData.get('firstName') as string || '';
    const lastName = formData.get('lastName') as string || '';
    const email = formData.get('email') as string || '';
    const contactNumber = formData.get('contactNumber') as string || '';
    const streetAddress = formData.get('streetAddress') as string || '';
    const addressLine2 = formData.get('addressLine2') as string || '';
    const city = formData.get('city') as string || '';
    const stateRegion = formData.get('stateRegion') as string || '';
    const zipCode = formData.get('zipCode') as string || '';
    const country = formData.get('country') as string || '';
    const membershipTypeDropdown = formData.get('membershipTypeDropdown') as string || '';
    const amount = formData.get('amount') as string || '0';
    
    const academicDegree = formData.get('academicDegree') as string || '';
    const presentAffiliation = formData.get('presentAffiliation') as string || '';
    const pastAffiliations = formData.get('pastAffiliations') as string || '';
    const publications = formData.get('publications') as string || '';
    const statement = formData.get('statement') as string || '';

    // Extract files
    const photographFile = formData.get('photograph') as File | null;
    const signatureFile = formData.get('signature') as File | null;
    const receiptFile = formData.get('receipt') as File | null;

    // Validate text inputs
    if (!firstName || firstName.trim() === '') {
      return NextResponse.json({ error: "First name is required." }, { status: 400 });
    }
    if (!/^[a-zA-Z\s'.\-\u00C0-\u017F]+$/.test(firstName)) {
      return NextResponse.json({ error: "First name should contain only letters, spaces, hyphens, apostrophes, or periods." }, { status: 400 });
    }

    if (!lastName || lastName.trim() === '') {
      return NextResponse.json({ error: "Last name is required." }, { status: 400 });
    }
    if (!/^[a-zA-Z\s'.\-\u00C0-\u017F]+$/.test(lastName)) {
      return NextResponse.json({ error: "Last name should contain only letters, spaces, hyphens, apostrophes, or periods." }, { status: 400 });
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email || email.trim() === '') {
      return NextResponse.json({ error: "Email address is required." }, { status: 400 });
    }
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    const contactClean = (contactNumber || "").replace(/\s/g, "").replace(/\-/g, "").replace(/\+/g, "");
    if (!contactNumber || contactNumber.trim() === '') {
      return NextResponse.json({ error: "Contact number is required." }, { status: 400 });
    }
    if (!/^\+?[0-9\s\-()]{7,20}$/.test(contactNumber) || contactClean.length < 7 || contactClean.length > 15) {
      return NextResponse.json({ error: "Please enter a valid contact number (7 to 15 digits)." }, { status: 400 });
    }

    if (!streetAddress || streetAddress.trim() === '') {
      return NextResponse.json({ error: "Street address is required." }, { status: 400 });
    }

    if (!city || city.trim() === '') {
      return NextResponse.json({ error: "City is required." }, { status: 400 });
    }
    if (!/^[a-zA-Z\s.\-]+$/.test(city)) {
      return NextResponse.json({ error: "City should contain only letters, spaces, hyphens, or periods." }, { status: 400 });
    }

    if (!stateRegion || stateRegion.trim() === '') {
      return NextResponse.json({ error: "State / Region is required." }, { status: 400 });
    }
    if (!/^[a-zA-Z\s.\-]+$/.test(stateRegion)) {
      return NextResponse.json({ error: "State / Region should contain only letters, spaces, hyphens, or periods." }, { status: 400 });
    }

    if (!zipCode || zipCode.trim() === '') {
      return NextResponse.json({ error: "ZIP / Postal Code is required." }, { status: 400 });
    }
    if (!/^[a-zA-Z0-9\s\-]{3,10}$/.test(zipCode)) {
      return NextResponse.json({ error: "Please enter a valid ZIP / Postal Code (3 to 10 alphanumeric characters)." }, { status: 400 });
    }

    if (!membershipTypeDropdown || membershipTypeDropdown.trim() === '') {
      return NextResponse.json({ error: "Membership type is required." }, { status: 400 });
    }

    if (!academicDegree || academicDegree.trim() === '') {
      return NextResponse.json({ error: "Academic degree is required." }, { status: 400 });
    }

    if (!presentAffiliation || presentAffiliation.trim() === '') {
      return NextResponse.json({ error: "Present affiliation is required." }, { status: 400 });
    }

    const getWordCount = (str: string): number => {
      return str ? str.trim().split(/\s+/).filter(Boolean).length : 0;
    };

    if (!pastAffiliations || pastAffiliations.trim() === '') {
      return NextResponse.json({ error: "Past affiliation details are required." }, { status: 400 });
    }
    if (getWordCount(pastAffiliations) > 200) {
      return NextResponse.json({ error: "Past affiliations: Maximum 200 words allowed." }, { status: 400 });
    }

    if (!publications || publications.trim() === '') {
      return NextResponse.json({ error: "Selected publications are required." }, { status: 400 });
    }

    if (!statement || statement.trim() === '') {
      return NextResponse.json({ error: "Statement is required." }, { status: 400 });
    }
    if (getWordCount(statement) > 200) {
      return NextResponse.json({ error: "Statement: Maximum 200 words allowed." }, { status: 400 });
    }

    // Helper to validate file size, MIME type, extension, and security restrictions
    const validateFile = (
      file: File | null, 
      allowedExts: string[], 
      allowedMimes: string[], 
      maxBytes: number, 
      fieldName: string
    ) => {
      if (!file || file.size === 0) {
        return `Please upload a supported document for ${fieldName}.`;
      }
      
      if (file.size > maxBytes) {
        return `File size exceeds the maximum limit of ${maxBytes / (1024 * 1024)} MB.`;
      }
      
      const fileExt = file.name.split('.').pop()?.toLowerCase();
      if (!fileExt) {
        return "Invalid file format.";
      }
      
      const dangerousExts = ['exe', 'bat', 'js', 'php', 'zip', 'rar'];
      if (dangerousExts.includes(fileExt)) {
        return "Security block: Invalid file format.";
      }
      
      if (!allowedExts.includes(fileExt)) {
        const allowedText = fieldName === 'Payment Receipt' ? 'JPG, JPEG, PNG, WEBP, and PDF' : 'JPG, JPEG, PNG, and WEBP';
        return `Only ${allowedText} files are allowed.`;
      }
      
      const fileMime = file.type.toLowerCase();
      if (!allowedMimes.includes(fileMime)) {
        return "Invalid file format.";
      }
      
      return null;
    };

    // Photograph file validation
    const photoErr = validateFile(
      photographFile, 
      ['jpg', 'jpeg', 'png', 'webp'], 
      ['image/jpeg', 'image/png', 'image/webp'], 
      2 * 1024 * 1024, 
      'Photograph'
    );
    if (photoErr) return NextResponse.json({ error: photoErr }, { status: 400 });

    // Signature file validation
    const sigErr = validateFile(
      signatureFile, 
      ['jpg', 'jpeg', 'png', 'webp'], 
      ['image/jpeg', 'image/png', 'image/webp'], 
      1 * 1024 * 1024, 
      'Signature'
    );
    if (sigErr) return NextResponse.json({ error: sigErr }, { status: 400 });

    // Receipt file validation
    const receiptErr = validateFile(
      receiptFile, 
      ['jpg', 'jpeg', 'png', 'webp', 'pdf'], 
      ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'], 
      3 * 1024 * 1024, 
      'Payment Receipt'
    );
    if (receiptErr) return NextResponse.json({ error: receiptErr }, { status: 400 });

    let photographUrl = '';
    let signatureUrl = '';
    let receiptUrl = '';

    // Upload files in parallel
    const uploadPromises: Promise<void>[] = [];
    if (photographFile && photographFile.size > 0) {
      uploadPromises.push(
        uploadToStorage(photographFile, 'photographs').then((url) => {
          photographUrl = url;
        })
      );
    }
    if (signatureFile && signatureFile.size > 0) {
      uploadPromises.push(
        uploadToStorage(signatureFile, 'signatures').then((url) => {
          signatureUrl = url;
        })
      );
    }
    if (receiptFile && receiptFile.size > 0) {
      uploadPromises.push(
        uploadToStorage(receiptFile, 'receipts').then((url) => {
          receiptUrl = url;
        })
      );
    }

    if (uploadPromises.length > 0) {
      await Promise.all(uploadPromises);
    }

    const fullName = `${prefix} ${firstName} ${lastName}`;

    console.log("Processing Application for:", fullName, email);

    // Save to Database
    const { data: dbData, error: dbError } = await supabaseAdmin
      .from('membership_applications')
      .insert([
        {
          prefix,
          first_name: firstName,
          last_name: lastName,
          email,
          contact_number: contactNumber,
          street_address: streetAddress,
          address_line2: addressLine2,
          city,
          state_region: stateRegion,
          zip_code: zipCode,
          country,
          membership_type: membershipTypeDropdown,
          amount,
          academic_degree: academicDegree,
          present_affiliation: presentAffiliation,
          past_affiliations: pastAffiliations,
          publications,
          statement: statement,
          photograph_url: photographUrl,
          signature_url: signatureUrl,
          receipt_url: receiptUrl
        }
      ])
      .select('*')
      .single();

    if (dbError || !dbData) {
      console.error("Database Save Error:", dbError);
      return NextResponse.json(
        { error: `Database Save Failed: ${dbError ? dbError.message : 'No data returned'}` },
        { status: 500 }
      );
    }

    logDebug(`POST handler entered. Photograph: ${photographFile?.name} (Size: ${photographFile?.size}), Signature: ${signatureFile?.name} (Size: ${signatureFile?.size}), Receipt: ${receiptFile?.name} (Size: ${receiptFile?.size})`);

    let pdfBuffer: Buffer | null = null;
    let applicantSlug = '';
    let timestampStr = '';
    let pdfPath = '';

    // ==========================================
    // PDF GENERATION
    // ==========================================
    try {
      const getBuffer = async (file: any) => {
        if (!file || typeof file.arrayBuffer !== 'function' || file.size === 0) {
          return undefined;
        }
        return Buffer.from(await file.arrayBuffer());
      };
      
      logDebug("Reading buffers...");
      const photographBuffer = await getBuffer(photographFile);
      const signatureBuffer = await getBuffer(signatureFile);
      const receiptBuffer = await getBuffer(receiptFile);
      logDebug(`Buffers loaded. Photograph buffer: ${photographBuffer?.length} bytes, Signature buffer: ${signatureBuffer?.length} bytes, Receipt buffer: ${receiptBuffer?.length} bytes`);

      // Generate the PDF using helper
      logDebug("Starting generateMembershipPDF...");
      pdfBuffer = await generateMembershipPDF({
        application: dbData,
        photographBuffer,
        signatureBuffer,
        receiptBuffer
      });
      logDebug(`generateMembershipPDF finished successfully. PDF buffer size: ${pdfBuffer?.length} bytes`);

      // Construct path based on database-returned created_at
      applicantSlug = slugifyName(prefix, firstName, lastName);
      timestampStr = formatTimestampForPDF(dbData.created_at);
      pdfPath = `applications/${applicantSlug}/${timestampStr}.pdf`;
      logDebug(`Storage destination path: ${pdfPath}`);
    } catch (pdfErr: any) {
      logDebug("PDF generation failed", pdfErr);
      console.error("Graceful error handling: PDF generation failed:", pdfErr);
    }

    // ==========================================
    // PREPARE EMAIL PAYLOADS
    // ==========================================
    const safeFullName = escapeHtml(fullName);
    const safeEmail = escapeHtml(email);
    const safeContact = escapeHtml(contactNumber);
    const safeAffiliation = escapeHtml(presentAffiliation);
    const safeDegree = escapeHtml(academicDegree);
    const safeType = escapeHtml(membershipTypeDropdown);
    const safeAmount = escapeHtml(amount);
    const safeStatement = escapeHtml(statement);

    const adminEmailPayload: any = {
      from: 'BRS Admissions <admissions@brsindia.org.in>',
      to: 'brsoffice.india@gmail.com',
      cc: 'adarshrke2415@gmail.com',
      subject: `New Membership Application: ${fullName}`,
      replyTo: email, // If admin replies to notification, it goes to the applicant
      html: `
        <h2>New Membership Application Received</h2>
        <p><strong>Name:</strong> ${safeFullName}</p>
        <p><strong>Email:</strong> ${safeEmail}</p>
        <p><strong>Contact Number:</strong> ${safeContact}</p>
        <p><strong>Present Affiliation:</strong> ${safeAffiliation}</p>
        <p><strong>Academic Degree:</strong> ${safeDegree}</p>
        <p><strong>Selected Tier:</strong> ${safeType}</p>
        <p><strong>Amount Paid:</strong> ₹${safeAmount}</p>
        <hr />
        <h3>Statement of Intent:</h3>
        <p>${safeStatement}</p>
      `
    };

    if (pdfBuffer && applicantSlug && timestampStr) {
      logDebug("Attaching PDF to Admin email payload...");
      adminEmailPayload.attachments = [
        {
          filename: `BRS_Membership_Application_${applicantSlug}_${timestampStr}.pdf`,
          content: pdfBuffer.toString('base64'),
        }
      ];
    }

    let userSubject = 'Application Received - Battery Research Society of India';
    let userHtmlBody = `
      <h2>Thank you for applying, ${safeFullName}!</h2>
      <p>We have received your application for the <strong>${safeType}</strong> tier and your payment of <strong>₹${safeAmount}</strong> was successful.</p>
      <p>Our executive council is currently reviewing your application. You will receive an official confirmation and your Membership ID shortly.</p>
      <br />
      <p>For any queries, please feel free to reach out to us directly at <a href="mailto:brsoffice.india@gmail.com">brsoffice.india@gmail.com</a>.</p>
      <br />
      <p>Best Regards,</p>
      <p><strong>Battery Research Society of India</strong></p>
    `;

    try {
      const { data: customTemplate, error: templateError } = await supabaseAdmin
        .from('email_templates')
        .select('subject, body')
        .eq('id', 'membership_confirmation')
        .maybeSingle();

      if (!templateError && customTemplate) {
        const replacePlaceholders = (templateStr: string) => {
          return templateStr
            .replace(/\{\{fullName\}\}/g, safeFullName)
            .replace(/\{\{membershipType\}\}/g, safeType)
            .replace(/\{\{amount\}\}/g, safeAmount);
        };
        userSubject = replacePlaceholders(customTemplate.subject);
        userHtmlBody = replacePlaceholders(customTemplate.body);
      } else if (templateError) {
        console.warn("Could not load custom email template (likely migration not applied yet):", templateError.message);
      }
    } catch (dbFetchError) {
      console.error("Error loading email template from DB, using fallback defaults:", dbFetchError);
    }

    const userEmailPayload: any = {
      from: 'BRS India <info@brsindia.org.in>',
      to: email, // The Applicant's Email
      subject: userSubject,
      replyTo: 'brsoffice.india@gmail.com', // If applicant replies to confirmation, it goes to the working inbox
      html: userHtmlBody
    };

    if (pdfBuffer && applicantSlug && timestampStr) {
      logDebug("Attaching PDF to User email payload...");
      userEmailPayload.attachments = [
        {
          filename: `BRS_Membership_Application_${applicantSlug}_${timestampStr}.pdf`,
          content: pdfBuffer.toString('base64'),
        }
      ];
    }

    // ==========================================
    // RUN ASYNC I/O OPERATIONS IN PARALLEL
    // ==========================================
    const backgroundTasks: Promise<any>[] = [];

    // 1. Upload PDF to Storage
    if (pdfBuffer && pdfPath) {
      logDebug("Queuing PDF upload to Supabase Storage...");
      backgroundTasks.push(
        supabaseAdmin.storage
          .from('brs-india')
          .upload(pdfPath, pdfBuffer, {
            contentType: 'application/pdf',
            duplex: 'half'
          })
          .then(() => {
            logDebug("Upload to Supabase Storage succeeded.");
          })
          .catch(err => {
            console.error("Graceful error handling: PDF storage upload failed:", err);
          })
      );
    }

    // 2. Send Admin Notification Email
    logDebug("Queuing Admin email sending via Resend...");
    backgroundTasks.push(
      resend.emails
        .send(adminEmailPayload)
        .then(result => {
          if (result.error) {
            console.error("Graceful error handling: Resend Admin Notification Error:", result.error);
          } else {
            logDebug(`Admin email sent successfully. Result ID: ${result.data?.id}`);
          }
        })
        .catch(err => {
          console.error("Graceful error handling: Admin email exception:", err);
        })
    );

    // 3. Send User Confirmation Email
    logDebug("Queuing User email sending via Resend...");
    backgroundTasks.push(
      resend.emails
        .send(userEmailPayload)
        .then(result => {
          if (result.error) {
            console.error("Graceful error handling: Resend User Confirmation Error:", result.error);
          } else {
            logDebug(`User email sent successfully. Result ID: ${result.data?.id}`);
          }
        })
        .catch(err => {
          console.error("Graceful error handling: User confirmation email exception:", err);
        })
    );

    if (backgroundTasks.length > 0) {
      logDebug(`Awaiting ${backgroundTasks.length} background tasks concurrently...`);
      await Promise.all(backgroundTasks);
      logDebug("All concurrent background tasks completed.");
    }

    return NextResponse.json(
      { message: "Application submitted successfully and saved to database." },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("Error submitting application:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process application. Please try again." },
      { status: 500 }
    );
  }
}
