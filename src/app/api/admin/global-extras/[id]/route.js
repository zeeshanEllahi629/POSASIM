import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { name, price } = body;

    if (!name || !price) {
      return NextResponse.json({ status: 0, error: "Name and price are required" }, { status: 400 });
    }

    const updatedExtra = await prisma.global_extras.update({
      where: { id: parseInt(id) },
      data: {
        name,
        price,
      },
    });

    return NextResponse.json({ status: 1, extra: updatedExtra });
  } catch (error) {
    console.error("Error updating global extra:", error);
    return NextResponse.json({ status: 0, error: "Failed to update global extra" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    await prisma.global_extras.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ status: 1, message: "Global extra deleted successfully" });
  } catch (error) {
    console.error("Error deleting global extra:", error);
    return NextResponse.json({ status: 0, error: "Failed to delete global extra" }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { is_available } = body;

    if (is_available === undefined) {
      return NextResponse.json({ status: 0, error: "is_available is required" }, { status: 400 });
    }

    const updatedExtra = await prisma.global_extras.update({
      where: { id: parseInt(id) },
      data: {
        is_available,
      },
    });

    return NextResponse.json({ status: 1, extra: updatedExtra });
  } catch (error) {
    console.error("Error updating global extra status:", error);
    return NextResponse.json({ status: 0, error: "Failed to update global extra status" }, { status: 500 });
  }
}
