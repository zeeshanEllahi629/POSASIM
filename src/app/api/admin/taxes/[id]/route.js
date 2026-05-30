import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { name, type, tax } = body;

    if (!name || !type || !tax) {
      return NextResponse.json({ status: 0, error: "All fields are required" }, { status: 400 });
    }

    const updatedTax = await prisma.tax.update({
      where: { id: parseInt(id) },
      data: {
        name,
        type: parseInt(type),
        tax: tax.toString(),
      }
    });

    return NextResponse.json({ status: 1, tax: updatedTax });
  } catch (error) {
    console.error("PUT Tax Error:", error);
    return NextResponse.json({ status: 0, error: "Failed to update tax" }, { status: 500 });
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

    const updatedTax = await prisma.tax.update({
      where: { id: parseInt(id) },
      data: { is_available: parseInt(is_available) }
    });

    return NextResponse.json({ status: 1, tax: updatedTax });
  } catch (error) {
    console.error("PATCH Tax Error:", error);
    return NextResponse.json({ status: 0, error: "Failed to update status" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    await prisma.tax.delete({
      where: { id: parseInt(id) }
    });

    return NextResponse.json({ status: 1, message: "Tax deleted successfully" });
  } catch (error) {
    console.error("DELETE Tax Error:", error);
    return NextResponse.json({ status: 0, error: "Failed to delete tax" }, { status: 500 });
  }
}
