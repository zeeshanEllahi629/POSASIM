import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(req, { params }) {
  try {
    const { id } = params;
    const data = await req.json();

    const { adjustmentType, reason, variationQtys } = data;

    if (!adjustmentType || !variationQtys) {
      return NextResponse.json({ status: 0, error: "Missing required fields." }, { status: 400 });
    }

    const itemId = parseInt(id);

    const item = await prisma.item.findUnique({
      where: { id: BigInt(itemId) }
    });

    if (!item) {
      return NextResponse.json({ status: 0, error: "Item not found" }, { status: 404 });
    }

    const variationIds = Object.keys(variationQtys).map(vId => parseInt(vId));
    
    // Fetch current variations
    const currentVariations = await prisma.variation.findMany({
      where: {
        id: { in: variationIds }
      }
    });

    for (const vId of variationIds) {
      const variation = currentVariations.find(v => v.id === vId);
      if (!variation) continue;

      let newQty = variation.qty || 0;
      const inputQty = parseInt(variationQtys[vId]) || 0;
      const oldQty = newQty;

      if (adjustmentType === "add") {
        newQty = oldQty + inputQty;
      } else if (adjustmentType === "remove") {
        newQty = Math.max(0, oldQty - inputQty);
      } else {
        newQty = inputQty;
      }

      await prisma.variation.update({
        where: { id: vId },
        data: { qty: newQty }
      });

      // Log the action
      await prisma.activity_logs.create({
        data: {
          action: "stock_adjustment",
          module: "inventory",
          description: `Item: ${item.item_name} | Variation: ${variation.name || "Default"} | Old Qty: ${oldQty} | New Qty: ${newQty} | Type: ${adjustmentType} | Reason: ${reason}`,
          ip_address: req.headers.get("x-forwarded-for") || "127.0.0.1",
          user_agent: req.headers.get("user-agent") || "Next.js",
          created_at: new Date(),
          updated_at: new Date()
        }
      });
    }

    // Fetch updated variations and the new log for the response
    const updatedVariations = await prisma.variation.findMany({
      orderBy: { id: "asc" }
    });

    const newLog = await prisma.activity_logs.findFirst({
      where: { module: "inventory" },
      orderBy: { id: "desc" }
    });

    return NextResponse.json({
      status: 1,
      message: "Stock adjusted successfully",
      updatedVariations: JSON.parse(
        JSON.stringify(updatedVariations, (k, v) => (typeof v === "bigint" ? v.toString() : v))
      ),
      newLog: newLog ? JSON.parse(
        JSON.stringify(newLog, (k, v) => (typeof v === "bigint" ? v.toString() : v))
      ) : null
    });

  } catch (error) {
    console.error("PUT Inventory API Error:", error);
    return NextResponse.json({ status: 0, error: "Internal server error" }, { status: 500 });
  }
}
