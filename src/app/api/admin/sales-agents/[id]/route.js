import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(request, { params }) {
  try {
    const id = BigInt(params.id);
    const body = await request.json();
    const { target_amount, commission_rate, branch_id, status } = body;

    const updated = await prisma.sales_agents.update({
      where: { id },
      data: {
        target_amount: parseFloat(target_amount),
        commission_rate: parseFloat(commission_rate),
        branch_id: branch_id ? BigInt(branch_id) : null,
        status: parseInt(status, 10),
        updated_at: new Date(),
      },
    });

    const user = await prisma.users.findUnique({
      where: { id: updated.user_id },
      select: { name: true, email: true }
    });

    let branch_name = "No Branch";
    if (updated.branch_id) {
      const branch = await prisma.branches.findUnique({
        where: { id: updated.branch_id },
        select: { name: true }
      });
      if (branch) branch_name = branch.name;
    }

    return NextResponse.json({
      status: 1,
      agent: {
        ...updated,
        id: updated.id.toString(),
        user_id: updated.user_id.toString(),
        branch_id: updated.branch_id ? updated.branch_id.toString() : null,
        target_amount: updated.target_amount.toNumber(),
        commission_rate: updated.commission_rate.toNumber(),
        user_name: user ? user.name : "Unknown User",
        user_email: user ? user.email : "",
        branch_name,
      }
    });
  } catch (error) {
    return NextResponse.json({ status: 0, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const id = BigInt(params.id);
    await prisma.sales_agents.delete({
      where: { id },
    });
    return NextResponse.json({ status: 1, message: "Deleted successfully" });
  } catch (error) {
    return NextResponse.json({ status: 0, error: error.message }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const id = BigInt(params.id);
    const body = await request.json();
    const { status } = body;

    await prisma.sales_agents.update({
      where: { id },
      data: {
        status: parseInt(status, 10),
        updated_at: new Date(),
      },
    });

    return NextResponse.json({ status: 1, message: "Status updated successfully" });
  } catch (error) {
    return NextResponse.json({ status: 0, error: error.message }, { status: 500 });
  }
}
