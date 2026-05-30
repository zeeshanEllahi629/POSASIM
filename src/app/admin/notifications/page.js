import { prisma } from "@/lib/prisma";
import NotificationsClient from "./NotificationsClient";

export const metadata = {
  title: "Notifications | Admin Dashboard",
};

export default async function NotificationsPage() {
  let initialData = [];
  let categories = [];
  let items = [];
  let error = null;

  try {
    const notifications = await prisma.notification.findMany({
      orderBy: { id: "desc" },
    });

    const activeCategories = await prisma.categories.findMany({
      where: { is_available: 1 },
      select: { id: true, category_name: true },
      orderBy: { reorder_id: "asc" },
    });

    const activeItems = await prisma.item.findMany({
      where: { item_status: 1 },
      select: { id: true, item_name: true },
      orderBy: { reorder_id: "asc" },
    });

    const catMap = Object.fromEntries(activeCategories.map(c => [c.id.toString(), c.category_name]));
    const itemMap = Object.fromEntries(activeItems.map(i => [i.id.toString(), i.item_name]));

    initialData = notifications.map(n => ({
      ...n,
      category_name: n.cat_id ? catMap[n.cat_id.toString()] || "Unknown" : null,
      item_name: n.item_id ? itemMap[n.item_id.toString()] || "Unknown" : null,
    }));

    categories = activeCategories.map((c) => ({ ...c, id: c.id.toString() }));
    items = activeItems.map((i) => ({ ...i, id: i.id.toString() }));
  } catch (err) {
    console.error("Error fetching notifications:", err);
    error = "Failed to load notifications.";
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white tracking-tight mb-2">
          Push Notifications
        </h1>
        <p className="text-gray-400 text-sm">
          Send push notifications to mobile app users.
        </p>
      </div>

      <NotificationsClient initialData={initialData} categories={categories} items={items} error={error} />
    </div>
  );
}
