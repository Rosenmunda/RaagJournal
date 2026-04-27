import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectToDatabase from '@/lib/mongodb';
import Ticker from '@/models/Ticker';

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectToDatabase();
    const ticker = await Ticker.findOne({ userId });
    if (!ticker) {
      return NextResponse.json({ lines: ["New journal entry published: 'The Caffeine Paradox'", "UI redesign in progress...", "Weather update: Severe procrastination warning"] }, { status: 200 });
    }
    return NextResponse.json(ticker, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectToDatabase();
    const { lines } = await req.json();

    const ticker = await Ticker.findOneAndUpdate(
      { userId }, 
      { lines, userId },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return NextResponse.json(ticker, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
