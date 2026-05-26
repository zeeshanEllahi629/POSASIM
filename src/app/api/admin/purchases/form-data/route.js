import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const suppliers = await prisma.suppliers.findMany({ where: { status: 1 } });
    
    // We don't have branches table yet, use dummy locations for now
    const locations = [
      { id: 1, name: "Main Branch" },
      { id: 2, name: "Warehouse" }
    ];

    const items = await prisma.item.findMany({
      where: { item_status: 1 },
      select: { id: true, item_name: true, price: true, sku: true }
    });

    const serializedItems = JSON.parse(JSON.stringify(items, (k, v) => typeof v === 'bigint' ? v.toString() : v));
    const serializedSuppliers = JSON.parse(JSON.stringify(suppliers, (k, v) => typeof v === 'bigint' ? v.toString() : v));

    return NextResponse.json({
      suppliers: serializedSuppliers,
      locations,
      items: serializedItems
    });
  } catch (error) {
    console.error("Purchase Form Data Error:", error);
    return NextResponse.json({ error: "Failed to load form data" }, { status: 500 });
  }
}
