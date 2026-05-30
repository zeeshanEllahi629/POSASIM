import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const rfqs = await prisma.rfq.findMany({
      orderBy: { created_at: 'desc' }
    });
    return NextResponse.json({ success: true, data: rfqs });
  } catch (error) {
    console.error("Error fetching RFQs:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const rfqNumber = "RFQ-" + Math.floor(100000 + Math.random() * 900000);
    
    const newRfq = await prisma.rfq.create({
      data: {
        rfq_number: rfqNumber,
        product_name: body.product_name,
        target_quantity: body.target_quantity,
        target_price: body.target_price,
        status: "Pending"
      }
    });
    return NextResponse.json({ success: true, data: newRfq });
  } catch (error) {
    console.error("Error creating RFQ:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
