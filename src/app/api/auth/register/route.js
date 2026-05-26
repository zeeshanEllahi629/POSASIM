import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { hashPassword, signToken } from "@/lib/auth";

export async function POST(req) {
  try {
    const { name, email, password, mobile } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.users.findFirst({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = hashPassword(password);

    // Create user (type 2 = Customer)
    const user = await prisma.users.create({
      data: {
        name,
        email,
        password: hashedPassword,
        mobile: mobile || "",
        type: 2,
        login_type: "email",
        profile_image: "",
        token: "", // Will be set empty initially or random
      },
    });

    // Generate JWT token
    const token = signToken({
      id: user.id.toString(),
      email: user.email,
      name: user.name,
      type: user.type,
      role_id: user.role_id,
    });

    // Create response with user data
    const responseData = {
      user: {
        id: user.id.toString(),
        name: user.name,
        email: user.email,
        type: user.type,
        role_id: user.role_id,
        profile_image: user.profile_image,
      },
      token,
    };

    const response = NextResponse.json(responseData, { status: 201 });

    // Set cookie
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Register API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
