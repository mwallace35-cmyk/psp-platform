import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token');

  if (!token) {
    return NextResponse.redirect(new URL('/?error=invalid-token', request.url));
  }

  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('email_subscribers')
      .update({ confirmed: true, confirmed_at: new Date().toISOString() })
      .eq('confirmation_token', token)
      .eq('confirmed', false)
      .select('email')
      .single();

    if (error || !data) {
      return NextResponse.redirect(new URL('/?error=invalid-token', request.url));
    }

    return NextResponse.redirect(new URL('/?subscribed=true', request.url));
  } catch (err) {
    console.error('Confirm error:', err);
    return NextResponse.redirect(new URL('/?error=confirm-failed', request.url));
  }
}
