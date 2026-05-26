import prisma from "@/lib/prisma";
import InventoryClient from "./InventoryClient";

function serializeData(data) {
  return JSON.parse(
    JSON.stringify(data, (key, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );
}

export default async function AdminInventoryPage() {
  try {
    const itemsList = await prisma.item.findMany({
      where: {
        is_deleted: 2,
      },
      orderBy: {
        id: "desc",
      },
    });

    const categoriesList = await prisma.categories.findMany({
      where: {
        is_deleted: 2,
        is_available: 1,
      },
    });

    const variationsList = await prisma.variation.findMany({
      orderBy: { id: "asc" }
    });

    const activityLogsList = await prisma.activity_logs.findMany({
      where: {
        module: "inventory"
      },
      orderBy: {
        id: "desc"
      },
      take: 100
    });

    const serializedItems = serializeData(itemsList);
    const serializedCats = serializeData(categoriesList);
    const serializedVars = serializeData(variationsList);
    const serializedLogs = serializeData(activityLogsList);

    return (
      <InventoryClient 
        initialItems={serializedItems}
        initialCategories={serializedCats}
        initialVariations={serializedVars}
        initialLogs={serializedLogs}
      />
    );
  } catch (error) {
    console.error("Inventory Page Server Error:", error);
    return <InventoryClient error="Failed to load inventory from database." />;
  }
}
