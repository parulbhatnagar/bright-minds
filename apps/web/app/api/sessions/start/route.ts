import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient, createSession } from '@bright-minds/db';
import { StartSessionRequestSchema } from '@bright-minds/types';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = StartSessionRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'invalid_request' }, { status: 400 });
  }

  try {
    const supabase = createServiceClient();
    const session = await createSession(supabase, parsed.data.childId, parsed.data.module);
    return NextResponse.json({ session });
  } catch {
    return NextResponse.json({ error: 'session_unavailable' }, { status: 503 });
  }
}
