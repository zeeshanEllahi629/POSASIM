import prisma from "@/lib/prisma";
import AddonsClient from "./AddonsClient";


export default async function AddonsPage() {
  let groups = [];
  let addons = [];
  let error = null;

  try {
    groups = await prisma.addons_group.findMany({
      where: { is_deleted: 2 },
      orderBy: { reorder_id: "asc" },
    });

    addons = await prisma.addons.findMany({
      where: { is_deleted: 2 },
      orderBy: { reorder_id: "asc" },
    });
  } catch (err) {
    console.error("Error fetching addons data:", err);
    error = "Failed to load data";
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Addons Management</h1>
        <p className="text-sm text-gray-400">Manage addon groups and individual addons.</p>
      </div>

      <AddonsClient 
        initialGroups={groups}
        initialAddons={addons}
        error={error}
      />
    </div>
  );
}

