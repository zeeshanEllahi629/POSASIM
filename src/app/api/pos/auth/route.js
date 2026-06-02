import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req) {
  try {
    const { pin } = await req.json();

    if (!pin || pin.length !== 4) {
      return NextResponse.json({ status: 0, error: "Invalid PIN" }, { status: 400 });
    }

    // Find a staff member (type: 1) with this PIN
    const staff = await prisma.users.findFirst({
      where: {
        type: 1,
        pos_pin: pin,
        is_deleted: 2,
        is_available: 1
      },
      select: {
        id: true,
        name: true,
        email: true,
      }
    });

    if (staff) {
      return NextResponse.json({
        status: 1,
        message: "Authenticated",
        user: staff
      });
    } else {
      return NextResponse.json({ status: 0, error: "Incorrect PIN or Staff inactive" }, { status: 401 });
    }
  } catch (error) {
    console.error("POS Auth Error:", error);
    return NextResponse.json({ status: 0, error: "Internal server error" }, { status: 500 });
  }
}
