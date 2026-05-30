import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const categories = await prisma.categories.findMany({
      where: {
        is_available: 1,
        is_deleted: 2,
      },
      orderBy: {
        reorder_id: "asc",
      },
      select: {
        id: true,
        category_name: true,
        slug: true,
        image: true,
      },
    });

    // Convert BigInt IDs to string
    const processedCategories = categories.map((cat) => ({
      ...cat,
      id: cat.id.toString(),
    }));

    return NextResponse.json({ status: 1, categories: processedCategories }, { status: 200 });
  } catch (error) {
    console.error("POS Categories API Error:", error);
    return NextResponse.json(
      { status: 0, message: "Failed to load categories" },
      { status: 500 }
    );
  }
}
