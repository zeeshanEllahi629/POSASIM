import { NextResponse } from "next/server";
import SyncEngine from "@/services/SyncEngine";
import prisma from "@/lib/prisma";

export async function POST(req) {
  try {
    const body = await req.json();
    const { action, sku, quantity, client_id } = body;

    const engine = new SyncEngine(client_id || 1);

    if (action === "inventory_update") {
      // Manually trigger a sync (usually this happens automatically when POS sells an item)
      await engine.syncInventoryChange(sku, quantity);
      return NextResponse.json({ success: true, message: `Dispatched sync for SKU ${sku}` });
    }

    return NextResponse.json({ success: false, error: "Unknown action" }, { status: 400 });

  } catch (error) {
    console.error("Sync API Error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET() {
  // Return the recent sync logs
  try {
    const logs = await prisma.sync_log.findMany({
      orderBy: { created_at: "desc" },
      take: 50
    });
    return NextResponse.json({ success: true, logs });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch logs" }, { status: 500 });
  }
}
