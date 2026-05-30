import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("start");
    const endDate = searchParams.get("end");

    // Fetch all drivers (type 3 for delivery driver usually, or users who have deliveries)
    // We'll get all users who are assigned as drivers in the deliveries table
    const drivers = await prisma.users.findMany({
      where: { type: 3 }, // Assuming 3 = Delivery Driver
      select: {
        id: true,
        name: true,
        email: true,
        deliveries: {
          where: {
            delivery_status: "delivered",
            ...(startDate && endDate ? {
              delivered_at: {
                gte: new Date(startDate),
                lte: new Date(endDate)
              }
            } : {})
          },
          select: { delivery_fee: true }
        },
        driver_payments: {
          where: {
            ...(startDate && endDate ? {
              paid_at: {
                gte: new Date(startDate),
                lte: new Date(endDate)
              }
            } : {})
          },
          select: { amount: true }
        }
      }
    });

    const accountData = drivers.map(driver => {
      const totalEarned = driver.deliveries.reduce((sum, del) => sum + parseFloat(del.delivery_fee || 0), 0);
      const totalPaid = driver.driver_payments.reduce((sum, pmt) => sum + parseFloat(pmt.amount || 0), 0);
      const remainingBalance = totalEarned - totalPaid;

      return {
        id: driver.id,
        name: driver.name,
        email: driver.email,
        totalDeliveries: driver.deliveries.length,
        totalEarned: totalEarned.toFixed(2),
        totalPaid: totalPaid.toFixed(2),
        remainingBalance: remainingBalance.toFixed(2),
      };
    });

    return NextResponse.json(accountData);
  } catch (error) {
    console.error("Driver Accounts Error:", error);
    return NextResponse.json({ error: "Failed to fetch driver accounts" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { driver_id, amount, notes, user_id } = await request.json();

    if (!driver_id || !amount) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const payment = await prisma.driver_payments.create({
      data: {
        driver_id: BigInt(driver_id),
        amount: parseFloat(amount),
        notes: notes || "",
        created_by: BigInt(user_id || 1), // Provide authenticated user ID here normally
      }
    });

    return NextResponse.json({ message: "Payment recorded successfully", id: payment.id.toString() });
  } catch (error) {
    console.error("Payment Error:", error);
    return NextResponse.json({ error: "Failed to record payment" }, { status: 500 });
  }
}
