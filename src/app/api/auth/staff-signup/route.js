import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // Check if user exists
    const existingUser = await prisma.users.findFirst({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with type = 1 (admin/staff) and is_approved = 0
    const newUser = await prisma.users.create({
      data: {
        name,
        email,
        password: hashedPassword,
        type: 1, // 1 is usually Admin/Staff in this system
        is_approved: 0,
        login_type: "email",
        profile_image: "default.png",
        token: "",
      },
    });

    return NextResponse.json(
      { message: "Registration successful. Please wait for super user approval." },
      { status: 201 }
    );
  } catch (error) {
    console.error("Staff Signup Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
