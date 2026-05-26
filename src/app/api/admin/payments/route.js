import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const payments = await prisma.payment.findMany({
      orderBy: { reorder_id: "asc" }
    });
    return NextResponse.json({ success: true, data: payments });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch payments" }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const body = await req.json();
    const { id, is_available, environment, public_key, secret_key } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "Payment ID is required" }, { status: 400 });
    }

    const updated = await prisma.payment.update({
      where: { id: parseInt(id) },
      data: {
        is_available: is_available !== undefined ? parseInt(is_available) : undefined,
        environment: environment !== undefined ? parseInt(environment) : undefined,
        public_key: public_key !== undefined ? public_key : undefined,
        secret_key: secret_key !== undefined ? secret_key : undefined,
      }
    });

    return NextResponse.json({ success: true, data: updated, message: "Payment settings updated" });
  } catch (error) {
    console.error("Payment PUT error:", error);
    return NextResponse.json({ success: false, error: "Failed to update payment" }, { status: 500 });
  }
}
