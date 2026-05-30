import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

function serializeData(data) {
  return JSON.parse(
    JSON.stringify(data, (key, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );
}

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    
    const purchase = await prisma.purchases.findUnique({
      where: { id: BigInt(id) },
      include: {
        suppliers: true,
        users: true,
        purchase_items: true,
      },
    });

    if (!purchase) {
      return NextResponse.json({ status: 0, error: "Purchase not found" });
    }

    return NextResponse.json({ status: 1, purchase: serializeData(purchase) });
  } catch (error) {
    console.error("GET purchase error:", error);
    return NextResponse.json({ status: 0, error: "Internal server error" });
  }
}

export async function PATCH(req, { params }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { payment_status } = body;

    if (!payment_status) {
      return NextResponse.json({ status: 0, error: "Payment status is required" });
    }

    const updatedPurchase = await prisma.purchases.update({
      where: { id: BigInt(id) },
      data: { payment_status },
      include: {
        suppliers: true,
        users: true,
        purchase_items: true,
      },
    });

    return NextResponse.json({ status: 1, purchase: serializeData(updatedPurchase) });
  } catch (error) {
    console.error("PATCH purchase error:", error);
    return NextResponse.json({ status: 0, error: "Internal server error" });
  }
}
