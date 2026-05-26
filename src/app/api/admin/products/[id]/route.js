import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

import fs from "fs";
import path from "path";

export async function PUT(req, { params }) {
  try {
    const id = params.id;
    const formData = await req.formData();
    
    const item_name = formData.get("item_name");
    const cat_id = formData.get("cat_id");
    const price = formData.get("price");
    const qty = formData.get("qty");
    const item_type = formData.get("item_type");
    const item_description = formData.get("item_description");
    const imageFile = formData.get("image");
    const imageStr = formData.get("image_string");

    if (!item_name || !cat_id || price === null || qty === null) {
      return NextResponse.json({ status: 0, error: "Missing required fields" }, { status: 400 });
    }

    let imageName = undefined;
    
    if (imageFile && imageFile.name) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      const ext = path.extname(imageFile.name);
      imageName = `${Date.now()}-${Math.floor(Math.random() * 1000)}${ext}`;
      
      const uploadDir = path.join(process.cwd(), "public/storage/app/public/admin-assets/images/item");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      
      fs.writeFileSync(path.join(uploadDir, imageName), buffer);
    } else if (imageStr) {
      imageName = imageStr;
    }

    const updated = await prisma.item.update({
      where: { id: BigInt(id) },
      data: {
        item_name,
        cat_id: Number(cat_id),
        price: parseFloat(price),
        qty: Number(qty),
        item_type: Number(item_type),
        item_description: item_description || "",
        ...(imageName && { image: imageName }),
      },
    });

    const serialized = JSON.parse(
      JSON.stringify(updated, (key, value) =>
        typeof value === "bigint" ? value.toString() : value
      )
    );

    return NextResponse.json({ status: 1, product: serialized }, { status: 200 });
  } catch (error) {
    console.error("PUT Product Error:", error);
    return NextResponse.json({ status: 0, error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  try {
    const id = params.id;
    const body = await req.json();
    const { item_status } = body;

    if (item_status === undefined) {
      return NextResponse.json({ status: 0, error: "item_status is required" }, { status: 400 });
    }

    const updated = await prisma.item.update({
      where: { id: BigInt(id) },
      data: {
        item_status: Number(item_status),
      },
    });

    return NextResponse.json({ status: 1, message: "Status updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("PATCH Product Error:", error);
    return NextResponse.json({ status: 0, error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const id = params.id;

    // Hard delete the item
    await prisma.item.delete({
      where: { id: BigInt(id) },
    });

    return NextResponse.json({ status: 1, message: "Product deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("DELETE Product Error:", error);
    return NextResponse.json({ status: 0, error: "Internal Server Error" }, { status: 500 });
  }
}
