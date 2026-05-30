import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request) {
  try {
    const data = await prisma.units.findMany({
      orderBy: { id: 'desc' }
    });
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const newItem = await prisma.units.create({
      data: {
        name: data.name,
        short_name: data.short_name,
        allow_decimal: data.allow_decimal !== undefined ? parseInt(data.allow_decimal) : 0
      }
    });
    return NextResponse.json(newItem);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
