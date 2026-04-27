import { NextRequest, NextResponse } from 'next/server';
import { Webhook } from 'svix';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

type ClerkUserCreatedEvent = {
  data: {
    id: string;
    email_addresses: { email_address: string; id: string }[];
    first_name: string | null;
    last_name: string | null;
  };
  type: string;
};

export async function POST(req: NextRequest) {
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
  }

  // Get the Svix headers for verification
  const svixId = req.headers.get('svix-id');
  const svixTimestamp = req.headers.get('svix-timestamp');
  const svixSignature = req.headers.get('svix-signature');

  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json({ error: 'Missing svix headers' }, { status: 400 });
  }

  const body = await req.text();
  const wh = new Webhook(webhookSecret);

  let event: ClerkUserCreatedEvent;
  try {
    event = wh.verify(body, {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    }) as ClerkUserCreatedEvent;
  } catch {
    return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 });
  }

  if (event.type === 'user.created') {
    const { id, email_addresses, first_name, last_name } = event.data;
    const email = email_addresses[0]?.email_address ?? '';
    const name = [first_name, last_name].filter(Boolean).join(' ');

    try {
      await dbConnect();
      await User.findOneAndUpdate(
        { clerkId: id },
        { clerkId: id, email, name },
        { upsert: true, new: true }
      );
    } catch (err) {
      console.error('Failed to sync user to DB:', err);
      return NextResponse.json({ error: 'DB sync failed' }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
