import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import type { Database } from '@/lib/database.types';

export async function POST(request: Request) {
  try {
    // Parse JSON body
    const body = await request.json();
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    // Initialize Supabase client
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore });

    // Signup with Supabase
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${new URL(request.url).origin}/auth/callback`, // Email verification redirect
      },
    });

    // Handle Supabase error
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Success: redirect or return success response
    return NextResponse.json({ message: 'Signup successful, please check your email to verify your account.' }, { status: 201 });
  } catch (error) {
    console.error("Server Error:", error);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}
