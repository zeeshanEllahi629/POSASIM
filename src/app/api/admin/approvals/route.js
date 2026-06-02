import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendApprovalEmail } from "@/lib/mailer";

export async function GET(request) {
  try {
    const unapprovedUsers = await prisma.users.findMany({
      where: { is_approved: 0, type: 1 },
      select: { id: true, name: true, email: true, created_at: true },
    });
    return NextResponse.json(unapprovedUsers);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { userId, action } = await request.json();

    if (!userId || !["approve", "reject"].includes(action)) {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    if (action === "approve") {
      const user = await prisma.users.update({
        where: { id: parseInt(userId) },
        data: { is_approved: 1 },
      });
      // Send email asynchronously
      sendApprovalEmail(user.email, user.name);
      return NextResponse.json({ message: "User approved successfully" });
    } else {
      await prisma.users.delete({
        where: { id: parseInt(userId) },
      });
      return NextResponse.json({ message: "User rejected and removed" });
    }
  } catch (error) {
    return NextResponse.json({ error: "Action failed" }, { status: 500 });
  }
}
