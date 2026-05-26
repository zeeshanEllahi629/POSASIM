import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    const users = await prisma.users.findMany({
      where: {
        type: 2,
        is_deleted: 2,
      },
      orderBy: {
        id: "desc",
      },
      select: {
        id: true,
        name: true,
        email: true,
        mobile: true,
        profile_image: true,
        wallet: true,
        login_type: true,
        is_available: true,
        is_verified: true,
      },
    });

    const serializedUsers = users.map((user) => ({
      ...user,
      id: user.id.toString(),
    }));

    return NextResponse.json({ status: 1, users: serializedUsers });
  } catch (error) {
    return NextResponse.json({ status: 0, error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, mobile, password } = body;

    if (!name || !email || !mobile || !password) {
      return NextResponse.json({ status: 0, error: "Missing required fields" });
    }

    // Check if email or mobile exists
    const existingEmail = await prisma.users.findFirst({
      where: { email, type: 2, is_deleted: 2 },
    });
    if (existingEmail) {
      return NextResponse.json({ status: 0, error: "Email already exists" });
    }

    const existingMobile = await prisma.users.findFirst({
      where: { mobile, type: 2, is_deleted: 2 },
    });
    if (existingMobile) {
      return NextResponse.json({ status: 0, error: "Mobile number already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const referralCode = Math.random().toString(36).substring(2, 12).toUpperCase();

    const newUser = await prisma.users.create({
      data: {
        name,
        email,
        mobile,
        password: hashedPassword,
        profile_image: "unknown.png",
        referral_code: referralCode,
        login_type: "email",
        type: 2,
        is_available: 1,
        is_verified: 1,
        token: "", // Required field based on schema
      },
    });

    return NextResponse.json({
      status: 1,
      user: {
        ...newUser,
        id: newUser.id.toString(),
      },
    });
  } catch (error) {
    console.error("Failed to add user:", error);
    return NextResponse.json({ status: 0, error: "Internal server error" }, { status: 500 });
  }
}
