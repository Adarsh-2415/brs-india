import { NextResponse } from 'next/server';
import { supabaseAdmin, authenticateAdmin } from '@/lib/supabaseAdmin';

// GET contact submissions (Admin only)
export async function GET(req: Request) {
  try {
    // 1. Authenticate Admin
    const auth = await authenticateAdmin(req);
    if ('errorResponse' in auth) {
      return auth.errorResponse;
    }

    // 2. Fetch contact submissions from database
    const { data: contacts, error: dbError } = await supabaseAdmin
      .from('contact_submissions')
      .select('*')
      .order('created_at', { ascending: false });

    if (dbError) {
      throw dbError;
    }

    // Process read state safely. If the 'is_read' column doesn't exist yet, default to false.
    const processedContacts = (contacts || []).map((c) => ({
      ...c,
      is_read: c.is_read !== undefined ? c.is_read : false,
    }));

    return NextResponse.json(processedContacts);
  } catch (error: any) {
    console.error("Fetch contacts admin API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PATCH toggle is_read status (Admin only)
export async function PATCH(req: Request) {
  try {
    // 1. Authenticate Admin
    const auth = await authenticateAdmin(req);
    if ('errorResponse' in auth) {
      return auth.errorResponse;
    }

    // 2. Parse body
    const body = await req.json();
    const { id, is_read } = body;

    if (!id) {
      return NextResponse.json({ error: 'Missing contact submission ID' }, { status: 400 });
    }

    // 3. Update in DB
    const { data, error: updateError } = await supabaseAdmin
      .from('contact_submissions')
      .update({ is_read })
      .eq('id', id)
      .select();

    if (updateError) {
      // Graceful message if the column has not been added yet
      if (updateError.code === '42703') {
        return NextResponse.json({ 
          error: 'column_missing',
          message: 'The "is_read" column does not exist in the database. Please run the SQL migration in your Supabase SQL Editor.'
        }, { status: 400 });
      }
      throw updateError;
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("Update contacts admin API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE contact submission (Admin only)
export async function DELETE(req: Request) {
  try {
    // 1. Authenticate Admin
    const auth = await authenticateAdmin(req);
    if ('errorResponse' in auth) {
      return auth.errorResponse;
    }

    // 2. Parse ID from URL
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing contact submission ID' }, { status: 400 });
    }

    // 3. Delete from DB
    const { error: deleteError } = await supabaseAdmin
      .from('contact_submissions')
      .delete()
      .eq('id', id);

    if (deleteError) {
      throw deleteError;
    }

    return NextResponse.json({ success: true, message: 'Submission deleted successfully' });
  } catch (error: any) {
    console.error("Delete contact admin API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
