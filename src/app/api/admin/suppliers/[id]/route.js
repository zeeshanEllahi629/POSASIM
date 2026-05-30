import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(req, { params }) {
  try {
    const id = params.id;
    const body = await req.json();
    const { name, phone, email, address, company, notes } = body;

    if (!name) {
      return NextResponse.json({ status: 0, error: "Supplier name is required" }, { status: 400 });
    }

    const updated = await prisma.suppliers.update({
      where: { id: BigInt(id) },
      data: {
        name,
        phone,
        email,
        address,
        company,
        notes,
      },
    });

    const serialized = JSON.parse(
      JSON.stringify(updated, (key, value) =>
        typeof value === "bigint" ? value.toString() : value
      )
    );

    return NextResponse.json({ status: 1, supplier: serialized }, { status: 200 });
  } catch (error) {
    console.error("PUT Supplier Error:", error);
    return NextResponse.json({ status: 0, error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const id = params.id;

    // Soft delete: set status to 0
    await prisma.suppliers.update({
      where: { id: BigInt(id) },
      data: {
        status: 0,
      },
    });

    return NextResponse.json({ status: 1, message: "Supplier deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("DELETE Supplier Error:", error);
    return NextResponse.json({ status: 0, error: "Internal Server Error" }, { status: 500 });
  }
}
