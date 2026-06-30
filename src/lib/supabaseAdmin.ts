import "server-only";
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-key';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  console.warn("Warning: NEXT_PUBLIC_SUPABASE_URL environment variable is missing.");
}

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.warn("Warning: SUPABASE_SERVICE_ROLE_KEY environment variable is missing.");
}

// Client for backend server-side operations (uses service role key to bypass RLS)
export const supabaseAdmin = createClient(
  supabaseUrl,
  supabaseServiceKey,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    }
  }
);

/**
 * Checks if a user has administrative authorization based on an email whitelist.
 */
export function isUserAdmin(user: any): boolean {
  if (!user || !user.email) return false;
  const email = user.email.toLowerCase();
  return (
    email === 'brsoffice.india@gmail.com' ||
    email === 'adarshrke2415@gmail.com' ||
    email.endsWith('@brsindia.org.in')
  );
}

/**
 * Parses the Authorization header, validates the session, and checks if user is an admin.
 * Returns either the authorized user or a NextResponse to return directly.
 */
export async function authenticateAdmin(req: Request): Promise<{ user: any } | { errorResponse: NextResponse }> {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return {
      errorResponse: NextResponse.json({ error: 'Unauthorized: No token provided' }, { status: 401 })
    };
  }

  const token = authHeader.replace('Bearer ', '');
  const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);

  if (authError || !user) {
    return {
      errorResponse: NextResponse.json({ error: 'Unauthorized: Invalid token' }, { status: 401 })
    };
  }

  if (!isUserAdmin(user)) {
    return {
      errorResponse: NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 })
    };
  }

  return { user };
}
