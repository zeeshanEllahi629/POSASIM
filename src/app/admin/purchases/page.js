import prisma from "@/lib/prisma";
import PurchasesClient from "./PurchasesClient";

function serializeData(data) {
  return JSON.parse(
    JSON.stringify(data, (key, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );
}

export default async function AdminPurchasesPage() {
  try {
    const purchasesList = await prisma.purchases.findMany({
      include: {
        suppliers: true,
        users: true,
        purchase_items: true,
      },
      orderBy: {
        id: "desc",
      },
    });

    const suppliersList = await prisma.suppliers.findMany({
      where: {
        status: 1,
      },
      orderBy: {
        name: "asc",
      },
    });

    const itemsList = await prisma.item.findMany({
      where: {
        item_status: 1,
      },
      orderBy: {
        item_name: "asc",
      },
    });

    const serializedPurchases = serializeData(purchasesList);
    const serializedSuppliers = serializeData(suppliersList);
    const serializedItems = serializeData(itemsList);

    return (
      <PurchasesClient 
        initialPurchases={serializedPurchases} 
        suppliers={serializedSuppliers} 
        items={serializedItems} 
      />
    );
  } catch (error) {
    console.error("Purchases Page Server Error:", error);
    return <PurchasesClient initialPurchases={[]} suppliers={[]} items={[]} error="Failed to load purchases from database." />;
  }
}
