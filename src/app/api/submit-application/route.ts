import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { supabaseAdmin } from '@/lib/supabase';
import { randomUUID } from 'crypto';

const resend = new Resend(process.env.RESEND_API_KEY);

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

    let photographUrl = '';
    let signatureUrl = '';
    let receiptUrl = '';

    // Upload files if they exist
    if (photographFile && photographFile.size > 0) {
      photographUrl = await uploadToStorage(photographFile, 'photographs');
    }
    if (signatureFile && signatureFile.size > 0) {
      signatureUrl = await uploadToStorage(signatureFile, 'signatures');
    }
    if (receiptFile && receiptFile.size > 0) {
      receiptUrl = await uploadToStorage(receiptFile, 'receipts');
    }

    const fullName = `${prefix} ${firstName} ${lastName}`;

    console.log("Processing Application for:", fullName, email);

    // Save to Database
    const { error: dbError } = await supabaseAdmin
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
          statement,
          photograph_url: photographUrl,
          signature_url: signatureUrl,
          receipt_url: receiptUrl
        }
      ]);

    if (dbError) {
      console.error("Database Save Error:", dbError);
      return NextResponse.json(
        { error: `Database Save Failed: ${dbError.message}` },
        { status: 500 }
      );
    }

    // ==========================================
    // 1. ADMIN EMAIL NOTIFICATION
    // ==========================================
    const adminEmailResult = await resend.emails.send({
      from: 'BRS Admissions <admissions@brsindia.org.in>',
      to: ['adarshrke2415@gmail.com', 'brsoffice.india@gmail.com'],
      subject: `New Membership Application: ${fullName}`,
      html: `
        <h2>New Membership Application Received</h2>
        <p><strong>Name:</strong> ${fullName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Contact Number:</strong> ${contactNumber}</p>
        <p><strong>Present Affiliation:</strong> ${presentAffiliation}</p>
        <p><strong>Academic Degree:</strong> ${academicDegree}</p>
        <p><strong>Selected Tier:</strong> ${membershipTypeDropdown}</p>
        <p><strong>Amount Paid:</strong> ₹${amount}</p>
        <hr />
        <h3>Statement of Intent:</h3>
        <p>${statement}</p>
      `
    });

    if (adminEmailResult.error) {
      console.error("Resend Admin Notification Error:", adminEmailResult.error);
      return NextResponse.json(
        { error: `Admin Notification Failed: ${adminEmailResult.error.message}` },
        { status: 500 }
      );
    }

    // ==========================================
    // 2. USER CONFIRMATION EMAIL
    // ==========================================
    const userEmailResult = await resend.emails.send({
      from: 'BRS India <info@brsindia.org.in>',
      to: email, // The Applicant's Email
      subject: 'Application Received - Battery Research Society of India',
      html: `
        <h2>Thank you for applying, ${fullName}!</h2>
        <p>We have received your application for the <strong>${membershipTypeDropdown}</strong> tier and your payment of <strong>₹${amount}</strong> was successful.</p>
        <p>Our executive council is currently reviewing your application. You will receive an official confirmation and your Membership ID shortly.</p>
        <br />
        <p>Best Regards,</p>
        <p><strong>Battery Research Society of India</strong></p>
      `
    });

    if (userEmailResult.error) {
      console.error("Resend User Confirmation Error:", userEmailResult.error);
      return NextResponse.json(
        { error: `Confirmation Email Failed: ${userEmailResult.error.message}` },
        { status: 500 }
      );
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
