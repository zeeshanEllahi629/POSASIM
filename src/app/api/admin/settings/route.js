import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const settings = await prisma.settings.findFirst();
    return NextResponse.json({ status: 1, settings });
  } catch (error) {
    return NextResponse.json({ status: 0, error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const data = await req.json();
    
    // Check if settings exist
    const existing = await prisma.settings.findFirst();
    
    if (existing) {
      await prisma.settings.update({
        where: { id: existing.id },
        data: {
          title: data.title,
          email: data.email,
          mobile: data.mobile,
          address: data.address,
          show_product_brief: data.show_product_brief !== undefined ? Number(data.show_product_brief) : 1,
          cart_style: data.cart_style || "sidebar",
        }
      });
    } else {
      // Very basic fallback if no settings exist
      await prisma.settings.create({
        data: {
          title: data.title,
          email: data.email,
          mobile: data.mobile,
          address: data.address,
          show_product_brief: data.show_product_brief !== undefined ? Number(data.show_product_brief) : 1,
          cart_style: data.cart_style || "sidebar",
          theme: 1,
          maintenance_mode: 2,
          online_table_booking: 1,
          login_required: "no",
          is_checkout_login_required: 2,
          notification_tune: "default.mp3",
          max_order_qty: 10,
          min_order_amount: 5,
          max_order_amount: 500,
        }
      });
    }

    return NextResponse.json({ status: 1, message: "Settings updated successfully" });
  } catch (error) {
    console.error("Settings Update Error:", error);
    return NextResponse.json({ status: 0, error: "Failed to update settings" }, { status: 500 });
  }
}
