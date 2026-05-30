import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";


export async function POST(request) {
  try {
    const body = await request.json();
    const { image, type, cat_id, item_id, section } = body;

    // Get max reorder_id to append
    const maxReorder = await prisma.banner.findFirst({
      orderBy: { reorder_id: "desc" },
    });
    const nextReorderId = maxReorder ? maxReorder.reorder_id + 1 : 1;

    const banner = await prisma.banner.create({
      data: {
        reorder_id: nextReorderId,
        image: image || "default-banner.png",
        type: type || null,
        cat_id: cat_id || null,
        item_id: item_id || null,
        section: section || 0,
        is_available: 1,
      },
    });

    return NextResponse.json({
      status: 1,
      message: "Banner created successfully",
      banner: { ...banner },
    });
  } catch (error) {
    console.error("Banner creation error:", error);
    return NextResponse.json(
      { status: 0, error: "Failed to create banner" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const banners = await prisma.banner.findMany({
      orderBy: { reorder_id: "asc" },
    });

    return NextResponse.json({ status: 1, banners });
  } catch (error) {
    return NextResponse.json(
      { status: 0, error: "Failed to fetch banners" },
      { status: 500 }
    );
  }
}

