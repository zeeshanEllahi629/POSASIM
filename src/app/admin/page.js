import prisma from "@/lib/prisma";
import DashboardClient from "./DashboardClient";

// Helper to serialize BigInt to string for next.js serialization
function serializeData(data) {
  return JSON.parse(
    JSON.stringify(data, (key, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );
}

export default async function AdminDashboardPage() {
  try {
    // 1. Get counts
    const totalCategories = await prisma.categories.count({
      where: { is_available: 1, is_deleted: 2 },
    });

    const totalItems = await prisma.item.count({
      where: { item_status: 1 },
    });

    const totalCustomers = await prisma.users.count({
      where: { type: 2, is_available: 1 },
    });

    const totalOrders = await prisma.order.count();

    // 2. Calculate Total Revenue (excluding cancelled status="6" or status="7")
    const completedOrders = await prisma.order.findMany({
      where: {
        status: {
          notIn: ["6", "7"],
        },
      },
      select: {
        grand_total: true,
      },
    });

    const totalRevenue = completedOrders.reduce(
      (sum, o) => sum + parseFloat(o.grand_total || 0),
      0
    );

    // 3. Low stock alerts (items with stock <= 5)
    const lowStockItems = await prisma.item.findMany({
      where: {
        qty: {
          lte: 5,
        },
        item_status: 1,
      },
      take: 5,
    });

    // 4. Recent orders (latest 5)
    const recentOrders = await prisma.order.findMany({
      orderBy: {
        id: "desc",
      },
      take: 5,
    });

    // 5. Today's orders
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const todayOrders = await prisma.order.findMany({
      where: {
        created_at: {
          gte: startOfToday,
          lte: endOfToday,
        },
      },
    });

    const todayRevenue = todayOrders.reduce(
      (sum, o) => sum + parseFloat(o.grand_total || 0),
      0
    );

    // 6. Top items (mock or group by order_details if data exists)
    // To make sure it works even with empty tables, we fallback if no order details
    const orderDetailsGrouped = await prisma.order_details.groupBy({
      by: ["item_id", "item_name"],
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: 'desc'
        }
      },
      take: 5,
    });

    const topItems = orderDetailsGrouped.map((detail) => ({
      id: detail.item_id ? detail.item_id.toString() : "0",
      name: detail.item_name || "Unknown Item",
      salesCount: detail._count.id ? Number(detail._count.id) : 0,
    }));

    const serializedData = serializeData({
      stats: {
        categories: totalCategories,
        products: totalItems,
        customers: totalCustomers,
        totalOrders: totalOrders,
        totalRevenue: totalRevenue,
        todayOrders: todayOrders.length,
        todayRevenue: todayRevenue,
      },
      lowStockItems,
      recentOrders,
      topItems,
    });

    return <DashboardClient initialData={serializedData} />;
  } catch (error) {
    console.error("Dashboard Page Error:", error);
    // Fallback static data if DB error occurs
    return (
      <DashboardClient
        initialData={{
          error: "Failed to load database statistics. Showing demo fallback.",
          stats: {
            categories: 12,
            products: 48,
            customers: 120,
            totalOrders: 154,
            totalRevenue: 2450.75,
            todayOrders: 5,
            todayRevenue: 120.5,
          },
          lowStockItems: [
            { id: "1", item_name: "Margherita Pizza", qty: 3, price: 12.99 },
            { id: "2", item_name: "Double Beef Burger", qty: 2, price: 9.99 },
          ],
          recentOrders: [
            {
              id: "1",
              order_number: "ORD-001",
              name: "John Doe",
              grand_total: "25.50",
              payment_status: 2,
              status: "1",
              created_at: new Date().toISOString(),
            },
          ],
          topItems: [
            { id: "1", name: "Margherita Pizza", salesCount: 45 },
            { id: "2", name: "Double Beef Burger", salesCount: 38 },
          ],
        }}
      />
    );
  }
}
