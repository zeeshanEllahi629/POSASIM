import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // In this POS, customers are likely stored in the user table with type=2 or similar
    // Assuming users table handles customers.
    const customers = await prisma.user.findMany({
      where: { type: 2 }, // Assuming type 2 is customer
      select: { id: true, name: true, email: true, mobile: true, address: true }
    });

    const items = await prisma.item.findMany({
      where: { item_status: 1 },
      select: { id: true, item_name: true, price: true, sku: true }
    });

    // In a real scenario, taxes and locations might come from DB
    const locations = [
      { id: 1, name: "Main Branch" },
      { id: 2, name: "Warehouse" }
    ];
    const taxes = [
      { id: 1, name: "GST 18%", rate: 18 },
      { id: 2, name: "VAT 5%", rate: 5 },
      { id: 3, name: "None", rate: 0 }
    ];

    const serializedItems = JSON.parse(JSON.stringify(items, (k, v) => typeof v === 'bigint' ? v.toString() : v));
    const serializedCustomers = JSON.parse(JSON.stringify(customers, (k, v) => typeof v === 'bigint' ? v.toString() : v));

    return NextResponse.json({
      customers: serializedCustomers,
      items: serializedItems,
      locations,
      taxes
    });
  } catch (error) {
    console.error("Sales Form Data Error:", error);
    return NextResponse.json({ error: "Failed to load form data" }, { status: 500 });
  }
}
