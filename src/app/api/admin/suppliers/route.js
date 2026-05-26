import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const suppliers = await prisma.suppliers.findMany({
      where: {
        status: 1,
      },
      orderBy: {
        id: "desc",
      },
    });

    const serialized = JSON.parse(
      JSON.stringify(suppliers, (key, value) =>
        typeof value === "bigint" ? value.toString() : value
      )
    );

    return NextResponse.json({ status: 1, suppliers: serialized }, { status: 200 });
  } catch (error) {
    console.error("GET Suppliers Error:", error);
    return NextResponse.json({ status: 0, error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, phone, email, address, company, notes } = body;

    if (!name) {
      return NextResponse.json({ status: 0, error: "Supplier name is required" }, { status: 400 });
    }

    const newSupplier = await prisma.suppliers.create({
      data: {
        name,
        phone: phone || "",
        email: email || "",
        address: address || "",
        company: company || "",
        notes: notes || "",
        status: 1,
      },
    });

    const serialized = JSON.parse(
      JSON.stringify(newSupplier, (key, value) =>
        typeof value === "bigint" ? value.toString() : value
      )
    );

    return NextResponse.json({ status: 1, supplier: serialized }, { status: 201 });
  } catch (error) {
    console.error("POST Supplier Error:", error);
    return NextResponse.json({ status: 0, error: "Internal Server Error" }, { status: 500 });
  }
}
