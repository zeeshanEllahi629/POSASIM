import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";


export async function GET() {
  try {
    const extras = await prisma.global_extras.findMany({
      orderBy: {
        reorder_id: "asc",
      },
    });
    return NextResponse.json({ status: 1, extras });
  } catch (error) {
    return NextResponse.json({ status: 0, error: "Failed to fetch global extras" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, price } = body;

    if (!name || !price) {
      return NextResponse.json({ status: 0, error: "Name and price are required" }, { status: 400 });
    }

    // Get max reorder_id
    const maxReorder = await prisma.global_extras.aggregate({
      _max: {
        reorder_id: true,
      },
    });

    const nextReorderId = (maxReorder._max.reorder_id || 0) + 1;

    // branch_id is hardcoded or fetched from auth session, using 1 for demo purposes based on typical admin structure
    const newExtra = await prisma.global_extras.create({
      data: {
        name,
        price,
        branch_id: 1, // Defaulting to 1 for admin
        reorder_id: nextReorderId,
        is_available: 1,
      },
    });

    return NextResponse.json({ status: 1, extra: newExtra });
  } catch (error) {
    console.error("Error creating global extra:", error);
    return NextResponse.json({ status: 0, error: "Failed to create global extra" }, { status: 500 });
  }
}

