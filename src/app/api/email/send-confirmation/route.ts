import { NextRequest, NextResponse } from 'next/server';
import { sendConfirmationEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const { email, token } = await request.json();
    if (!email || !token) {
      return NextResponse.json({ error: 'Email and token required' }, { status: 400 });
    }

    if (!process.env.RESEND_API_KEY) {
      // Silently succeed in dev without Resend configured
      return NextResponse.json({ success: true, dev: true });
    }

    await sendConfirmationEmail(email, token);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Send confirmation error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
