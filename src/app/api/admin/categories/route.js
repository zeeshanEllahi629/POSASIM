import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Helper to slugify string
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-"); // Replace multiple - with single -
}

export async function GET() {
  try {
    const categoriesList = await prisma.categories.findMany({
      where: {
        is_deleted: 2,
      },
      orderBy: {
        reorder_id: "asc",
      },
    });

    // Handle BigInt serialization
    const serialized = JSON.parse(
      JSON.stringify(categoriesList, (key, value) =>
        typeof value === "bigint" ? value.toString() : value
      )
    );

    return NextResponse.json({ status: 1, categories: serialized }, { status: 200 });
  } catch (error) {
    console.error("GET Categories Error:", error);
    return NextResponse.json({ status: 0, error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { category_name, image } = body;

    if (!category_name) {
      return NextResponse.json({ status: 0, error: "Category name is required" }, { status: 400 });
    }

    // Generate slug
    let slug = slugify(category_name);
    
    // Check if slug exists
    const existing = await prisma.categories.findFirst({
      where: { slug },
    });

    if (existing) {
      const count = await prisma.categories.count();
      slug = `${slug}-${count + 1}`;
    }

    // Get max reorder_id
    const maxReorder = await prisma.categories.aggregate({
      _max: {
        reorder_id: true,
      },
    });

    const nextReorderId = (maxReorder._max.reorder_id || 0) + 1;

    const newCategory = await prisma.categories.create({
      data: {
        category_name,
        slug,
        image: image || "default.png",
        reorder_id: nextReorderId,
        is_available: 1,
        is_deleted: 2,
      },
    });

    const serialized = JSON.parse(
      JSON.stringify(newCategory, (key, value) =>
        typeof value === "bigint" ? value.toString() : value
      )
    );

    return NextResponse.json({ status: 1, category: serialized }, { status: 201 });
  } catch (error) {
    console.error("POST Category Error:", error);
    return NextResponse.json({ status: 0, error: "Internal Server Error" }, { status: 500 });
  }
}
