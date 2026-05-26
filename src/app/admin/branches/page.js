import prisma from "@/lib/prisma";
import BranchesClient from "./BranchesClient";

function serializeData(data) {
  return JSON.parse(
    JSON.stringify(data, (key, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );
}

export default async function AdminBranchesPage() {
  try {
    const branchesList = await prisma.branches.findMany({
      orderBy: {
        id: "desc",
      },
    });

    const serialized = serializeData(branchesList);

    return <BranchesClient initialBranches={serialized} />;
  } catch (error) {
    console.error("Branches Page Server Error:", error);
    return <BranchesClient initialBranches={[]} error="Failed to load branches from database." />;
  }
}
