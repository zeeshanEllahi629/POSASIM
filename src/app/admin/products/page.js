import prisma from "@/lib/prisma";
import ProductsClient from "./ProductsClient";

function serializeData(data) {
  return JSON.parse(
    JSON.stringify(data, (key, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );
}

export default async function AdminProductsPage() {
  try {
    const productsList = await prisma.item.findMany({
      orderBy: {
        id: "desc",
      },
    });

    const categoriesList = await prisma.categories.findMany({
      where: {
        is_deleted: 2,
      },
      orderBy: {
        reorder_id: "asc",
      },
    });

    const settings = await prisma.settings.findFirst();
    const initialViewMode = settings?.product_card_view === 1 ? "grid" : "list";

    const serializedProducts = serializeData(productsList);
    const serializedCategories = serializeData(categoriesList);

    return (
      <ProductsClient
        initialProducts={serializedProducts}
        categories={serializedCategories}
        initialViewMode={initialViewMode}
      />
    );
  } catch (error) {
    console.error("Products Page Server Error:", error);
    return (
      <ProductsClient
        initialProducts={[]}
        categories={[]}
        error="Failed to load items and categories from database."
      />
    );
  }
}
