import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req, { params }) {
  try {
    const { id } = params;

    const order = await prisma.order.findUnique({
      where: { id: BigInt(id) },
    });

    if (!order) {
      return NextResponse.json(
        { status: 0, message: "Order not found" },
        { status: 404 }
      );
    }

    const orderDetails = await prisma.order_details.findMany({
      where: { order_id: BigInt(id) },
    });

    const settings = await prisma.settings.findFirst();

    // Process BigInt to String
    const processedOrder = {
      ...order,
      id: order.id.toString(),
      user_id: order.user_id ? order.user_id.toString() : null,
      mobile: order.mobile ? order.mobile.toString() : null,
      grand_total: parseFloat(order.grand_total || 0),
      tax_amount: parseFloat(order.tax_amount || 0),
      discount_amount: parseFloat(order.discount_amount || 0),
      delivery_charge: parseFloat(order.delivery_charge || 0),
      created_at: order.created_at ? order.created_at.toISOString() : null,
    };

    const processedDetails = orderDetails.map((od) => ({
      ...od,
      id: od.id.toString(),
      order_id: od.order_id.toString(),
      item_id: od.item_id.toString(),
      user_id: od.user_id ? od.user_id.toString() : null,
      qty: parseInt(od.qty || 1),
      item_price: parseFloat(od.item_price || 0),
      addons_total_price: parseFloat(od.addons_total_price || 0),
      extras_total_price: parseFloat(od.extras_total_price || 0),
    }));

    return NextResponse.json(
      {
        status: 1,
        order: processedOrder,
        details: processedDetails,
        settings: settings
          ? {
              website_title: settings.title || "POS System",
              address: settings.address || "",
              contact: settings.mobile || "",
            }
          : null,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("POS Receipt API Error:", error);
    return NextResponse.json(
      { status: 0, message: "Failed to load receipt details" },
      { status: 500 }
    );
  }
}
