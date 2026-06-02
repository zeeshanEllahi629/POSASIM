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
    const { logo, web_primary_color, web_secondary_color, footer_title, footer_description, footer_logo } = data;

    const existing = await prisma.settings.findFirst();
    if (existing) {
      const updateData = {
        logo: logo !== undefined ? logo : existing.logo,
        web_primary_color: web_primary_color || existing.web_primary_color,
        web_secondary_color: web_secondary_color || existing.web_secondary_color,
      };

      if (footer_title !== undefined) updateData.footer_title = footer_title;
      if (footer_description !== undefined) updateData.footer_description = footer_description;
      if (footer_logo !== undefined) updateData.footer_logo = footer_logo;

      const updated = await prisma.settings.update({
        where: { id: existing.id },
        data: updateData
      });
      return NextResponse.json({ success: true, settings: updated });
    } else {
      return NextResponse.json({ success: false, error: "Settings not found" }, { status: 404 });
    }
  } catch (error) {
    console.error("PUT Theme Error:", error);
    return NextResponse.json({ success: false, error: "Error updating theme settings" }, { status: 500 });
  }
}
