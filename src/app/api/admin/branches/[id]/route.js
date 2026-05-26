import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(req, { params }) {
  try {
    const id = params.id;
    const body = await req.json();
    const { name, address, phone, email } = body;

    if (!name) {
      return NextResponse.json({ status: 0, error: "Branch name is required" }, { status: 400 });
    }

    const updated = await prisma.branches.update({
      where: { id: BigInt(id) },
      data: {
        name,
        address,
        phone,
        email,
      },
    });

    const serialized = JSON.parse(
      JSON.stringify(updated, (key, value) =>
        typeof value === "bigint" ? value.toString() : value
      )
    );

    return NextResponse.json({ status: 1, branch: serialized }, { status: 200 });
  } catch (error) {
    console.error("PUT Branch Error:", error);
    return NextResponse.json({ status: 0, error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  try {
    const id = params.id;
    const body = await req.json();
    const { status } = body; // should be 1 or 2

    if (status === undefined) {
      return NextResponse.json({ status: 0, error: "Status is required" }, { status: 400 });
    }

    const updated = await prisma.branches.update({
      where: { id: BigInt(id) },
      data: {
        status: Number(status),
      },
    });

    return NextResponse.json({ status: 1, message: "Status updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("PATCH Branch Error:", error);
    return NextResponse.json({ status: 0, error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const id = params.id;

    await prisma.branches.delete({
      where: { id: BigInt(id) },
    });

    return NextResponse.json({ status: 1, message: "Branch deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("DELETE Branch Error:", error);
    return NextResponse.json({ status: 0, error: "Internal Server Error" }, { status: 500 });
  }
}
