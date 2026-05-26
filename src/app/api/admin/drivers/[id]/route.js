import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(req, { params }) {
  try {
    const { id } = params;
    const body = await req.json();
    const { name, email, mobile, identity_type, identity_number, profile_image } = body;

    if (!name || !email || !mobile) {
      return NextResponse.json({ status: 0, error: "Name, email, and mobile are required" }, { status: 400 });
    }

    // Check if email or mobile exists for OTHER drivers
    const existingUser = await prisma.users.findFirst({
      where: {
        OR: [
          { email: email },
          { mobile: mobile }
        ],
        type: 3,
        is_deleted: 2,
        id: {
          not: BigInt(id)
        }
      }
    });

    if (existingUser) {
      return NextResponse.json({ status: 0, error: "Email or mobile already exists" }, { status: 400 });
    }

    const dataToUpdate = {
      name,
      email,
      mobile,
      identity_type: identity_type || "",
      identity_number: identity_number || "",
    };

    if (profile_image) {
      dataToUpdate.profile_image = profile_image;
      dataToUpdate.identity_image = profile_image;
    }

    const updatedDriver = await prisma.users.update({
      where: { id: BigInt(id) },
      data: dataToUpdate,
    });

    const serialized = JSON.parse(
      JSON.stringify(updatedDriver, (key, value) =>
        typeof value === "bigint" ? value.toString() : value
      )
    );

    return NextResponse.json({ status: 1, driver: serialized }, { status: 200 });
  } catch (error) {
    console.error("PUT Driver Error:", error);
    return NextResponse.json({ status: 0, error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  try {
    const { id } = params;
    const body = await req.json();
    const { is_available } = body;

    const updatedDriver = await prisma.users.update({
      where: { id: BigInt(id) },
      data: { is_available },
    });

    const serialized = JSON.parse(
      JSON.stringify(updatedDriver, (key, value) =>
        typeof value === "bigint" ? value.toString() : value
      )
    );

    return NextResponse.json({ status: 1, driver: serialized }, { status: 200 });
  } catch (error) {
    console.error("PATCH Driver Error:", error);
    return NextResponse.json({ status: 0, error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = params;

    // Soft delete
    await prisma.users.update({
      where: { id: BigInt(id) },
      data: { is_deleted: 1 },
    });

    return NextResponse.json({ status: 1, message: "Driver deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("DELETE Driver Error:", error);
    return NextResponse.json({ status: 0, error: "Internal Server Error" }, { status: 500 });
  }
}
