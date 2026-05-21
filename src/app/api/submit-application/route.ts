import { NextResponse } from 'next/server';

import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const data = await req.json();
    
    // Extract data from the frontend
    const { 
      prefix,
      firstName, 
      lastName,
      email, 
      contactNumber, 
      presentAffiliation, 
      academicDegree, 
      statement, 
      membershipTypeDropdown,
      amount 
    } = data;

    const fullName = `${prefix} ${firstName} ${lastName}`;

    console.log("Processing Application for:", fullName, email);

    // ==========================================
    // 1. ADMIN EMAIL NOTIFICATION
    // ==========================================
    await resend.emails.send({
      from: 'BRS Admissions <admissions@brsindia.org.in>',
      to: 'adarshrke2415@gmail.com', // The Admin Email (Testing)
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

    // ==========================================
    // 2. USER CONFIRMATION EMAIL
    // ==========================================
    await resend.emails.send({
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

    // Simulated Success Response
    return NextResponse.json(
      { message: "Application submitted successfully and emails queued." },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error submitting application:", error);
    return NextResponse.json(
      { error: "Failed to process application. Please try again." },
      { status: 500 }
    );
  }
}
