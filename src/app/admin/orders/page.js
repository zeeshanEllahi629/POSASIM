import prisma from "@/lib/prisma";
import OrdersClient from "./OrdersClient";

function serializeData(data) {
  return JSON.parse(
    JSON.stringify(data, (key, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );
}

export default async function AdminOrdersPage() {
  try {
    const ordersList = await prisma.order.findMany({
      orderBy: {
        id: "desc",
      },
    });

    const serialized = serializeData(ordersList);

    return <OrdersClient initialOrders={serialized} />;
  } catch (error) {
    console.error("Orders Page Server Error:", error);
    return <OrdersClient initialOrders={[]} error="Failed to load orders from database." />;
  }
}
