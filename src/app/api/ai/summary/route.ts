import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateArticleSummary } from '@/lib/anthropic';

export async function POST(request: NextRequest) {
  // Check auth
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { title, body } = await request.json();
    if (!body || !title) {
      return NextResponse.json({ error: 'Title and body are required' }, { status: 400 });
    }

    const summary = await generateArticleSummary(body, title);
    return NextResponse.json({ summary });
  } catch (error: any) {
    console.error('AI summary error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate summary' },
      { status: 500 }
    );
  }
}
