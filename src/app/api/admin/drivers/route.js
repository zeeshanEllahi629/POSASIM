import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    const driversList = await prisma.users.findMany({
      where: {
        type: 3,
        is_deleted: 2,
      },
      orderBy: {
        id: "desc",
      },
    });

    // Handle BigInt serialization
    const serialized = JSON.parse(
      JSON.stringify(driversList, (key, value) =>
        typeof value === "bigint" ? value.toString() : value
      )
    );

    return NextResponse.json({ status: 1, drivers: serialized }, { status: 200 });
  } catch (error) {
    console.error("GET Drivers Error:", error);
    return NextResponse.json({ status: 0, error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, mobile, identity_type, identity_number, password, profile_image } = body;

    if (!name || !email || !mobile || !password) {
      return NextResponse.json({ status: 0, error: "Name, email, mobile, and password are required" }, { status: 400 });
    }

    // Check if email or mobile exists (for type 3 and not deleted)
    const existingUser = await prisma.users.findFirst({
      where: {
        OR: [
          { email: email },
          { mobile: mobile }
        ],
        type: 3,
        is_deleted: 2,
      }
    });

    if (existingUser) {
      return NextResponse.json({ status: 0, error: "Email or mobile already exists" }, { status: 400 });
    }

    // Usually hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newDriver = await prisma.users.create({
      data: {
        name,
        email,
        mobile,
        identity_type: identity_type || "",
        identity_number: identity_number || "",
        password: hashedPassword,
        profile_image: profile_image || "default.png",
        identity_image: profile_image || "default.png",
        login_type: "email",
        type: 3,
        is_available: 1,
        is_deleted: 2,
        token: "", // Required by schema
      },
    });

    const serialized = JSON.parse(
      JSON.stringify(newDriver, (key, value) =>
        typeof value === "bigint" ? value.toString() : value
      )
    );

    return NextResponse.json({ status: 1, driver: serialized }, { status: 201 });
  } catch (error) {
    console.error("POST Driver Error:", error);
    return NextResponse.json({ status: 0, error: "Internal Server Error" }, { status: 500 });
  }
}
