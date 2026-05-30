import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function GET(req) {
  try {
    const tokenCookie = req.cookies.get("token");
    if (!tokenCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyToken(tokenCookie.value);
    if (!payload || !payload.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch user details
    const user = await prisma.users.findUnique({
      where: { id: BigInt(payload.id) },
      select: {
        id: true,
        name: true,
        email: true,
        mobile: true,
        profile_image: true,
        loyalty_points: true,
        loyalty_tier: true,
        created_at: true,
      }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Fetch user orders
    const orders = await prisma.order.findMany({
      where: { user_id: parseInt(payload.id) },
      orderBy: { created_at: "desc" },
    });

    // Map orders
    const processedOrders = orders.map(order => ({
      ...order,
      id: order.id.toString(),
      order_number: order.order_number,
      total_amount: order.total_amount ? parseFloat(order.total_amount) : 0,
      status: order.status,
      created_at: order.created_at,
    }));

    return NextResponse.json({
      status: 1,
      user: {
        ...user,
        id: user.id.toString(),
      },
      orders: processedOrders
    });

  } catch (error) {
    console.error("Profile API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
