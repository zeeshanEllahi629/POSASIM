import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Helper to serialize BigInt
function serializeData(data) {
  return JSON.parse(
    JSON.stringify(data, (key, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const filter = searchParams.get("filter") || "all";
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    let whereClause = {};

    if (filter === "today") {
      const start = new Date();
      start.setHours(0, 0, 0, 0);
      const end = new Date();
      end.setHours(23, 59, 59, 999);
      whereClause.created_at = { gte: start, lte: end };
    } else if (filter === "week") {
      const end = new Date();
      const start = new Date();
      start.setDate(end.getDate() - 7);
      whereClause.created_at = { gte: start, lte: end };
    } else if (filter === "month") {
      const end = new Date();
      const start = new Date();
      start.setMonth(end.getMonth() - 1);
      whereClause.created_at = { gte: start, lte: end };
    } else if (filter === "custom" && startDate && endDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      whereClause.created_at = { gte: start, lte: end };
    }

    const orders = await prisma.order.findMany({
      where: whereClause,
      orderBy: { created_at: "desc" }
    });

    const branches = await prisma.branches.findMany();
    const branchMap = branches.reduce((acc, branch) => {
      acc[branch.id.toString()] = branch.name;
      return acc;
    }, {});

    const mappedOrders = orders.map(order => {
      return {
        ...order,
        branch_info: order.branch_id ? { name: branchMap[order.branch_id.toString()] || 'Unknown' } : null
      };
    });

    return NextResponse.json({ success: true, data: serializeData(mappedOrders) });
  } catch (error) {
    console.error("Reports API error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch reports" }, { status: 500 });
  }
}
