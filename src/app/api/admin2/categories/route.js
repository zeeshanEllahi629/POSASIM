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
    const contentType = req.headers.get("content-type") || "";
    let category_name = "";
    let imageName = "default.png";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      category_name = formData.get("category_name");
      const imageFile = formData.get("image");

      if (imageFile && imageFile.name) {
        const bytes = await imageFile.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const path = await import("path");
        const fs = await import("fs");
        
        const ext = path.extname(imageFile.name);
        imageName = Date.now().toString() + "-" + Math.floor(Math.random() * 1000).toString() + ext;
        const uploadDir = path.join(process.cwd(), "public/storage/app/public/admin-assets/images/category");
        if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
        fs.writeFileSync(path.join(uploadDir, imageName), buffer);
      }
    } else {
      const body = await req.json();
      category_name = body.category_name;
      if (body.image) imageName = body.image;
    }

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
      slug = slug + "-" + (count + 1).toString();
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
        image: imageName,
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
