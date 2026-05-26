import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";


export async function GET() {
  try {
    const taxes = await prisma.tax.findMany({
      orderBy: { reorder_id: 'asc' }
    });
    return NextResponse.json({ status: 1, taxes });
  } catch (error) {
    console.error("GET Taxes Error:", error);
    return NextResponse.json({ status: 0, error: "Failed to fetch taxes" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, type, tax } = body;

    if (!name || !type || !tax) {
      return NextResponse.json({ status: 0, error: "All fields are required" }, { status: 400 });
    }

    // Get max reorder_id to place new tax at the end
    const maxReorder = await prisma.tax.aggregate({
      _max: { reorder_id: true }
    });
    const nextReorderId = (maxReorder._max.reorder_id || 0) + 1;

    const newTax = await prisma.tax.create({
      data: {
        name,
        type: parseInt(type),
        tax: tax.toString(),
        reorder_id: nextReorderId,
        is_available: 1
      }
    });

    return NextResponse.json({ status: 1, tax: newTax });
  } catch (error) {
    console.error("POST Tax Error:", error);
    return NextResponse.json({ status: 0, error: "Failed to create tax" }, { status: 500 });
  }
}

