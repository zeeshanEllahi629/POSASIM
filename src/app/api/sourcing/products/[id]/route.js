import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req, { params }) {
  try {
    const { id } = params;
    const product = await prisma.sourcingProduct.findUnique({
      where: { id: parseInt(id) },
      include: { purchaseOrders: true }
    });

    if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const serialized = JSON.parse(JSON.stringify(product, (k, v) => typeof v === 'bigint' ? v.toString() : v));
    return NextResponse.json({ success: true, product: serialized }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const { id } = params;
    const body = await req.json();
    
    // Only pick allowed fields
    const data = {};
    if (body.sellingPrice !== undefined) data.sellingPrice = body.sellingPrice;
    if (body.status !== undefined) data.status = body.status;
    if (body.notes !== undefined) data.notes = body.notes;

    const product = await prisma.sourcingProduct.update({
      where: { id: parseInt(id) },
      data
    });

    return NextResponse.json({ success: true, product }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = params;
    await prisma.sourcingProduct.update({
      where: { id: parseInt(id) },
      data: { status: 'discontinued' }
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
