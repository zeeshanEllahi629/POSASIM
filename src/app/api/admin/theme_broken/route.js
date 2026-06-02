import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const settings = await prisma.settings.findFirst();
    return NextResponse.json({ success: true, settings });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Error fetching theme settings" }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const data = await req.json();
    const { logo, web_primary_color, web_secondary_color } = data;

    const existing = await prisma.settings.findFirst();
    if (existing) {
      const updated = await prisma.settings.update({
        where: { id: existing.id },
        data: {
          logo: logo !== undefined ? logo : existing.logo,
          web_primary_color: web_primary_color || existing.web_primary_color,
          web_secondary_color: web_secondary_color || existing.web_secondary_color,
        }
      });
      return NextResponse.json({ success: true, settings: updated });
    } else {
      // If no settings exist, create one (fallback)
      const created = await prisma.settings.create({
        data: {
          theme: 1,
          login_required: "no",
          is_checkout_login_required: 0,
          notification_tune: "default",
          max_order_qty: 10,
          min_order_amount: 0,
          max_order_amount: 10000,
          firebase: "{}",
          referral_amount: 0,
          web_primary_color: web_primary_color || "#e7272d",
          web_secondary_color: web_secondary_color || "#333333",
          admin_primary_color: "#e7272d",
          admin_secondary_color: "#333333",
          google_client_id: "",
          google_client_secret: "",
          facebook_client_id: "",
          facebook_client_secret: "",
          logo: logo || null,
        }
      });
      return NextResponse.json({ success: true, settings: created });
    }
  } catch (error) {
    console.error("PUT Theme Error:", error);
    return NextResponse.json({ success: false, error: "Error updating theme settings" }, { status: 500 });
  }
}
