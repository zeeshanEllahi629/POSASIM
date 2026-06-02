import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const links = await prisma.social_links.findMany();
    return NextResponse.json({ status: 1, links });
  } catch (error) {
    return NextResponse.json({ status: 0, error: "Failed to fetch social links" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { icon, link } = body;

    if (!icon || !link) {
      return NextResponse.json({ status: 0, error: "Icon and link are required" });
    }

    const newLink = await prisma.social_links.create({
      data: {
        icon,
        link,
      },
    });

    return NextResponse.json({ status: 1, link: newLink });
  } catch (error) {
    return NextResponse.json({ status: 0, error: "Internal Error" }, { status: 500 });
  }
}
