import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
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
        isAdmin = true;
      }
    }

    // Check if the schema migration has been applied (checking if 'status' column exists)
    const { error: schemaCheckError } = await supabaseAdmin
      .from('conferences')
      .select('status')
      .limit(1);

    const hasStatusColumn = !schemaCheckError;

    // Auto-seed IMBRS 2025 archived conference in database once columns exist
    if (hasStatusColumn) {
      const { data: existingIMBRS } = await supabaseAdmin
        .from('conferences')
        .select('id')
        .eq('title', 'International Meeting on Battery Research & Storage 2025')
        .limit(1)
        .maybeSingle();

      if (!existingIMBRS) {
        await supabaseAdmin.from('conferences').insert([{
          title: 'International Meeting on Battery Research & Storage 2025',
          description: 'Access the archived symposium archives, keynotes speaker directory, and scientific proceedings.',
          link_url: 'https://www.imbrs25.com/',
          status: 'archived',
          type: 'link_only',
          created_at: new Date('2025-01-15T00:00:00Z').toISOString(),
          archived_at: new Date('2025-01-20T00:00:00Z').toISOString()
        }]);
      }
    }

    let query = supabaseAdmin.from('conferences').select('*');

    if (!isAdmin) {
      // Public users should only see published conferences
      if (hasStatusColumn) {
        query = query.eq('status', 'published');
      }
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
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized: No token provided' }, { status: 401 });
    }
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized: Invalid token' }, { status: 401 });
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
      updated_at: new Date().toISOString()
    };

    // Safely add columns that might require DB migrations
    const { error: colCheck } = await supabaseAdmin.from('conferences').select('status, type').limit(1);
    if (!colCheck) {
      payload.status = status;
      payload.type = type;
      if (status === 'archived') {
        payload.archived_at = new Date().toISOString();
      }
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
      if (dbResult.error.code === '42703') {
        return NextResponse.json({
          error: 'column_missing',
          message: 'One or more required columns (status, type, archived_at) are missing from the database. Please run the SQL migration in your Supabase SQL Editor.'
        }, { status: 400 });
      }
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
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized: No token provided' }, { status: 401 });
    }
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized: Invalid token' }, { status: 401 });
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
      if (updateError.code === '42703') {
        return NextResponse.json({
          error: 'column_missing',
          message: 'The "status" column does not exist in the database. Please run the SQL migration in your Supabase SQL Editor.'
        }, { status: 400 });
      }
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
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized: No token provided' }, { status: 401 });
    }
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized: Invalid token' }, { status: 401 });
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
