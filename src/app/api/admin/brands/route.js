import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request) {
  try {
    const data = await prisma.brands.findMany({
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
    const newItem = await prisma.brands.create({
      data: {
        name: data.name,
        description: data.description || null,
        status: data.status ? parseInt(data.status) : 1
      }
    });
    return NextResponse.json(newItem);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
