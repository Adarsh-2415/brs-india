import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { generateMembershipPDF, slugifyName, formatTimestampForPDF } from '@/lib/pdfGenerator';

export async function GET(req: Request) {
  try {
    // 1. Authenticate Admin
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized: No token provided' }, { status: 401 });
    }
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized: Invalid token' }, { status: 401 });
    }

    // 2. Parse ID from query params
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Bad Request: Missing application ID' }, { status: 400 });
    }

    // 3. Fetch application record from database
    const { data: member, error: dbError } = await supabaseAdmin
      .from('membership_applications')
      .select('*')
      .eq('id', id)
      .single();

    if (dbError || !member) {
      return NextResponse.json(
        { error: `Application not found: ${dbError ? dbError.message : 'No record returned'}` },
        { status: 404 }
      );
    }

    // 4. Construct path based on applicant name and created_at timestamp
    const prefix = member.prefix || '';
    const firstName = member.first_name || '';
    const lastName = member.last_name || '';
    const applicantSlug = slugifyName(prefix, firstName, lastName);
    const timestampStr = formatTimestampForPDF(member.created_at);
    const pdfPath = `applications/${applicantSlug}/${timestampStr}.pdf`;

    // 5. Verify if PDF already exists in Storage
    const folder = `applications/${applicantSlug}`;
    const filename = `${timestampStr}.pdf`;
    
    const { data: files } = await supabaseAdmin.storage
      .from('brs-india')
      .list(folder, { search: filename });

    const pdfExists = files && files.some(f => f.name === filename);

    if (!pdfExists) {
      console.log(`PDF not found in storage at ${pdfPath}. Generating on-the-fly to self-heal...`);
      
      // Fetch buffers for photograph, signature, and receipt from Supabase storage if they exist
      let photographBuffer: Buffer | undefined;
      let signatureBuffer: Buffer | undefined;
      let receiptBuffer: Buffer | undefined;

      const downloadFileBuffer = async (storagePath: string): Promise<Buffer | undefined> => {
        try {
          const { data, error } = await supabaseAdmin.storage
            .from('brs-india')
            .download(storagePath);
          if (error) {
            console.error(`Failed to download ${storagePath} for PDF regeneration:`, error.message);
            return undefined;
          }
          if (data) {
            return Buffer.from(await data.arrayBuffer());
          }
        } catch (downloadErr) {
          console.error(`Exception downloading ${storagePath}:`, downloadErr);
        }
        return undefined;
      };

      if (member.photograph_url) {
        photographBuffer = await downloadFileBuffer(member.photograph_url);
      }
      if (member.signature_url) {
        signatureBuffer = await downloadFileBuffer(member.signature_url);
      }
      if (member.receipt_url) {
        receiptBuffer = await downloadFileBuffer(member.receipt_url);
      }

      // Generate the PDF
      const pdfBuffer = await generateMembershipPDF({
        application: member,
        photographBuffer,
        signatureBuffer,
        receiptBuffer
      });

      // Upload to Supabase Storage
      const { error: uploadError } = await supabaseAdmin.storage
        .from('brs-india')
        .upload(pdfPath, pdfBuffer, {
          contentType: 'application/pdf',
          duplex: 'half'
        });

      if (uploadError) {
        throw new Error(`On-the-fly PDF upload failed: ${uploadError.message}`);
      }

      console.log(`Successfully self-healed and uploaded PDF to ${pdfPath}`);
    }

    // 6. Generate signed URLs (one for view, one for download)
    const { data: signedView, error: signedViewError } = await supabaseAdmin.storage
      .from('brs-india')
      .createSignedUrl(pdfPath, 900); // 15 mins validity

    if (signedViewError || !signedView) {
      throw new Error(`Failed to generate signed view URL: ${signedViewError?.message}`);
    }

    const { data: signedDownload, error: signedDownloadError } = await supabaseAdmin.storage
      .from('brs-india')
      .createSignedUrl(pdfPath, 900, {
        download: `BRS_Application_${applicantSlug}_${timestampStr}.pdf`
      });

    if (signedDownloadError || !signedDownload) {
      throw new Error(`Failed to generate signed download URL: ${signedDownloadError?.message}`);
    }

    return NextResponse.json({
      viewUrl: signedView.signedUrl,
      downloadUrl: signedDownload.signedUrl
    });

  } catch (error: any) {
    console.error("Error in PDF signed URL endpoint:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
