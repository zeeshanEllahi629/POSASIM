import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req) {
  try {
    const orders = await prisma.purchaseOrder.findMany({
      include: {
        sourcingProduct: true,
        order: true,
        shipment: true
      },
      orderBy: { createdAt: 'desc' }
    });

    const serialized = JSON.parse(JSON.stringify(orders, (k, v) => typeof v === 'bigint' ? v.toString() : v));
    return NextResponse.json({ success: true, orders: serialized }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { sourcingProductId, orderId, agentName, quantity, unitCostRmb } = body;

    const purchaseOrder = await prisma.purchaseOrder.create({
      data: {
        sourcingProductId: parseInt(sourcingProductId),
        orderId: BigInt(orderId),
        agentName,
        quantity: parseInt(quantity || 1),
        unitCostRmb: unitCostRmb ? parseFloat(unitCostRmb) : null,
        status: 'pending'
      }
    });

    const serialized = JSON.parse(JSON.stringify(purchaseOrder, (k, v) => typeof v === 'bigint' ? v.toString() : v));
    return NextResponse.json({ success: true, purchaseOrder: serialized }, { status: 201 });
  } catch (error) {
    console.error("Create Purchase Order Error", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
