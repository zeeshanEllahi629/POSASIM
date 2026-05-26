import prisma from "@/lib/prisma";
import UnitsClient from "./UnitsClient";

function serializeData(data) {
  return JSON.parse(
    JSON.stringify(data, (key, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );
}

export default async function AdminUnitsPage() {
  try {
    const data = await prisma.units.findMany({
      orderBy: { id: "desc" },
    });
    const serialized = serializeData(data);
    return <UnitsClient initialData={serialized} />;
  } catch (error) {
    console.error("Units Page Server Error:", error);
    return <UnitsClient initialData={[]} error="Failed to load units from database." />;
  }
}
