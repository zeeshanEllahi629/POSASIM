import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";


export async function POST(request) {
  try {
    const data = await request.json();
    const { name, selection_type, selection_count, min_count, max_count } = data;

    const group = await prisma.addons_group.create({
      data: {
        name,
        selection_type: Number(selection_type),
        selection_count: Number(selection_count),
        min_count: Number(min_count),
        max_count: Number(max_count),
        reorder_id: 0,
        is_available: 1,
        is_deleted: 2,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });

    return NextResponse.json({ status: 1, group });
  } catch (error) {
    console.error("Error creating addons group:", error);
    return NextResponse.json({ status: 0, error: "Failed to create addons group" });
  }
}

