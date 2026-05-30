import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Recall held cart
export async function GET(req, { params }) {
  try {
    const { id } = params;

    const cart = await prisma.pos_held_carts.findUnique({
      where: { id: BigInt(id) },
    });

    if (!cart || cart.status !== "held") {
      return NextResponse.json(
        { status: 0, message: "Cart not found or already processed" },
        { status: 404 }
      );
    }

    const processedCart = {
      ...cart,
      id: cart.id.toString(),
      cashier_id: cart.cashier_id.toString(),
      customer_id: cart.customer_id ? cart.customer_id.toString() : null,
      subtotal: parseFloat(cart.subtotal),
      tax_amount: parseFloat(cart.tax_amount),
      discount_amount: parseFloat(cart.discount_amount),
      total: parseFloat(cart.total),
    };

    return NextResponse.json({ status: 1, cart: processedCart }, { status: 200 });
  } catch (error) {
    console.error("POS Recall Held Cart API Error:", error);
    return NextResponse.json(
      { status: 0, message: "Failed to recall cart" },
      { status: 500 }
    );
  }
}

// Cancel/Delete held cart
export async function DELETE(req, { params }) {
  try {
    const { id } = params;

    // Set status to cancelled (matching Laravel)
    await prisma.pos_held_carts.update({
      where: { id: BigInt(id) },
      data: { status: "cancelled" },
    });

    const heldCount = await prisma.pos_held_carts.count({
      where: { status: "held" },
    });

    return NextResponse.json(
      {
        status: 1,
        message: "Held cart deleted successfully!",
        held_count: heldCount,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("POS Delete Held Cart API Error:", error);
    return NextResponse.json(
      { status: 0, message: "Failed to delete held cart" },
      { status: 500 }
    );
  }
}
