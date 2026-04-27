import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/mongodb';
import JournalEntry from '@/models/JournalEntry';

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const { searchParams } = new URL(req.url);
    const date = searchParams.get('date');

    if (date) {
      const entry = await JournalEntry.findOne({ userId, date });
      return NextResponse.json(entry || { notFound: true });
    }

    const entries = await JournalEntry.find({ userId }).sort({ date: -1 });
    return NextResponse.json(entries);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const data = await req.json();
    const { date } = data;

    if (!date) {
      return NextResponse.json({ error: 'Date is required' }, { status: 400 });
    }

    // Upsert the entry for the given user + date
    const entry = await JournalEntry.findOneAndUpdate(
      { userId, date },
      { $set: { ...data, userId } },
      { new: true, upsert: true }
    );

    return NextResponse.json(entry);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
