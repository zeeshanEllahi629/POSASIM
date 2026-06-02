import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const settings = await prisma.marketplace_settings.findMany();
    return NextResponse.json({ success: true, settings });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { platform, api_key, api_secret, access_token, is_active } = body;

    // Check if exists
    let setting = await prisma.marketplace_settings.findFirst({
      where: { platform }
    });

    if (setting) {
      setting = await prisma.marketplace_settings.update({
        where: { id: setting.id },
        data: { api_key, api_secret, access_token, is_active }
      });
    } else {
      setting = await prisma.marketplace_settings.create({
        data: { platform, api_key, api_secret, access_token, is_active, client_id: 1 }
      });
    }

    return NextResponse.json({ success: true, setting });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update settings" }, { status: 500 });
  }
}
