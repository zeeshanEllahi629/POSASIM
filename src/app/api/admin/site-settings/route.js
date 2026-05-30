import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const settings = await prisma.site_settings.findMany();
    // Convert array of {key_name, value} to an object
    const settingsObj = {};
    settings.forEach(s => {
      settingsObj[s.key_name] = s.value;
    });
    return NextResponse.json({ status: 1, settings: settingsObj });
  } catch (error) {
    console.error("Site Settings GET Error:", error);
    return NextResponse.json({ status: 0, error: "Failed to fetch site settings" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const data = await req.json();
    
    // data is expected to be an object: { hero_title: "...", primary_color: "..." }
    const operations = [];

    for (const [key, value] of Object.entries(data)) {
      operations.push(
        prisma.site_settings.upsert({
          where: { key_name: key },
          update: { value: String(value) },
          create: { key_name: key, value: String(value) }
        })
      );
    }

    await prisma.$transaction(operations);

    return NextResponse.json({ status: 1, message: "Template settings updated successfully" });
  } catch (error) {
    console.error("Site Settings POST Error:", error);
    return NextResponse.json({ status: 0, error: "Failed to update site settings" }, { status: 500 });
  }
}
