import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { image, type, cat_id, item_id, section } = body;

    const banner = await prisma.banner.update({
      where: { id: parseInt(id) },
      data: {
        image,
        type: type || null,
        cat_id: cat_id || null,
        item_id: item_id || null,
        section: section || 0,
      },
    });

    return NextResponse.json({
      status: 1,
      message: "Banner updated successfully",
      banner,
    });
  } catch (error) {
    console.error("Banner update error:", error);
    return NextResponse.json(
      { status: 0, error: "Failed to update banner" },
      { status: 500 }
    );
  }
}

export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { is_available } = body;

    const banner = await prisma.banner.update({
      where: { id: parseInt(id) },
      data: {
        is_available: is_available,
      },
    });

    return NextResponse.json({
      status: 1,
      message: "Banner status updated successfully",
      banner,
    });
  } catch (error) {
    return NextResponse.json(
      { status: 0, error: "Failed to update banner status" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    await prisma.banner.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({
      status: 1,
      message: "Banner deleted successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { status: 0, error: "Failed to delete banner" },
      { status: 500 }
    );
  }
}
