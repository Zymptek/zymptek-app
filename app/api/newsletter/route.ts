import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    // Validate email
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    // Initialize Supabase client
    const supabase = createRouteHandlerClient({ cookies });

    // Check if email already exists
    const { data: existingSubscriber } = await supabase
      .from('newsletter_subscribers')
      .select('id, is_active')
      .eq('email', email)
      .single();

    if (existingSubscriber) {
      if (existingSubscriber.is_active) {
        return NextResponse.json(
          { message: 'This email is already subscribed to our newsletter.' },
          { status: 400 }
        );
      } else {
        // Reactivate subscription
        const { error: updateError } = await supabase
          .from('newsletter_subscribers')
          .update({ is_active: true })
          .eq('email', email);

        if (updateError) throw updateError;

        return NextResponse.json(
          { message: 'Your newsletter subscription has been reactivated.' },
          { status: 200 }
        );
      }
    }

    // Insert new subscriber
    const { error: insertError } = await supabase
      .from('newsletter_subscribers')
      .insert([{ email }]);

    if (insertError) throw insertError;

    return NextResponse.json(
      { message: 'Thank you for subscribing to our newsletter!' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to process your subscription. Please try again later.' },
      { status: 500 }
    );
  }
} 