import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";


export async function POST(request) {
  try {
    const body = await request.json();
    const { image, title, description, type, cat_id, item_id } = body;

    const maxReorder = await prisma.slider.findFirst({
      orderBy: { reorder_id: "desc" },
    });
    const nextReorderId = maxReorder ? maxReorder.reorder_id + 1 : 1;

    const slider = await prisma.slider.create({
      data: {
        reorder_id: nextReorderId,
        image: image || "default-slider.png",
        title: title || "",
        description: description || "",
        type: type || null,
        cat_id: cat_id || 0,
        item_id: item_id || 0,
        is_available: 1,
      },
    });

    return NextResponse.json({
      status: 1,
      message: "Slider created successfully",
      slider: { ...slider },
    });
  } catch (error) {
    console.error("Slider creation error:", error);
    return NextResponse.json(
      { status: 0, error: "Failed to create slider" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const sliders = await prisma.slider.findMany({
      orderBy: { reorder_id: "asc" },
    });

    return NextResponse.json({ status: 1, sliders });
  } catch (error) {
    return NextResponse.json(
      { status: 0, error: "Failed to fetch sliders" },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "ID is required" }, { status: 400 });
    }

    await prisma.slider.delete({
      where: { id: parseInt(id) }
    });

    return NextResponse.json({ status: 1, message: "Slider deleted" });
  } catch (error) {
    console.error("Slider DELETE error:", error);
    return NextResponse.json({ status: 0, error: "Error deleting slider" }, { status: 500 });
  }
}
