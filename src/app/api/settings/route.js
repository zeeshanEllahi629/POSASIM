import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const key_name = searchParams.get('key_name');

    if (!key_name) {
      return NextResponse.json({ success: false, error: "key_name is required" }, { status: 400 });
    }

    const setting = await prisma.site_settings.findUnique({
      where: { key_name }
    });

    return NextResponse.json({ success: true, data: setting ? setting.value : null });
  } catch (error) {
    console.error("Error fetching setting:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { key_name, value } = await req.json();
    
    if (!key_name || value === undefined) {
      return NextResponse.json({ success: false, error: "key_name and value are required" }, { status: 400 });
    }

    const updatedSetting = await prisma.site_settings.upsert({
      where: { key_name },
      update: { value, updated_at: new Date() },
      create: { key_name, value }
    });

    return NextResponse.json({ success: true, data: updatedSetting });
  } catch (error) {
    console.error("Error saving setting:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
