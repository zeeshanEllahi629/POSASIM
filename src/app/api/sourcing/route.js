import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const recommendations = await prisma.sourcing_recommendation.findMany({
      orderBy: { created_at: 'desc' }
    });
    return NextResponse.json({ success: true, data: recommendations });
  } catch (error) {
    console.error("Error fetching sourcing recommendations:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
