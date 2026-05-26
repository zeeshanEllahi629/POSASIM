import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query") || "";

    const whereClause = {
      type: 2, // Customer
      is_available: 1,
    };

    if (query) {
      whereClause.OR = [
        { name: { contains: query } },
        { mobile: { contains: query } },
        { email: { contains: query } },
      ];
    }

    const customers = await prisma.users.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        email: true,
        mobile: true,
      },
      take: 20,
    });

    const processedCustomers = customers.map((c) => ({
      ...c,
      id: c.id.toString(),
    }));

    return NextResponse.json({ status: 1, customers: processedCustomers }, { status: 200 });
  } catch (error) {
    console.error("POS Customers API Error:", error);
    return NextResponse.json(
      { status: 0, message: "Failed to load customers" },
      { status: 500 }
    );
  }
}
