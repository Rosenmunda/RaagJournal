import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/mongodb';
import ImportantDate from '@/models/ImportantDate';

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();
  try {
    // Delete dates that have passed (before today 00:00)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    await ImportantDate.deleteMany({ userId, date: { $lt: today } });

    const dates = await ImportantDate.find({ userId }).sort({ date: 1 });
    return NextResponse.json(dates);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch dates' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();
  try {
    const { date, label } = await req.json();
    if (!date || !label) {
      return NextResponse.json({ error: 'Date and label are required' }, { status: 400 });
    }
    const newDate = await ImportantDate.create({ userId, date: new Date(date), label });
    return NextResponse.json(newDate);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create date' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
    // Only delete if it belongs to this user
    await ImportantDate.findOneAndDelete({ _id: id, userId });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete date' }, { status: 500 });
  }
}
