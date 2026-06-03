import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { parse } from "url";

export async function GET(request) {
  try {
    const { query } = parse(request.url, true);
    const { startDate, endDate } = query;

    let whereClause = {};

    if (startDate && endDate) {
      // Need to adjust end date to cover the entire day
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      
      whereClause.created_at = {
        gte: new Date(startDate),
        lte: end
      };
    } else {
      // By default, just today's orders
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      whereClause.created_at = {
        gte: today
      };
    }

    const orders = await prisma.order.findMany({
      where: whereClause,
      orderBy: { created_at: "desc" },
      select: {
        id: true,
        order_number: true,
        grand_total: true,
        status: true,
        payment_status: true,
        order_type: true, // 1 for Delivery, 2 for Walk-in, etc.
        created_at: true,
        is_pos_order: true,
        name: true, // Customer name
        address: true,
        mobile: true,
      }
    });

    const processedOrders = orders.map(order => ({
      ...order,
      id: order.id.toString(),
      grand_total: parseFloat(order.grand_total || 0),
      mobile: order.mobile ? order.mobile.toString() : null,
      created_at: order.created_at ? order.created_at.toISOString() : null,
    }));

    // Calculate totals
    const totalSales = processedOrders.reduce((acc, order) => acc + order.grand_total, 0);

    return NextResponse.json({
      success: true,
      orders: processedOrders,
      totalSales: totalSales.toFixed(2),
      count: processedOrders.length
    });

  } catch (error) {
    console.error("POS Orders Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
