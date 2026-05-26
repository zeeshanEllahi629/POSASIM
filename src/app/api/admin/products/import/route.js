import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";


function parseCSVRow(str) {
  let arr = [];
  let quote = false;
  let cell = '';
  for (let i = 0; i < str.length; i++) {
    let c = str[i];
    if (c === '"' && quote && str[i+1] === '"') {
      cell += '"';
      i++;
    } else if (c === '"') {
      quote = !quote;
    } else if (c === ',' && !quote) {
      arr.push(cell.trim());
      cell = '';
    } else {
      cell += c;
    }
  }
  arr.push(cell.trim());
  return arr;
}

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ status: 0, error: "No file uploaded" }, { status: 400 });
    }

    const text = await file.text();
    const lines = text.split(/\r?\n/).filter(line => line.trim() !== "");
    
    if (lines.length <= 1) {
      return NextResponse.json({ status: 0, error: "CSV file is empty or only contains headers." }, { status: 400 });
    }

    // Skip the first line (headers)
    const rows = lines.slice(1);
    let successCount = 0;

    // To optimize category lookups, we can cache them in memory during import
    const categoryCache = new Map();

    for (let i = 0; i < rows.length; i++) {
      const data = parseCSVRow(rows[i]);
      if (data.length < 3) continue; // Skip malformed rows

      const itemName = data[0];
      const categoryName = data[1] || "General";
      const price = parseFloat(data[2]) || 0;
      const qty = parseInt(data[3]) || 0;
      const itemType = parseInt(data[4]) === 2 ? 2 : 1; // 1 Veg, 2 Non-Veg
      const description = data[5] || "";
      const image = data[6] || "default.jpg";

      if (!itemName) continue;

      // Find or create category
      let catId = categoryCache.get(categoryName.toLowerCase());
      if (!catId) {
        let cat = await prisma.category.findFirst({
          where: { category_name: categoryName }
        });

        if (!cat) {
          // Generate a simple slug for the category
          let slug = categoryName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
          // Check if slug exists
          const existingSlug = await prisma.category.findFirst({ where: { slug } });
          if (existingSlug) {
             slug = slug + "-" + Date.now();
          }

          cat = await prisma.category.create({
            data: {
              category_name: categoryName,
              image: "default.jpg",
              slug: slug,
              is_available: 1,
              is_deleted: 2
            }
          });
        }
        catId = cat.id;
        categoryCache.set(categoryName.toLowerCase(), catId);
      }

      // Generate slug for item
      let itemSlug = itemName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
      const existingItemSlug = await prisma.item.findFirst({ where: { slug: itemSlug } });
      if (existingItemSlug) {
         itemSlug = itemSlug + "-" + Date.now() + "-" + Math.floor(Math.random() * 1000);
      }

      // Insert product
      await prisma.item.create({
        data: {
          item_name: itemName,
          cat_id: catId,
          price: price,
          qty: qty,
          item_type: itemType,
          item_description: description,
          image: image,
          slug: itemSlug,
          item_status: 1,
          is_deleted: 2,
          has_variation: 2, // Default to no variations for imported items
        }
      });
      successCount++;
    }

    return NextResponse.json({ status: 1, count: successCount, message: "Products imported successfully" });

  } catch (error) {
    console.error("Import error:", error);
    return NextResponse.json({ status: 0, error: "Server error occurred during import" }, { status: 500 });
  }
}

