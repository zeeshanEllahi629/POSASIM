import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(req, { params }) {
  try {
    const id = params.id;
    await prisma.categories.update({
      where: { id: BigInt(id) },
      data: { is_deleted: 1 } // 1 means deleted in this schema
    });
    return NextResponse.json({ status: 1, message: "Category deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ status: 0, error: "Internal Error" }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const id = params.id;
    const body = await req.json();
    
    // Support either basic json update or FormData if needed, but for categories edit it's usually json
    if (body.category_name) {
      await prisma.categories.update({
        where: { id: BigInt(id) },
        data: {
          category_name: body.category_name,
          ...(body.image && { image: body.image })
        }
      });
    }
    return NextResponse.json({ status: 1, message: "Category updated" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ status: 0, error: "Internal Error" }, { status: 500 });
  }
}
