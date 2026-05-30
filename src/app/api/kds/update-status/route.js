import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req) {
  try {
    const data = await req.json();
    const { order_id, status } = data;

    if (!order_id || !status) {
      return NextResponse.json({ status: 0, error: "Missing required fields" }, { status: 400 });
    }

    // Update order status
    // status: "1" = Pending, "2" = Cooking, "3" = Completed/Ready
    const updatedOrder = await prisma.order.update({
      where: { id: BigInt(order_id) },
      data: { 
        status: status.toString(),
        status_type: parseInt(status)
      }
    });

    return NextResponse.json({ status: 1, message: "Order status updated successfully" });
  } catch (error) {
    console.error("KDS Update Status Error:", error);
    return NextResponse.json({ status: 0, error: "Failed to update order status" }, { status: 500 });
  }
}
