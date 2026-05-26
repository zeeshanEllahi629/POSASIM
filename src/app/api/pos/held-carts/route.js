import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const heldCarts = await prisma.pos_held_carts.findMany({
      where: { status: "held" },
      orderBy: { id: "desc" },
    });

    // Fetch cashier user details
    const cashierIds = [...new Set(heldCarts.map((c) => c.cashier_id))];
    const cashiers = await prisma.users.findMany({
      where: { id: { in: cashierIds } },
      select: { id: true, name: true },
    });

    const cashierMap = {};
    cashiers.forEach((u) => {
      cashierMap[u.id.toString()] = u.name;
    });

    const processedCarts = heldCarts.map((cart) => ({
      ...cart,
      id: cart.id.toString(),
      cashier_id: cart.cashier_id.toString(),
      customer_id: cart.customer_id ? cart.customer_id.toString() : null,
      subtotal: parseFloat(cart.subtotal),
      tax_amount: parseFloat(cart.tax_amount),
      discount_amount: parseFloat(cart.discount_amount),
      total: parseFloat(cart.total),
      cashier_name: cashierMap[cart.cashier_id.toString()] || "Unknown",
    }));

    return NextResponse.json({ status: 1, carts: processedCarts }, { status: 200 });
  } catch (error) {
    console.error("POS Held Carts API Error:", error);
    return NextResponse.json(
      { status: 0, message: "Failed to load held carts: " + error.message },
      { status: 500 }
    );
  }
}
