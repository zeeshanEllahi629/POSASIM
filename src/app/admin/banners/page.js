import BannersClient from "./BannersClient";
import prisma from "@/lib/prisma";


export const metadata = {
  title: "Admin - Banners",
};

export default async function BannersPage() {
  let banners = [];
  let categories = [];
  let items = [];
  let error = null;

  try {
    banners = await prisma.banner.findMany({
      orderBy: { reorder_id: "asc" },
    });
    
    categories = await prisma.categories.findMany({
      where: { is_available: 1, is_deleted: 2 },
      orderBy: { reorder_id: "asc" },
    });
    
    items = await prisma.item.findMany({
      where: { item_status: 1 },
      orderBy: { reorder_id: "asc" },
    });
    
  } catch (err) {
    console.error("Failed to load banners:", err);
    error = "Failed to load banners from the database.";
  }

  // Convert BigInt to String
  const serializedCategories = categories.map((c) => ({
    ...c,
    id: c.id.toString(),
  }));
  const serializedItems = items.map((i) => ({
    ...i,
    id: i.id.toString(),
  }));

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white tracking-tight">
          Banners Management
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Create and manage promotional banners
        </p>
      </div>

      <BannersClient 
        initialBanners={banners} 
        categories={serializedCategories}
        items={serializedItems}
        error={error} 
      />
    </div>
  );
}

