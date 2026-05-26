import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request) {
  try {
    const agents = await prisma.sales_agents.findMany({
      orderBy: { id: "desc" },
    });
    
    return NextResponse.json({
      status: 1,
      agents: agents.map(a => ({
        ...a,
        id: a.id.toString(),
        user_id: a.user_id.toString(),
        branch_id: a.branch_id ? a.branch_id.toString() : null,
        target_amount: a.target_amount ? a.target_amount.toNumber() : 0,
        commission_rate: a.commission_rate ? a.commission_rate.toNumber() : 0,
      }))
    });
  } catch (error) {
    return NextResponse.json({ status: 0, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { user_id, target_amount, commission_rate, branch_id, status } = body;

    const existing = await prisma.sales_agents.findFirst({
      where: { user_id: BigInt(user_id) }
    });

    if (existing) {
      return NextResponse.json({ status: 0, error: "This user is already a sales agent." }, { status: 400 });
    }

    const newAgent = await prisma.sales_agents.create({
      data: {
        user_id: BigInt(user_id),
        target_amount: parseFloat(target_amount),
        commission_rate: parseFloat(commission_rate),
        branch_id: branch_id ? BigInt(branch_id) : null,
        status: parseInt(status, 10),
        created_at: new Date(),
        updated_at: new Date(),
      },
    });

    const user = await prisma.users.findUnique({
      where: { id: BigInt(user_id) },
      select: { name: true, email: true }
    });

    let branch_name = "No Branch";
    if (branch_id) {
      const branch = await prisma.branches.findUnique({
        where: { id: BigInt(branch_id) },
        select: { name: true }
      });
      if (branch) branch_name = branch.name;
    }

    return NextResponse.json({
      status: 1,
      agent: {
        ...newAgent,
        id: newAgent.id.toString(),
        user_id: newAgent.user_id.toString(),
        branch_id: newAgent.branch_id ? newAgent.branch_id.toString() : null,
        target_amount: newAgent.target_amount.toNumber(),
        commission_rate: newAgent.commission_rate.toNumber(),
        user_name: user ? user.name : "Unknown User",
        user_email: user ? user.email : "",
        branch_name,
      }
    });

  } catch (error) {
    return NextResponse.json({ status: 0, error: error.message }, { status: 500 });
  }
}
