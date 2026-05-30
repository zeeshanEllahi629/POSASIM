import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function PUT(req) {
  try {
    const tokenCookie = req.cookies.get("token");
    if (!tokenCookie) {
      return NextResponse.json({ status: 0, error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyToken(tokenCookie.value);
    if (!payload || !payload.id) {
      return NextResponse.json({ status: 0, error: "Invalid token" }, { status: 401 });
    }

    const body = await req.json();
    const { name, phone } = body;

    const updatedUser = await prisma.users.update({
      where: { id: parseInt(payload.id) },
      data: {
        name: name || undefined,
        mobile: phone || undefined,
      }
    });

    return NextResponse.json({ 
      status: 1, 
      message: "Profile updated successfully", 
      user: {
        name: updatedUser.name,
        email: updatedUser.email,
        mobile: updatedUser.mobile ? updatedUser.mobile.toString() : "",
      }
    });

  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json({ status: 0, error: "Failed to update profile" }, { status: 500 });
  }
}
