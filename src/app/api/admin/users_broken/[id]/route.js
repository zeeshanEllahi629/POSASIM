import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { name, email, mobile } = body;

    if (!name || !email || !mobile) {
      return NextResponse.json({ status: 0, error: "Missing required fields" });
    }

    // Check if email or mobile exists for other users
    const existingEmail = await prisma.users.findFirst({
      where: {
        email,
        type: 2,
        is_deleted: 2,
        id: { not: BigInt(id) },
      },
    });
    if (existingEmail) {
      return NextResponse.json({ status: 0, error: "Email already exists" });
    }

    const existingMobile = await prisma.users.findFirst({
      where: {
        mobile,
        type: 2,
        is_deleted: 2,
        id: { not: BigInt(id) },
      },
    });
    if (existingMobile) {
      return NextResponse.json({ status: 0, error: "Mobile number already exists" });
    }

    const updatedUser = await prisma.users.update({
      where: { id: BigInt(id) },
      data: {
        name,
        email,
        mobile,
      },
    });

    return NextResponse.json({
      status: 1,
      user: {
        ...updatedUser,
        id: updatedUser.id.toString(),
      },
    });
  } catch (error) {
    console.error("Failed to update user:", error);
    return NextResponse.json({ status: 0, error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { is_available } = body;

    const updatedUser = await prisma.users.update({
      where: { id: BigInt(id) },
      data: { is_available },
    });

    return NextResponse.json({
      status: 1,
      user: {
        ...updatedUser,
        id: updatedUser.id.toString(),
      },
    });
  } catch (error) {
    return NextResponse.json({ status: 0, error: "Failed to update status" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;

    await prisma.users.update({
      where: { id: BigInt(id) },
      data: { is_deleted: 1 },
    });

    return NextResponse.json({ status: 1, message: "User deleted successfully" });
  } catch (error) {
    return NextResponse.json({ status: 0, error: "Failed to delete user" }, { status: 500 });
  }
}
