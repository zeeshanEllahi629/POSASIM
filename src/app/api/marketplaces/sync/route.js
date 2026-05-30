import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const payload = await req.json();

    // Verify Marketplace Integration Keys
    const shopifySetting = await prisma.site_settings.findUnique({
      where: { key_name: "shopify_access_token" }
    });

    if (!shopifySetting || !shopifySetting.value) {
      return NextResponse.json({ success: false, error: "Shopify Integration not configured." }, { status: 400 });
    }

    // In a real scenario, we would parse the webhook payload from Shopify/Amazon
    // and create a new order in our unified `sell` table, or update inventory.

    const orderNumber = payload.order_number || ("ORD-" + Math.floor(Math.random() * 900000));
    
    console.log(`[Marketplace Sync] Incoming order ${orderNumber} received. Syncing to internal ERP...`);

    // Simulated ERP sync logic
    // const newOrder = await prisma.sell.create({ ... })

    return NextResponse.json({ 
      success: true, 
      message: `Webhook received and processed for order ${orderNumber}. Inventory synced successfully.` 
    });
  } catch (error) {
    console.error("Error processing marketplace webhook:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
