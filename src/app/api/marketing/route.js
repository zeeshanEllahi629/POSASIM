import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const campaigns = await prisma.marketing_campaign.findMany({
      orderBy: { created_at: 'desc' }
    });
    return NextResponse.json({ success: true, data: campaigns });
  } catch (error) {
    console.error("Error fetching marketing campaigns:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    
    const newCampaign = await prisma.marketing_campaign.create({
      data: {
        name: body.name,
        objective: body.objective,
        budget: body.budget,
        status: "Active"
      }
    });

    return NextResponse.json({ success: true, data: newCampaign });
  } catch (error) {
    console.error("Error creating marketing campaign:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
