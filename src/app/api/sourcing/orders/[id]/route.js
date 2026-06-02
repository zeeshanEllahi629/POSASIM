import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PUT(req, { params }) {
  try {
    const { id } = params;
    const body = await req.json();
    
    const data = {};
    if (body.agentOrderId !== undefined) data.agentOrderId = body.agentOrderId;
    if (body.agentOrderUrl !== undefined) data.agentOrderUrl = body.agentOrderUrl;
    if (body.status !== undefined) data.status = body.status;
    if (body.agentNotes !== undefined) data.agentNotes = body.agentNotes;

    const purchaseOrder = await prisma.purchaseOrder.update({
      where: { id: parseInt(id) },
      data
    });

    const serialized = JSON.parse(JSON.stringify(purchaseOrder, (k, v) => typeof v === 'bigint' ? v.toString() : v));
    return NextResponse.json({ success: true, purchaseOrder: serialized }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
