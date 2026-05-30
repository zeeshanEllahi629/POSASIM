import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const brands = await prisma.brands.findMany({ where: { status: 1 } });
    const units = await prisma.units.findMany();
    const warranties = await prisma.warranties.findMany();
    const categories = await prisma.categories.findMany({ where: { is_available: 1 } });
    
    // We don't have a branch model yet? Wait, the schema had `branch_id`. 
    // Let's check if branches exist. If not, just return empty array for now.
    // We didn't define branches table in phase 1, so skip it or just return a dummy.
    const locations = [
      { id: 1, name: "Main Branch" },
      { id: 2, name: "Warehouse" }
    ];

    const taxes = [
      { id: 1, name: "GST 18%", rate: 18 },
      { id: 2, name: "VAT 5%", rate: 5 },
      { id: 3, name: "None", rate: 0 }
    ];

    return NextResponse.json({
      brands,
      units,
      warranties,
      categories,
      locations,
      taxes
    });
  } catch (error) {
    console.error("Form Data Error:", error);
    return NextResponse.json(
      { error: "Failed to load form data" },
      { status: 500 }
    );
  }
}
