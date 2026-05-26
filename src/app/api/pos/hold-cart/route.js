import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function POST(req) {
  try {
    const data = await req.json();

    if (!data.items || data.items.length === 0) {
      return NextResponse.json(
        { status: 0, message: "Cart is empty" },
        { status: 400 }
      );
    }

    // Get auth user (cashier)
    const cashier = getAuthUser(req);
    const cashierId = cashier ? BigInt(cashier.id) : BigInt(1); // Fallback to user 1 (Admin)

    const referenceNo = `HOLD-${new Date().toISOString().replace(/[-:T.Z]/g, "")}-${Math.floor(
      100 + Math.random() * 900
    )}`;

    const heldCart = await prisma.pos_held_carts.create({
      data: {
        reference_no: referenceNo,
        cashier_id: cashierId,
        customer_id: data.customer_id ? BigInt(data.customer_id) : null,
        items: data.items, // JSON field
        subtotal: parseFloat(data.subtotal || 0),
        tax_amount: parseFloat(data.tax_amount || 0),
        discount_amount: parseFloat(data.discount_amount || 0),
        total: parseFloat(data.grand_total || 0),
        notes: data.notes || "",
        status: "held",
      },
    });

    const heldCount = await prisma.pos_held_carts.count({
      where: { status: "held" },
    });

    return NextResponse.json(
      {
        status: 1,
        message: "Cart held successfully!",
        reference_no: heldCart.reference_no,
        held_count: heldCount,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("POS Hold Cart API Error:", error);
    return NextResponse.json(
      { status: 0, message: "Failed to hold cart: " + error.message },
      { status: 500 }
    );
  }
}
