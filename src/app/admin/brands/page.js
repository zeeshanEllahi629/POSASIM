import prisma from "@/lib/prisma";
import BrandsClient from "./BrandsClient";

function serializeData(data) {
  return JSON.parse(
    JSON.stringify(data, (key, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );
}

export default async function AdminBrandsPage() {
  try {
    const data = await prisma.brands.findMany({
      orderBy: { id: "desc" },
    });
    const serialized = serializeData(data);
    return <BrandsClient initialData={serialized} />;
  } catch (error) {
    console.error("Brands Page Server Error:", error);
    return <BrandsClient initialData={[]} error="Failed to load brands from database." />;
  }
}
