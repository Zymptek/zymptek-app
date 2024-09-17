import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { Database } from '@/lib/database.types';

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient<Database>({ cookies: () => cookies() });

  try {
    const { email, password } = await request.json();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 401 }); // Unauthorized
    }

    return NextResponse.json('Successfully Signed In', { status: 201 }); // Redirect to home
  } catch (error) {
    console.error('Sign In Error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 }); // Internal Server Error
  }
}
