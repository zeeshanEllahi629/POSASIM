import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function calculateTier(points) {
  if (points >= 10000) return "Platinum";
  if (points >= 5000) return "Gold";
  if (points >= 1000) return "Silver";
  return "Bronze";
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { points, action } = body;

    if (!points || isNaN(points) || !action) {
      return NextResponse.json(
        { status: 0, error: "Invalid points or action" },
        { status: 400 }
      );
    }

    const userId = BigInt(id);
    const customer = await prisma.users.findUnique({
      where: { id: userId },
    });

    if (!customer) {
      return NextResponse.json(
        { status: 0, error: "Customer not found" },
        { status: 404 }
      );
    }

    let newPoints = customer.loyalty_points || 0;
    const pointsVal = parseInt(points, 10);

    if (action === "add") {
      newPoints += pointsVal;
    } else if (action === "deduct") {
      newPoints -= pointsVal;
      if (newPoints < 0) newPoints = 0;
    }

    const newTier = calculateTier(newPoints);

    const updatedCustomer = await prisma.users.update({
      where: { id: userId },
      data: {
        loyalty_points: newPoints,
        loyalty_tier: newTier,
      },
      select: {
        id: true,
        name: true,
        email: true,
        mobile: true,
        loyalty_points: true,
        loyalty_tier: true,
      },
    });

    return NextResponse.json({
      status: 1,
      customer: { ...updatedCustomer, id: updatedCustomer.id.toString() },
    });
  } catch (error) {
    console.error("Loyalty PUT Error:", error);
    return NextResponse.json(
      { status: 0, error: "Failed to update loyalty points" },
      { status: 500 }
    );
  }
}
