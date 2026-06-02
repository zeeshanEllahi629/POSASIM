import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const agent = searchParams.get('agent');
    const search = searchParams.get('search');

    const where = {};
    if (status) where.status = status;
    if (agent) where.preferredAgent = agent;
    if (search) where.sourceName = { contains: search };

    const products = await prisma.sourcingProduct.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ success: true, products }, { status: 200 });
  } catch (error) {
    console.error('Fetch Sourcing Products Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      sourceUrl, sourceType, agentUrl, preferredAgent, sourceName,
      sourceImages, sourcePriceRmb, sourceVariants, supplierInfo,
      sellingPrice, margin, notes, productId
    } = body;

    const product = await prisma.sourcingProduct.create({
      data: {
        sourceUrl,
        sourceType: sourceType || 'unknown',
        agentUrl,
        preferredAgent,
        sourceName,
        sourceImages: sourceImages || [],
        sourcePriceRmb,
        sourceVariants: sourceVariants || [],
        supplierInfo: supplierInfo || {},
        sellingPrice,
        margin,
        notes,
        status: 'active',
        productId: productId ? BigInt(productId) : null
      }
    });

    const serialized = JSON.parse(JSON.stringify(product, (k, v) => typeof v === 'bigint' ? v.toString() : v));

    return NextResponse.json({ success: true, product: serialized }, { status: 201 });
  } catch (error) {
    console.error('Create Sourcing Product Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
