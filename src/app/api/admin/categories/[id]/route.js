import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(req, { params }) {
  try {
    const id = params.id;
    const body = await req.json();
    const { category_name, image } = body;

    if (!category_name) {
      return NextResponse.json({ status: 0, error: "Category name is required" }, { status: 400 });
    }

    const updatedCategory = await prisma.categories.update({
      where: { id: BigInt(id) },
      data: {
        category_name,
        image: image || undefined,
      },
    });

    const serialized = JSON.parse(
      JSON.stringify(updatedCategory, (key, value) =>
        typeof value === "bigint" ? value.toString() : value
      )
    );

    return NextResponse.json({ status: 1, category: serialized }, { status: 200 });
  } catch (error) {
    console.error("PUT Category Error:", error);
    return NextResponse.json({ status: 0, error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  try {
    const id = params.id;
    const body = await req.json();
    const { is_available } = body; // should be 1 or 2

    if (is_available === undefined) {
      return NextResponse.json({ status: 0, error: "is_available status is required" }, { status: 400 });
    }

    // Update category
    await prisma.categories.update({
      where: { id: BigInt(id) },
      data: {
        is_available: Number(is_available),
      },
    });

    // Also update all items in this category
    // In our schema, cat_id in item is an Int, so we cast ID to Number.
    const numericId = Number(id);
    await prisma.item.updateMany({
      where: { cat_id: numericId },
      data: {
        item_status: Number(is_available),
      },
    });

    return NextResponse.json({ status: 1, message: "Status updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("PATCH Category Error:", error);
    return NextResponse.json({ status: 0, error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const id = params.id;
    
    // In our schema, we soft-delete the category by setting is_deleted = 1
    // or hard delete. The Laravel controller did a hard delete. Let's do a soft-delete:
    await prisma.categories.update({
      where: { id: BigInt(id) },
      data: {
        is_deleted: 1,
      },
    });

    // Also soft-delete or disable related items
    const numericId = Number(id);
    await prisma.item.updateMany({
      where: { cat_id: numericId },
      data: {
        item_status: 2, // disabled
      },
    });

    return NextResponse.json({ status: 1, message: "Category deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("DELETE Category Error:", error);
    return NextResponse.json({ status: 0, error: "Internal Server Error" }, { status: 500 });
  }
}
