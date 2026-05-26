import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const orders = await prisma.order.findMany({
      where: {
        order_from: "pos",
        created_at: {
          gte: startOfToday,
          lte: endOfToday,
        },
      },
      select: {
        grand_total: true,
        payment_status: true,
      },
    });

    let totalRevenue = 0;
    let totalTransactions = 0;

    orders.forEach((o) => {
      totalRevenue += parseFloat(o.grand_total || 0);
      if (o.payment_status === 2) {
        totalTransactions++;
      }
    });

    return NextResponse.json(
      {
        status: 1,
        total_sales: orders.length,
        total_revenue: totalRevenue.toFixed(2),
        total_transactions: totalTransactions,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("POS Today Summary API Error:", error);
    return NextResponse.json(
      { status: 0, message: "Failed to load summary" },
      { status: 500 }
    );
  }
}
