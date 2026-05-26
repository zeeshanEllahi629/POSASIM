import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request) {
  try {
    const data = await prisma.warranties.findMany({
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
    const newItem = await prisma.warranties.create({
      data: {
        name: data.name,
        description: data.description || null,
        duration: data.duration !== undefined ? parseInt(data.duration) : null,
        duration_type: data.duration_type || null
      }
    });
    return NextResponse.json(newItem);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
