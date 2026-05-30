import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const keys = ["module_sourcing", "module_suppliers", "module_logistics", "module_marketplaces", "module_marketing"];
    const settings = await prisma.site_settings.findMany({
      where: { key_name: { in: keys } }
    });

    // Default to true (enabled) if not explicitly set to "false"
    const modules = {
      sourcing: true,
      suppliers: true,
      logistics: true,
      marketplaces: true,
      marketing: true
    };

    settings.forEach(s => {
      if (s.key_name === "module_sourcing") modules.sourcing = s.value !== "false";
      if (s.key_name === "module_suppliers") modules.suppliers = s.value !== "false";
      if (s.key_name === "module_logistics") modules.logistics = s.value !== "false";
      if (s.key_name === "module_marketplaces") modules.marketplaces = s.value !== "false";
      if (s.key_name === "module_marketing") modules.marketing = s.value !== "false";
    });

    return NextResponse.json({ success: true, modules });
  } catch (error) {
    console.error("Error fetching module settings:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { module, isEnabled } = await req.json();
    const key_name = `module_${module}`;
    const value = isEnabled ? "true" : "false";

    await prisma.site_settings.upsert({
      where: { key_name },
      update: { value, updated_at: new Date() },
      create: { key_name, value }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving module toggle:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
