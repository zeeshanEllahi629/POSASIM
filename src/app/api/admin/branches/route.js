import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const branches = await prisma.branches.findMany({
      orderBy: {
        id: "desc",
      },
    });

    const serialized = JSON.parse(
      JSON.stringify(branches, (key, value) =>
        typeof value === "bigint" ? value.toString() : value
      )
    );

    return NextResponse.json({ status: 1, branches: serialized }, { status: 200 });
  } catch (error) {
    console.error("GET Branches Error:", error);
    return NextResponse.json({ status: 0, error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, address, phone, email } = body;

    if (!name) {
      return NextResponse.json({ status: 0, error: "Branch name is required" }, { status: 400 });
    }

    const newBranch = await prisma.branches.create({
      data: {
        name,
        address: address || "",
        phone: phone || "",
        email: email || "",
        status: 1,
      },
    });

    const serialized = JSON.parse(
      JSON.stringify(newBranch, (key, value) =>
        typeof value === "bigint" ? value.toString() : value
      )
    );

    return NextResponse.json({ status: 1, branch: serialized }, { status: 201 });
  } catch (error) {
    console.error("POST Branch Error:", error);
    return NextResponse.json({ status: 0, error: "Internal Server Error" }, { status: 500 });
  }
}
