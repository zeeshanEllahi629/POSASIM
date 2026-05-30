import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request) {
  try {
    const customers = await prisma.users.findMany({
      where: { type: 2 },
      orderBy: { loyalty_points: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        mobile: true,
        loyalty_points: true,
        loyalty_tier: true,
      },
    });

    // BigInt serialization fix
    const serialized = customers.map((c) => ({
      ...c,
      id: c.id.toString(),
    }));

    return NextResponse.json({ status: 1, data: serialized });
  } catch (error) {
    console.error("Loyalty GET Error:", error);
    return NextResponse.json(
      { status: 0, error: "Failed to fetch loyalty customers" },
      { status: 500 }
    );
  }
}
