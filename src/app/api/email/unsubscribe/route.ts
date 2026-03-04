import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token');

  if (!token) {
    return NextResponse.redirect(new URL('/?error=invalid-token', request.url));
  }

  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from('email_subscribers')
      .delete()
      .eq('unsubscribe_token', token);

    if (error) throw error;

    return NextResponse.redirect(new URL('/?unsubscribed=true', request.url));
  } catch (err) {
    console.error('Unsubscribe error:', err);
    return NextResponse.redirect(new URL('/?error=unsubscribe-failed', request.url));
  }
}
