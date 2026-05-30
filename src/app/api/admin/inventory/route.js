import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req) {
  try {
    const items = await prisma.item.findMany({
      where: {
        is_deleted: 2
      },
      orderBy: { id: "desc" }
    });

    const serializedItems = JSON.parse(
      JSON.stringify(items, (k, v) => (typeof v === "bigint" ? v.toString() : v))
    );

    return NextResponse.json({ status: 1, items: serializedItems });
  } catch (error) {
    console.error("GET Inventory API Error:", error);
    return NextResponse.json({ status: 0, error: "Internal server error" }, { status: 500 });
  }
}
