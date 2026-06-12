import { NextResponse } from 'next/server';
import { supabaseAdmin, supabase } from '@/lib/supabase';
import { randomUUID } from 'crypto';

// GET latest conference details (Public API)
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('conferences')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return NextResponse.json(data || {});
  } catch (error: any) {
    console.error("Fetch Conference Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST update conference details (Admin only)
export async function POST(req: Request) {
  try {
    // Check Authorization Header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized: No token provided' }, { status: 401 });
    }
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized: Invalid token' }, { status: 401 });
    }

    const formData = await req.formData();
    const title = formData.get('title') as string || '';
    const description = formData.get('description') as string || '';
    const linkUrl = formData.get('linkUrl') as string || '';
    const flyerFile = formData.get('flyer') as File | null;
    let flyerUrl = formData.get('existingFlyerUrl') as string || '';

    // Upload new flyer to 'flyers' public bucket if a new one is selected
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

    // Get current record ID
    const { data: currentConf } = await supabaseAdmin
      .from('conferences')
      .select('id')
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    let dbResult;
    if (currentConf) {
      // Update existing
      dbResult = await supabaseAdmin
        .from('conferences')
        .update({
          title,
          description,
          flyer_url: flyerUrl,
          link_url: linkUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', currentConf.id);
    } else {
      // Insert new if empty
      dbResult = await supabaseAdmin
        .from('conferences')
        .insert([{
          title,
          description,
          flyer_url: flyerUrl,
          link_url: linkUrl
        }]);
    }

    if (dbResult.error) {
      throw dbResult.error;
    }

    return NextResponse.json({ success: true, message: 'Conference updated successfully' });
  } catch (error: any) {
    console.error("Update Conference Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
