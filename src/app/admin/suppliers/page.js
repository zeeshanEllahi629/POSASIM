import prisma from "@/lib/prisma";
import SuppliersClient from "./SuppliersClient";

function serializeData(data) {
  return JSON.parse(
    JSON.stringify(data, (key, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );
}

export default async function AdminSuppliersPage() {
  try {
    const suppliersList = await prisma.suppliers.findMany({
      where: {
        status: 1,
      },
      orderBy: {
        id: "desc",
      },
    });

    const serialized = serializeData(suppliersList);

    return <SuppliersClient initialSuppliers={serialized} />;
  } catch (error) {
    console.error("Suppliers Page Server Error:", error);
    return <SuppliersClient initialSuppliers={[]} error="Failed to load suppliers from database." />;
  }
}
