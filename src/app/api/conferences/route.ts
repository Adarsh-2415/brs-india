import { NextResponse } from 'next/server';
import { supabaseAdmin, authenticateAdmin } from '@/lib/supabaseAdmin';
import { randomUUID } from 'crypto';

// GET conferences list
// If authorized admin: returns ALL conferences.
// If public: returns ONLY published conferences.
export async function GET(req: Request) {
  try {
    // Check if user is authenticated admin
    const authHeader = req.headers.get('Authorization');
    let isAdmin = false;
    
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
      if (!authError && user) {
        // Verify user matches our administrator whitelist criteria
        const email = (user.email || '').toLowerCase();
        if (
          email === 'brsoffice.india@gmail.com' ||
          email === 'adarshrke2415@gmail.com' ||
          email.endsWith('@brsindia.org.in')
        ) {
          isAdmin = true;
        }
      }
    }

    let query = supabaseAdmin.from('conferences').select('*');

    if (!isAdmin) {
      // Public users should only see published conferences
      query = query.eq('status', 'published');
    }

    const { data: conferences, error: dbError } = await query.order('created_at', { ascending: false });

    if (dbError) {
      throw dbError;
    }

    // Default missing columns safely for local development/staging compatibility
    const processedConferences = (conferences || []).map((c: any) => ({
      ...c,
      status: c.status !== undefined ? c.status : 'published',
      type: c.type !== undefined ? c.type : (c.flyer_url && c.link_url ? 'both' : (c.flyer_url ? 'flyer_only' : 'link_only')),
      created_at: c.created_at || c.updated_at || new Date().toISOString(),
      archived_at: c.archived_at || null
    }));

    // For public layout compatibility, if there are no conferences, return empty array
    return NextResponse.json(processedConferences);
  } catch (error: any) {
    console.error("Fetch Conferences Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST create or update a conference details (Admin only)
export async function POST(req: Request) {
  try {
    // 1. Authenticate Admin
    const auth = await authenticateAdmin(req);
    if ('errorResponse' in auth) {
      return auth.errorResponse;
    }

    // 2. Parse form data
    const formData = await req.formData();
    const id = formData.get('id') as string | null; // Pass id to update
    const title = formData.get('title') as string || '';
    const description = formData.get('description') as string || '';
    const linkUrl = formData.get('linkUrl') as string || '';
    const status = (formData.get('status') as string) || 'published';
    const flyerFile = formData.get('flyer') as File | null;
    let flyerUrl = formData.get('existingFlyerUrl') as string || '';

    // 3. Upload new flyer if present
    if (flyerFile && flyerFile.size > 0) {
      const fileExt = flyerFile.name.split('.').pop();
      const fileName = `${randomUUID()}.${fileExt}`;
      const filePath = `posters/${fileName}`;

      const arrayBuffer = await flyerFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const { error: uploadError } = await supabaseAdmin.storage
        .from('flyers')
        .upload(filePath, buffer, {
          contentType: flyerFile.type,
          duplex: 'half'
        });

      if (uploadError) {
        throw new Error(`Flyer upload failed: ${uploadError.message}`);
      }

      // Get public URL
      const { data: { publicUrl } } = supabaseAdmin.storage
        .from('flyers')
        .getPublicUrl(filePath);

      flyerUrl = publicUrl;
    }

    // Determine type automatically
    // Option A: Flyer Only (Flyer URL exists, Link URL does not)
    // Option B: Link Only (Link URL exists, Flyer URL does not)
    // Option C: Both (Both exist)
    let type = 'both';
    if (flyerUrl && !linkUrl) {
      type = 'flyer_only';
    } else if (!flyerUrl && linkUrl) {
      type = 'link_only';
    }

    // Prepare DB Payload
    const payload: any = {
      title,
      description,
      flyer_url: flyerUrl || null,
      link_url: linkUrl || null,
      status,
      type,
      updated_at: new Date().toISOString()
    };

    if (status === 'archived') {
      payload.archived_at = new Date().toISOString();
    }

    let dbResult;
    if (id) {
      // Update existing record
      dbResult = await supabaseAdmin
        .from('conferences')
        .update(payload)
        .eq('id', id)
        .select();
    } else {
      // Insert new record
      dbResult = await supabaseAdmin
        .from('conferences')
        .insert([payload])
        .select();
    }

    if (dbResult.error) {
      throw dbResult.error;
    }

    return NextResponse.json({ success: true, data: dbResult.data[0], message: 'Conference saved successfully' });
  } catch (error: any) {
    console.error("Save Conference Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PATCH toggle status or visiblity (Admin only)
export async function PATCH(req: Request) {
  try {
    // 1. Authenticate Admin
    const auth = await authenticateAdmin(req);
    if ('errorResponse' in auth) {
      return auth.errorResponse;
    }

    const body = await req.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const payload: any = {
      status,
      updated_at: new Date().toISOString()
    };

    if (status === 'archived') {
      payload.archived_at = new Date().toISOString();
    } else {
      payload.archived_at = null;
    }

    const { data, error: updateError } = await supabaseAdmin
      .from('conferences')
      .update(payload)
      .eq('id', id)
      .select();

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("Update Conference Status Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE conference (Admin only)
export async function DELETE(req: Request) {
  try {
    // 1. Authenticate Admin
    const auth = await authenticateAdmin(req);
    if ('errorResponse' in auth) {
      return auth.errorResponse;
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing conference ID' }, { status: 400 });
    }

    const { error: deleteError } = await supabaseAdmin
      .from('conferences')
      .delete()
      .eq('id', id);

    if (deleteError) {
      throw deleteError;
    }

    return NextResponse.json({ success: true, message: 'Conference deleted successfully' });
  } catch (error: any) {
    console.error("Delete Conference Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
