import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/mongodb';
import JournalEntry from '@/models/JournalEntry';

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    // Get only the date field from entries that have actual content
    const entries = await JournalEntry.find({
      userId,
      $or: [
        { content: { $ne: "" } },
        { headline: { $ne: "" } },
        { "tasks.0": { $exists: true } },
        { dailyFocus: { $ne: "" } },
        { "gratitude.0": { $exists: true } }
      ]
    }, 'date');
    const dates = entries.map(entry => entry.date);
    return NextResponse.json(dates);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
