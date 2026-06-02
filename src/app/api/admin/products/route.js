import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import fs from "fs";
import path from "path";

function slugify(text) {
  return text.toString().toLowerCase().trim().replace(/\s+/g, "-").replace(/[^\w\-]+/g, "").replace(/\-\-+/g, "-");
}

export async function GET() {
  try {
    const items = await prisma.item.findMany({ orderBy: { id: "desc" } });
    const serialized = JSON.parse(JSON.stringify(items, (key, value) => typeof value === "bigint" ? value.toString() : value));
    return NextResponse.json({ status: 1, products: serialized }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ status: 0, error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const formData = await req.formData();
    
    const item_name = formData.get("item_name");
    const sku = formData.get("sku") || "";
    const brand_id = formData.get("brand_id") ? Number(formData.get("brand_id")) : null;
    const unit_id = formData.get("unit_id") ? Number(formData.get("unit_id")) : null;
    const warranty_id = formData.get("warranty_id") ? Number(formData.get("warranty_id")) : null;
    const branch_id = formData.get("branch_id") ? Number(formData.get("branch_id")) : null;
    const alert_quantity = formData.get("alert_quantity") ? Number(formData.get("alert_quantity")) : 0;
    const barcode_type = formData.get("barcode_type") || "C128";
    const enable_description = formData.get("enable_description") === "true" ? 1 : 0;
    const tax_type = formData.get("tax_type") || "inclusive";
    const product_type = formData.get("product_type") || "single";
    const label_print = formData.get("label_print") === "true" ? 1 : 0;

    const cat_id = formData.get("cat_id") ? Number(formData.get("cat_id")) : 0;
    const subcat_id = formData.get("subcat_id") ? Number(formData.get("subcat_id")) : 0;
    const price = formData.get("price") ? parseFloat(formData.get("price")) : 0;
    const qty = formData.get("qty") ? Number(formData.get("qty")) : 0;
    const item_type = formData.get("item_type") ? Number(formData.get("item_type")) : 1;
    const item_description = formData.get("item_description") || "";
    
    // Multiple Images Handling
    const imageFiles = formData.getAll("images"); // Array of files

    if (!item_name) {
      return NextResponse.json({ status: 0, error: "Missing Name" }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), "public/storage/app/public/admin-assets/images/item");
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    let mainImageName = "default.jpg";
    const additionalImages = [];

    if (imageFiles && imageFiles.length > 0) {
      for (let i = 0; i < imageFiles.length; i++) {
        const file = imageFiles[i];
        if (file && file.name) {
          const bytes = await file.arrayBuffer();
          const buffer = Buffer.from(bytes);
          const ext = path.extname(file.name);
          const imageName = `${Date.now()}-${Math.floor(Math.random() * 1000)}${ext}`;
          
          fs.writeFileSync(path.join(uploadDir, imageName), buffer);
          
          if (i === 0) {
            mainImageName = imageName;
          } else {
            additionalImages.push(imageName);
          }
        }
      }
    } else if (formData.get("image_string")) {
      mainImageName = formData.get("image_string");
    }

    let slug = slugify(item_name);
    const existing = await prisma.item.findFirst({ where: { slug } });
    if (existing) slug = `${slug}-${Date.now()}`;

    const newItem = await prisma.item.create({
      data: {
        item_name, slug, sku, brand_id, unit_id, warranty_id, branch_id,
        alert_quantity, barcode_type, enable_description, tax_type, product_type, label_print,
        cat_id, subcat_id, price, qty, item_type, item_description, image: mainImageName,
        reorder_id: 0, tax: "0", avg_ratting: 0.0, discount_percentage: 0.0,
        item_status: 1, is_featured: 2, is_top_deals: 2,
      },
    });

    // Save additional images
    if (additionalImages.length > 0) {
      await prisma.item_images.createMany({
        data: additionalImages.map(img => ({
          item_id: newItem.id,
          image: img
        }))
      });
    }

    const variationsRaw = formData.get("variations");
    if (product_type === "variable" && variationsRaw) {
      try {
        const parsedVariations = JSON.parse(variationsRaw);
        if (Array.isArray(parsedVariations) && parsedVariations.length > 0) {
          const variationsToInsert = parsedVariations.map(v => ({
            item_id: Number(newItem.id),
            name: v.name,
            price: String(v.price || 0),
            qty: parseInt(v.qty) || 0,
            stock_management: 1,
            discount_percentage: 0.0,
            is_available: 1
          }));
          await prisma.variation.createMany({ data: variationsToInsert });
        }
      } catch (e) {
        console.error("Variation Parsing Error", e);
      }
    }

    const serialized = JSON.parse(JSON.stringify(newItem, (k, v) => typeof v === "bigint" ? v.toString() : v));
    return NextResponse.json({ status: 1, product: serialized }, { status: 201 });
  } catch (error) {
    console.error("POST Product Error:", error);
    return NextResponse.json({ status: 0, error: "Internal Server Error" }, { status: 500 });
  }
}
