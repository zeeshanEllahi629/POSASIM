import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const data = await request.json();
    const { addongroup_id, name, price } = data;

    const addon = await prisma.addons.update({
      where: { id: Number(id) },
      data: {
        addongroup_id: Number(addongroup_id),
        name,
        price: String(price),
        updated_at: new Date(),
      },
    });

    return NextResponse.json({ status: 1, addon });
  } catch (error) {
    console.error("Error updating addon:", error);
    return NextResponse.json({ status: 0, error: "Failed to update addon" });
  }
}

export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const data = await request.json();

    const addon = await prisma.addons.update({
      where: { id: Number(id) },
      data: {
        is_available: Number(data.is_available),
        updated_at: new Date(),
      },
    });

    return NextResponse.json({ status: 1, addon });
  } catch (error) {
    console.error("Error toggling addon status:", error);
    return NextResponse.json({ status: 0, error: "Failed to toggle status" });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    await prisma.addons.update({
      where: { id: Number(id) },
      data: {
        is_deleted: 1,
        updated_at: new Date(),
      },
    });

    return NextResponse.json({ status: 1, message: "Deleted successfully" });
  } catch (error) {
    console.error("Error deleting addon:", error);
    return NextResponse.json({ status: 0, error: "Failed to delete addon" });
  }
}
