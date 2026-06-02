import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { name, email, mobile, role_id } = body;

    if (!name || !email) {
      return NextResponse.json({ status: 0, error: "Missing required fields" });
    }

    // Check if email or mobile exists for other users
    const existingEmail = await prisma.users.findFirst({
      where: {
        email,
        is_deleted: 2,
        id: { not: BigInt(id) },
      },
    });
    if (existingEmail) {
      return NextResponse.json({ status: 0, error: "Email already exists" });
    }

    if (mobile) {
      const existingMobile = await prisma.users.findFirst({
        where: {
          mobile,
          is_deleted: 2,
          id: { not: BigInt(id) },
        },
      });
      if (existingMobile) {
        return NextResponse.json({ status: 0, error: "Mobile number already exists" });
      }
    }

    const updatedUser = await prisma.users.update({
      where: { id: BigInt(id) },
      data: {
        name,
        email,
        mobile: mobile || "",
        ...(role_id && { role_id: parseInt(role_id) }),
      },
    });

    return NextResponse.json({
      status: 1,
      user: {
        ...updatedUser,
        id: updatedUser.id.toString(),
        role_id: updatedUser.role_id ? updatedUser.role_id.toString() : null,
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
    
    const updateData = {};
    if (body.is_available !== undefined) updateData.is_available = body.is_available;
    if (body.is_verified !== undefined) updateData.is_verified = body.is_verified;

    const updatedUser = await prisma.users.update({
      where: { id: BigInt(id) },
      data: updateData,
    });

    return NextResponse.json({
      status: 1,
      user: {
        ...updatedUser,
        id: updatedUser.id.toString(),
        role_id: updatedUser.role_id ? updatedUser.role_id.toString() : null,
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
