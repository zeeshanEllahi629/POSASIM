import { NextResponse } from 'next/server';
import { trackingService } from '@/services/TrackingService';

export async function POST(req) {
  try {
    const signature = req.headers.get('17webhook-token');
    if (process.env.TRACK17_WEBHOOK_SECRET && signature !== process.env.TRACK17_WEBHOOK_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await req.json();

    // Process async to avoid timeout
    trackingService.handleWebhook(payload).catch(console.error);

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
