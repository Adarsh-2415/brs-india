import { NextResponse } from 'next/server';
import { supabaseAdmin, authenticateAdmin } from '@/lib/supabaseAdmin';

const DEFAULT_SUBJECT = 'Application Received - Battery Research Society of India';
const DEFAULT_BODY = `<h2>Thank you for applying, {{fullName}}!</h2>
<p>We have received your application for the <strong>{{membershipType}}</strong> tier and your payment of <strong>₹{{amount}}</strong> was successful.</p>
<p>Our executive council is currently reviewing your application. You will receive an official confirmation and your Membership ID shortly.</p>
<br />
<p>For any queries, please feel free to reach out to us directly at <a href="mailto:brsoffice.india@gmail.com">brsoffice.india@gmail.com</a>.</p>
<br />
<p>Best Regards,</p>
<p><strong>Battery Research Society of India</strong></p>`;

export async function GET(req: Request) {
  try {
    // 1. Authenticate Admin
    const auth = await authenticateAdmin(req);
    if ('errorResponse' in auth) {
      return auth.errorResponse;
    }

    // 2. Fetch from DB
    const { data, error } = await supabaseAdmin
      .from('email_templates')
      .select('subject, body')
      .eq('id', 'membership_confirmation')
      .maybeSingle();

    if (error) {
      // If table doesn't exist, error code is typically '42P01' in PostgreSQL/PostgREST
      const migrationNeeded = error.code === '42P01';
      return NextResponse.json({
        subject: DEFAULT_SUBJECT,
        body: DEFAULT_BODY,
        isDefault: true,
        migrationNeeded,
        dbError: error.message
      });
    }

    if (!data) {
      return NextResponse.json({
        subject: DEFAULT_SUBJECT,
        body: DEFAULT_BODY,
        isDefault: true,
        migrationNeeded: false
      });
    }

    return NextResponse.json({
      subject: data.subject,
      body: data.body,
      isDefault: false,
      migrationNeeded: false
    });

  } catch (error: any) {
    console.error("GET Email Template Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    // 1. Authenticate Admin
    const auth = await authenticateAdmin(req);
    if ('errorResponse' in auth) {
      return auth.errorResponse;
    }

    // 2. Parse body
    const { subject, body } = await req.json();
    if (!subject || !body) {
      return NextResponse.json({ error: 'Subject and body are required' }, { status: 400 });
    }

    // 3. Upsert into DB
    const { error } = await supabaseAdmin
      .from('email_templates')
      .upsert({
        id: 'membership_confirmation',
        subject,
        body,
        updated_at: new Date().toISOString()
      });

    if (error) {
      const migrationNeeded = error.code === '42P01';
      return NextResponse.json({ 
        error: error.message, 
        migrationNeeded 
      }, { status: 500 });
    }

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("POST Email Template Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
