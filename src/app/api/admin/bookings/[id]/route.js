import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(request, { params }) {
  try {
    const id = parseInt(params.id, 10);
    const body = await request.json();
    const { status, table_number } = body;

    if (status === 2 && !table_number) {
      return NextResponse.json({ status: 0, error: "Table number is required" }, { status: 400 });
    }

    const booking = await prisma.bookings.findUnique({ where: { id } });
    if (!booking) {
      return NextResponse.json({ status: 0, error: "Booking not found" }, { status: 404 });
    }

    let updateData = { status };
    if (status === 2) {
      updateData.table_number = parseInt(table_number, 10);
    } else if (status === 3) {
      updateData.table_number = null;
    }

    const updatedBooking = await prisma.bookings.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ status: 1, message: "Success", booking: updatedBooking });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ status: 0, error: "Server Error" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const id = parseInt(params.id, 10);
    await prisma.bookings.delete({ where: { id } });
    return NextResponse.json({ status: 1, message: "Deleted" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ status: 0, error: "Server Error" }, { status: 500 });
  }
}
