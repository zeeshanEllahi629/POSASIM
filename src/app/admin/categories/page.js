import prisma from "@/lib/prisma";
import CategoriesClient from "./CategoriesClient";

function serializeData(data) {
  return JSON.parse(
    JSON.stringify(data, (key, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );
}

export default async function AdminCategoriesPage() {
  try {
    const categoriesList = await prisma.categories.findMany({
      where: {
        is_deleted: 2,
      },
      orderBy: {
        reorder_id: "asc",
      },
    });

    const serialized = serializeData(categoriesList);

    return <CategoriesClient initialCategories={serialized} />;
  } catch (error) {
    console.error("Categories Page Server Error:", error);
    return <CategoriesClient initialCategories={[]} error="Failed to load categories from database." />;
  }
}
