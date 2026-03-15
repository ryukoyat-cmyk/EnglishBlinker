import { NextRequest, NextResponse } from 'next/server';

import { parseWordLines } from '@/lib/parse';

export async function POST(req: NextRequest) {
  const { text } = (await req.json()) as { text?: string };

  if (!text) {
    return NextResponse.json({ message: 'text is required' }, { status: 400 });
  }

  const parsed = parseWordLines(text);

  return NextResponse.json(parsed);
}
