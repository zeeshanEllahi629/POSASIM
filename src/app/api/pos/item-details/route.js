import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const itemId = searchParams.get("item_id");

    if (!itemId) {
      return NextResponse.json(
        { status: 0, message: "Item ID is required" },
        { status: 400 }
      );
    }

    const itemIdInt = parseInt(itemId);

    // Fetch the item
    const item = await prisma.item.findUnique({
      where: { id: BigInt(itemId) },
    });

    if (!item) {
      return NextResponse.json(
        { status: 0, message: "Item not found" },
        { status: 404 }
      );
    }

    // Fetch variations
    const variations = await prisma.variation.findMany({
      where: { item_id: itemIdInt },
    });

    // Fetch extras
    const extras = await prisma.extras.findMany({
      where: { item_id: itemIdInt },
    });

    // Fetch addons if addons_id exists
    let addons = [];
    if (item.addons_id) {
      const addonIds = item.addons_id
        .split(",")
        .map((id) => parseInt(id.trim()))
        .filter((id) => !isNaN(id));

      if (addonIds.length > 0) {
        addons = await prisma.addons.findMany({
          where: { id: { in: addonIds } },
        });
      }
    }

    // Process BigInt to String
    const processedItem = {
      ...item,
      id: item.id.toString(),
      price: item.price ? parseFloat(item.price) : 0,
      qty: item.qty || 0,
      avg_ratting: item.avg_ratting ? parseFloat(item.avg_ratting) : 0,
      discount_percentage: item.discount_percentage ? parseFloat(item.discount_percentage) : 0,
    };

    const processedVariations = variations.map((v) => ({
      ...v,
      id: v.id.toString(),
      price: v.price ? parseFloat(v.price) : 0,
      original_price: v.original_price ? parseFloat(v.original_price) : 0,
      qty: v.qty || 0,
    }));

    const processedExtras = extras.map((e) => ({
      ...e,
      id: e.id.toString(),
      price: e.price ? parseFloat(e.price) : 0,
    }));

    const processedAddons = addons.map((a) => ({
      ...a,
      id: a.id.toString(),
      price: a.price ? parseFloat(a.price) : 0,
    }));

    return NextResponse.json(
      {
        status: 1,
        item: processedItem,
        variations: processedVariations,
        extras: processedExtras,
        addons: processedAddons,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("POS Item Details API Error:", error);
    return NextResponse.json(
      { status: 0, message: "Failed to load item details" },
      { status: 500 }
    );
  }
}
