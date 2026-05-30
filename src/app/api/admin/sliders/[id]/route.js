import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { image, title, description, type, cat_id, item_id } = body;

    const slider = await prisma.slider.update({
      where: { id: parseInt(id) },
      data: {
        image,
        title,
        description,
        type: type || null,
        cat_id: cat_id || 0,
        item_id: item_id || 0,
      },
    });

    return NextResponse.json({
      status: 1,
      message: "Slider updated successfully",
      slider,
    });
  } catch (error) {
    console.error("Slider update error:", error);
    return NextResponse.json(
      { status: 0, error: "Failed to update slider" },
      { status: 500 }
    );
  }
}

export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { is_available } = body;

    const slider = await prisma.slider.update({
      where: { id: parseInt(id) },
      data: {
        is_available: is_available,
      },
    });

    return NextResponse.json({
      status: 1,
      message: "Slider status updated successfully",
      slider,
    });
  } catch (error) {
    return NextResponse.json(
      { status: 0, error: "Failed to update slider status" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    await prisma.slider.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({
      status: 1,
      message: "Slider deleted successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { status: 0, error: "Failed to delete slider" },
      { status: 500 }
    );
  }
}
