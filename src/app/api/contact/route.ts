import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { escapeHtml } from '@/lib/utils';
import { transporter, ADMIN_EMAILS } from '@/lib/nodemailer';

export async function POST(request: Request) {
  try {
    const { name, email, phone, enquiryType, message } = await request.json();

    // Basic validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Insert into Supabase database
    const { error: dbError } = await supabaseAdmin
      .from('contact_submissions')
      .insert([
        {
          name,
          email,
          phone,
          enquiry_type: enquiryType,
          message
        }
      ]);

    if (dbError) {
      console.error('Database Insertion Error:', dbError);
      return NextResponse.json(
        { error: `Database Error: ${dbError.message}` },
        { status: 500 }
      );
    }

    const safeName = escapeHtml(name || '');
    const safeEmail = escapeHtml(email || '');
    const safePhone = escapeHtml(phone || '');
    const safeEnquiryType = escapeHtml(enquiryType || '');
    const safeMessage = escapeHtml(message || '');

    const info = await transporter.sendMail({
      from: 'BRS India Contact <forms.futuresoft@gmail.com>',
      to: ADMIN_EMAILS,
      subject: `New Contact Inquiry: ${enquiryType} from ${name}`,
      replyTo: email,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333; line-height: 1.6;">
          <h2 style="color: #D97757;">New Contact Inquiry</h2>
          <p><strong>Name:</strong> ${safeName}</p>
          <p><strong>Email:</strong> ${safeEmail}</p>
          <p><strong>Phone:</strong> ${safePhone}</p>
          <p><strong>Enquiry Type:</strong> ${safeEnquiryType}</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p><strong>Message:</strong></p>
          <p style="white-space: pre-wrap;">${safeMessage}</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 0.8em; color: #777;">Sent from BRS India Contact Form</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true, messageId: info.messageId });
  } catch (err: any) {
    console.error('API Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
