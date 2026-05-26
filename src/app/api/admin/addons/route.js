import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";


export async function POST(request) {
  try {
    const data = await request.json();
    const { addongroup_id, name, price } = data;

    const addon = await prisma.addons.create({
      data: {
        addongroup_id: Number(addongroup_id),
        name,
        price: String(price),
        reorder_id: 0,
        is_available: 1,
        is_deleted: 2,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });

    return NextResponse.json({ status: 1, addon });
  } catch (error) {
    console.error("Error creating addon:", error);
    return NextResponse.json({ status: 0, error: "Failed to create addon" });
  }
}

