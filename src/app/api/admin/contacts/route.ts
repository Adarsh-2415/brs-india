import { NextResponse } from 'next/server';
import { supabaseAdmin, supabase } from '@/lib/supabase';

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

    // 2. Fetch contact submissions from database
    const { data: contacts, error: dbError } = await supabaseAdmin
      .from('contact_submissions')
      .select('*')
      .order('created_at', { ascending: false });

    if (dbError) {
      throw dbError;
    }

    return NextResponse.json(contacts || []);
  } catch (error: any) {
    console.error("Fetch contacts admin API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
