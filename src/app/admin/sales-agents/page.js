import prisma from "@/lib/prisma";
import SalesAgentsClient from "./SalesAgentsClient";

export const dynamic = "force-dynamic";

export default async function SalesAgentsPage() {
  let initialAgents = [];
  let users = [];
  let branches = [];
  let error = null;

  try {
    const data = await prisma.sales_agents.findMany({
      orderBy: { id: "desc" },
    });

    const usersData = await prisma.users.findMany({
      where: { type: 1 },
      select: { id: true, name: true, email: true },
    });

    const branchesData = await prisma.branches.findMany({
      where: { status: 1 },
      select: { id: true, name: true },
    });

    const userMap = {};
    usersData.forEach(u => userMap[u.id.toString()] = u);

    const branchMap = {};
    branchesData.forEach(b => branchMap[b.id.toString()] = b);

    initialAgents = data.map(agent => ({
      ...agent,
      id: agent.id.toString(),
      user_id: agent.user_id.toString(),
      branch_id: agent.branch_id ? agent.branch_id.toString() : null,
      target_amount: agent.target_amount ? agent.target_amount.toNumber() : 0,
      commission_rate: agent.commission_rate ? agent.commission_rate.toNumber() : 0,
      user_name: userMap[agent.user_id.toString()]?.name || "Unknown User",
      user_email: userMap[agent.user_id.toString()]?.email || "",
      branch_name: agent.branch_id && branchMap[agent.branch_id.toString()] ? branchMap[agent.branch_id.toString()].name : "No Branch",
    }));

    users = usersData.map(u => ({ id: u.id.toString(), name: u.name }));
    branches = branchesData.map(b => ({ id: b.id.toString(), name: b.name }));

  } catch (err) {
    console.error("Error fetching sales agents:", err);
    error = "Failed to load sales agents.";
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">Sales Agents</h1>
        <p className="text-sm text-gray-400">
          Manage your sales agents and commissions.
        </p>
      </div>

      <SalesAgentsClient 
        initialAgents={initialAgents} 
        users={users} 
        branches={branches} 
        error={error} 
      />
    </div>
  );
}
