import { NextResponse } from "next/server";
import SyncEngine from "@/services/SyncEngine";

export async function POST(req) {
  try {
    const body = await req.json();
    const platform = req.headers.get("x-platform-source"); // e.g., 'shopify'
    
    // In a real scenario, we verify the webhook signature here!
    
    // Queue the webhook for processing
    console.log(`[Webhook Received] From ${platform}`);
    // Queue logic here...

    return NextResponse.json({ success: true, message: "Webhook accepted" });

  } catch (error) {
    return NextResponse.json({ success: false, error: "Invalid payload" }, { status: 400 });
  }
}
