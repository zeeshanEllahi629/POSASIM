import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const suppliers = await prisma.supplier.findMany({
      orderBy: { created_at: 'desc' }
    });
    return NextResponse.json({ success: true, data: suppliers });
  } catch (error) {
    console.error("Error fetching suppliers:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const newSupplier = await prisma.supplier.create({
      data: {
        company_name: body.company_name,
        contact_person: body.contact_person,
        email: body.email,
        country: body.country,
        reliability_score: body.reliability_score || 0,
        is_verified: body.is_verified || 0
      }
    });
    return NextResponse.json({ success: true, data: newSupplier });
  } catch (error) {
    console.error("Error creating supplier:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
