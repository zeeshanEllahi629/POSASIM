import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(req, { params }) {
  try {
    const id = params.id;
    const body = await req.json();
    const { status, payment_status } = body;

    // Build data object dynamically based on what was passed
    const data = {};
    if (status !== undefined) data.status = status.toString();
    if (payment_status !== undefined) data.payment_status = Number(payment_status);

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ status: 0, error: "No fields to update provided" }, { status: 400 });
    }

    const updated = await prisma.order.update({
      where: { id: BigInt(id) },
      data,
    });

    const serialized = JSON.parse(
      JSON.stringify(updated, (key, value) =>
        typeof value === "bigint" ? value.toString() : value
      )
    );

    return NextResponse.json({ status: 1, order: serialized }, { status: 200 });
  } catch (error) {
    console.error("PATCH Order Error:", error);
    return NextResponse.json({ status: 0, error: "Internal Server Error" }, { status: 500 });
  }
}
