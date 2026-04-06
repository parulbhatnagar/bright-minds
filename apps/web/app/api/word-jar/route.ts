import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient, getWordJar } from '@bright-minds/db';
import { z } from 'zod';

const GetWordJarSchema = z.object({ childId: z.string().min(1) });

export async function GET(req: NextRequest) {
  const parsed = GetWordJarSchema.safeParse({ childId: req.nextUrl.searchParams.get('childId') });
  if (!parsed.success) {
    return NextResponse.json({ error: 'invalid_request', message: 'childId is required' }, { status: 400 });
  }

  try {
    const supabase = createServiceClient();
    const words = await getWordJar(supabase, parsed.data.childId);
    return NextResponse.json({ words });
  } catch {
    return NextResponse.json({ error: 'unavailable' }, { status: 503 });
  }
}
