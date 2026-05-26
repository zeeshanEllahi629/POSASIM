import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // Fetch orders that are Pending (1) or Cooking (2)
    const activeOrders = await prisma.order.findMany({
      where: {
        status: {
          in: ["1", "2"]
        }
      },
      orderBy: {
        id: "asc"
      },
      include: {
        order_details: true
      }
    });

    // Format the response for the KDS
    const formattedOrders = activeOrders.map((order) => {
      // Calculate time elapsed in minutes
      const createdAt = new Date(order.created_at);
      const now = new Date();
      const diffMs = now - createdAt;
      const elapsedMinutes = Math.floor(diffMs / 60000);

      let orderTypeLabel = "Delivery";
      if (order.order_type === "2") orderTypeLabel = "Takeaway";
      if (order.order_type === "3") orderTypeLabel = "Dine-in";

      return {
        id: order.id.toString(),
        order_number: order.order_number,
        customer_name: order.name || "Guest",
        order_type: orderTypeLabel,
        status: order.status, // "1" = Pending, "2" = Cooking
        elapsed_minutes: elapsedMinutes,
        special_instructions: order.order_notes || "",
        items: order.order_details.map(item => ({
          id: item.id.toString(),
          name: item.item_name,
          qty: item.qty,
          addons: item.addons_name || "",
          extras: item.extras_name || "",
        }))
      };
    });

    return NextResponse.json({ status: 1, orders: formattedOrders });
  } catch (error) {
    console.error("KDS Fetch Error:", error);
    return NextResponse.json({ status: 0, error: "Failed to fetch active orders" }, { status: 500 });
  }
}
