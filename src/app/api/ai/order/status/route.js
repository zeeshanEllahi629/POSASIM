import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const order_number = searchParams.get("order_number");
    const mobile = searchParams.get("mobile");

    if (!order_number && !mobile) {
      return NextResponse.json({ success: false, error: "order_number or mobile is required" }, { status: 400 });
    }

    const whereClause = {};
    if (order_number) whereClause.order_number = order_number;
    if (mobile) whereClause.mobile = parseInt(mobile);

    const orders = await prisma.order.findMany({
      where: whereClause,
      orderBy: { id: "desc" },
      take: 5 // return up to 5 recent orders if searching by mobile
    });

    if (!orders || orders.length === 0) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }

    const formatStatus = (statusId) => {
      const statuses = {
        "1": "placed",
        "2": "preparing",
        "3": "ready",
        "4": "delivered",
        "5": "cancelled"
      };
      return statuses[statusId] || "unknown";
    };

    const formattedOrders = orders.map(order => ({
      order_id: order.id.toString(),
      order_number: order.order_number,
      customer_name: order.name,
      grand_total: order.grand_total,
      status: formatStatus(order.status),
      status_id: order.status,
      payment_status: order.payment_status === 1 ? "paid" : "unpaid",
    }));

    return NextResponse.json({
      success: true,
      data: formattedOrders
    });

  } catch (error) {
    console.error("AI Order Status API Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
