import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("category_id");
    const query = searchParams.get("query") || "";

    const whereClause = {
      item_status: 1,
      // We don't have is_deleted column in prisma schema according to the schema warning? 
      // Let's check schema.prisma item model. It had created_at and updated_at but no is_deleted in warning.
      // Wait, in schema.prisma:
      // model item has id, reorder_id, cat_id, subcat_id, item_name, slug, image, item_type, has_extras, price, qty, original_price, addons_id, item_description, item_allergens, preparation_time, tax, video_url, avg_ratting, discount_percentage, item_status, is_featured, is_top_deals, created_at, updated_at
      // Indeed, it doesn't have is_deleted column! The Laravel model might have had a soft delete or is_deleted.
      // Actually, categories had is_deleted, but item does not.
    };

    if (categoryId && categoryId !== "all") {
      whereClause.cat_id = parseInt(categoryId);
    }

    if (query) {
      whereClause.OR = [
        { item_name: { contains: query } },
        { slug: { contains: query } },
      ];
    }

    const items = await prisma.item.findMany({
      where: whereClause,
      orderBy: { id: "desc" },
    });

    // Fetch images and categories in parallel to attach them
    const itemIds = items.map((item) => item.id);
    const categoryIds = [...new Set(items.map((item) => item.cat_id))];
    const subcategoryIds = [...new Set(items.map((item) => item.subcat_id))].filter(Boolean);

    const [images, categories, subcategories] = await Promise.all([
      prisma.item_images.findMany({
        where: { item_id: { in: itemIds } },
      }),
      prisma.categories.findMany({
        where: { id: { in: categoryIds } },
        select: { id: true, category_name: true },
      }),
      prisma.subcategories.findMany({
        where: { id: { in: subcategoryIds } },
        select: { id: true, subcategory_name: true },
      }),
    ]);

    // Create lookup maps
    const imagesMap = {};
    images.forEach((img) => {
      const id = img.item_id.toString();
      if (!imagesMap[id]) imagesMap[id] = [];
      imagesMap[id].push({
        ...img,
        id: img.id.toString(),
        item_id: img.item_id.toString(),
      });
    });

    const categoriesMap = {};
    categories.forEach((cat) => {
      categoriesMap[cat.id.toString()] = cat.category_name;
    });

    const subcategoriesMap = {};
    subcategories.forEach((subcat) => {
      subcategoriesMap[subcat.id.toString()] = subcat.subcategory_name;
    });

    // Map relationships in memory
    const processedItems = items.map((item) => {
      const idStr = item.id.toString();
      return {
        ...item,
        id: idStr,
        price: item.price ? parseFloat(item.price) : 0,
        qty: item.qty || 0,
        avg_ratting: item.avg_ratting ? parseFloat(item.avg_ratting) : 0,
        discount_percentage: item.discount_percentage ? parseFloat(item.discount_percentage) : 0,
        category_name: categoriesMap[item.cat_id.toString()] || "",
        subcategory_name: item.subcat_id ? subcategoriesMap[item.subcat_id.toString()] || "" : "",
        item_image: imagesMap[idStr]?.[0] || null, // default main image
        images: imagesMap[idStr] || [],
      };
    });

    return NextResponse.json({ status: 1, items: processedItems }, { status: 200 });
  } catch (error) {
    console.error("POS Items API Error:", error);
    return NextResponse.json(
      { status: 0, message: "Failed to load items" },
      { status: 500 }
    );
  }
}
