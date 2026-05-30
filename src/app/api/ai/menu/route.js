import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req) {
  try {
    // Check for simple auth (optional, could use a bearer token if needed)
    // For now, returning public active menu for the AI

    // 1. Fetch Categories
    const categories = await prisma.category.findMany({
      where: { status: 1, is_deleted: 0 },
      select: {
        id: true,
        category_name: true,
      },
    });

    // 2. Fetch Items with variations, addons, and extras
    const items = await prisma.item.findMany({
      where: { item_status: "1", is_deleted: 0 },
      select: {
        id: true,
        cat_id: true,
        item_name: true,
        price: true,
        item_type: true, // 1=veg, 2=non-veg
        variations: {
          select: {
            id: true,
            name: true,
            price: true,
          }
        },
        addons: {
          select: {
            id: true,
            name: true,
            price: true,
          }
        },
        extras: {
          select: {
            id: true,
            name: true,
            price: true,
          }
        }
      },
    });

    // 3. Format into a clean nested structure for the AI
    const menuData = categories.map((cat) => {
      const catItems = items.filter((item) => item.cat_id === cat.id).map(item => ({
        id: item.id,
        name: item.item_name,
        base_price: item.price,
        type: item.item_type === 1 ? "veg" : "non-veg",
        variations: item.variations.map(v => ({ id: v.id, name: v.name, price: v.price })),
        addons: item.addons.map(a => ({ id: a.id, name: a.name, price: a.price })),
        extras: item.extras.map(e => ({ id: e.id, name: e.name, price: e.price }))
      }));

      return {
        category_id: cat.id,
        category_name: cat.category_name,
        items: catItems,
      };
    });

    // Return the formatted menu data
    return NextResponse.json({
      success: true,
      message: "Menu fetched successfully for AI",
      data: menuData,
    });

  } catch (error) {
    console.error("AI Menu API Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
