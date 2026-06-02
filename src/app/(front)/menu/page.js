import prisma from "@/lib/prisma";
import MenuClient from "@/components/front/MenuClient";

export default async function MenuPage() {
  const categories = await prisma.categories.findMany({
    where: { is_available: 1, is_deleted: 2 },
    orderBy: { reorder_id: "asc" },
  });

  const settings = await prisma.settings.findFirst();
  const viewMode = settings?.product_card_view === 1 ? "grid" : "list";
  const showBrief = settings?.show_product_brief === 1;

  const items = await prisma.item.findMany({
    where: { item_status: 1 },
    orderBy: { id: 'desc' }
  });

  const itemIds = items.map(i => Number(i.id));
  const variations = await prisma.variation.findMany({
    where: { item_id: { in: itemIds }, is_available: 1 }
  });

  const itemsWithVariations = items.map(item => ({
    ...item,
    id: item.id.toString(),
    cat_id: item.cat_id ? item.cat_id.toString() : null,
    variations: variations
      .filter(v => v.item_id === Number(item.id))
      .map(v => ({
        ...v,
        id: v.id.toString(),
        item_id: v.item_id.toString()
      }))
  }));

  const serializedCategories = categories.map(cat => ({
    ...cat,
    id: cat.id.toString(),
  }));

  const subcategories = await prisma.subcategories.findMany({
    where: { is_available: true, is_deleted: 2 },
    orderBy: { reorder_id: "asc" },
  });

  const serializedSubcategories = subcategories.map(sub => ({
    ...sub,
    id: sub.id.toString(),
    cat_id: sub.cat_id.toString(),
  }));

  return (
    <MenuClient 
      items={itemsWithVariations} 
      categories={serializedCategories} 
      subcategories={serializedSubcategories}
      viewMode={viewMode}
      showBrief={showBrief}
    />
  );
}
