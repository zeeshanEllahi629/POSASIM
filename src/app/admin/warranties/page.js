import prisma from "@/lib/prisma";
import WarrantiesClient from "./WarrantiesClient";

function serializeData(data) {
  return JSON.parse(
    JSON.stringify(data, (key, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );
}

export default async function AdminWarrantiesPage() {
  try {
    const data = await prisma.warranties.findMany({
      orderBy: { id: "desc" },
    });
    const serialized = serializeData(data);
    return <WarrantiesClient initialData={serialized} />;
  } catch (error) {
    console.error("Warranties Page Server Error:", error);
    return <WarrantiesClient initialData={[]} error="Failed to load warranties from database." />;
  }
}
