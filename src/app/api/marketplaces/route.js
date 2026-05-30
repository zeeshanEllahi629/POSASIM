import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const configs = await prisma.marketplace_config.findMany({
      orderBy: { created_at: 'desc' }
    });
    return NextResponse.json({ success: true, data: configs });
  } catch (error) {
    console.error("Error fetching marketplace configs:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    
    const newConfig = await prisma.marketplace_config.create({
      data: {
        platform: body.platform,
        store_url: body.store_url,
        is_active: 1
      }
    });

    return NextResponse.json({ success: true, data: newConfig });
  } catch (error) {
    console.error("Error creating marketplace config:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
