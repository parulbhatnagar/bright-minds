import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient, completeSession } from '@bright-minds/db';
import { CompleteSessionRequestSchema } from '@bright-minds/types';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = CompleteSessionRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'invalid_request' }, { status: 400 });
  }

  try {
    const supabase = createServiceClient();
    const session = await completeSession(supabase, parsed.data.sessionId, parsed.data.starsEarned);
    return NextResponse.json({ session });
  } catch {
    return NextResponse.json({ error: 'session_unavailable' }, { status: 503 });
  }
}
