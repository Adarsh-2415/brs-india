import { NextResponse } from 'next/server';
import { supabaseAdmin, authenticateAdmin } from '@/lib/supabaseAdmin';

export async function GET(req: Request) {
  try {
    // 1. Authenticate Admin
    const auth = await authenticateAdmin(req);
    if ('errorResponse' in auth) {
      return auth.errorResponse;
    }

    // 2. Fetch applications from database
    const { data: members, error: dbError } = await supabaseAdmin
      .from('membership_applications')
      .select('*')
      .order('created_at', { ascending: false });

    if (dbError) {
      throw dbError;
    }

    // 3. Generate signed URLs for private documents
    const processedMembers = await Promise.all(
      (members || []).map(async (member) => {
        let photographSignedUrl = '';
        let signatureSignedUrl = '';
        let receiptSignedUrl = '';

        if (member.photograph_url) {
          const { data: signedPhoto } = await supabaseAdmin.storage
            .from('brs-india')
            .createSignedUrl(member.photograph_url, 3600); // 1 hour validity
          if (signedPhoto) photographSignedUrl = signedPhoto.signedUrl;
        }

        if (member.signature_url) {
          const { data: signedSig } = await supabaseAdmin.storage
            .from('brs-india')
            .createSignedUrl(member.signature_url, 3600);
          if (signedSig) signatureSignedUrl = signedSig.signedUrl;
        }

        if (member.receipt_url) {
          const { data: signedRec } = await supabaseAdmin.storage
            .from('brs-india')
            .createSignedUrl(member.receipt_url, 3600);
          if (signedRec) receiptSignedUrl = signedRec.signedUrl;
        }

        return {
          ...member,
          photograph_signed_url: photographSignedUrl,
          signature_signed_url: signatureSignedUrl,
          receipt_signed_url: receiptSignedUrl,
        };
      })
    );

    return NextResponse.json(processedMembers);
  } catch (error: any) {
    console.error("Fetch members admin API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
