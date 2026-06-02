import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;

    await prisma.social_links.delete({
      where: { id: parseInt(id) }
    });

    return NextResponse.json({ status: 1, message: "Deleted successfully" });
  } catch (error) {
    return NextResponse.json({ status: 0, error: "Internal Error" }, { status: 500 });
  }
}
