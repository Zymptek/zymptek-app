// app/auth/forgot-password/route.ts

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { Database } from '@/lib/database.types';

export async function POST(request: Request) {
  const requestUrl = new URL(request.url);
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore });

  const body = await request.json();
  const { email } = body;


  // Attempt to send a password reset email
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${requestUrl.origin}/auth/callback?redirect_to=/reset-password`, // URL where users will be redirected after clicking the reset link
  });

  if (error) {
    console.log(error)
    // Handle error if any
    return NextResponse.json({ error: error.message }, { status: 400 }); // Bad Request
  }

  // Success response, inform the user to check their email
  return NextResponse.json({ message: 'Password reset email sent. Please check your inbox.' }, { status: 200 });
}
