import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const shipments = await prisma.shipment.findMany({
      orderBy: { created_at: 'desc' }
    });
    return NextResponse.json({ success: true, data: shipments });
  } catch (error) {
    console.error("Error fetching shipments:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const trackingNumber = "TRK-" + Math.floor(10000000 + Math.random() * 90000000);
    
    const newShipment = await prisma.shipment.create({
      data: {
        tracking_number: trackingNumber,
        origin: body.origin,
        destination: body.destination,
        cost: body.cost,
        status: "In Transit"
      }
    });

    // Create initial tracking milestone
    await prisma.shipment_tracking.create({
      data: {
        shipment_id: newShipment.id,
        status_update: "Shipment Picked Up",
        location: body.origin
      }
    });

    return NextResponse.json({ success: true, data: newShipment });
  } catch (error) {
    console.error("Error creating shipment:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
