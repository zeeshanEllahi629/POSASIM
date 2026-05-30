import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request) {
  try {
    const notifications = await prisma.notification.findMany({
      orderBy: { id: "desc" },
    });

    const categories = await prisma.categories.findMany({
      select: { id: true, category_name: true },
    });

    const items = await prisma.item.findMany({
      select: { id: true, item_name: true },
    });

    const catMap = Object.fromEntries(categories.map(c => [c.id.toString(), c.category_name]));
    const itemMap = Object.fromEntries(items.map(i => [i.id.toString(), i.item_name]));

    const enriched = notifications.map(n => ({
      ...n,
      category_name: n.cat_id ? catMap[n.cat_id.toString()] || "Unknown" : null,
      item_name: n.item_id ? itemMap[n.item_id.toString()] || "Unknown" : null,
    }));

    return NextResponse.json({ status: 1, data: enriched });
  } catch (error) {
    console.error("Notifications GET Error:", error);
    return NextResponse.json(
      { status: 0, error: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { title, message, cat_id, item_id } = body;

    if (!title || !message) {
      return NextResponse.json(
        { status: 0, error: "Title and message are required" },
        { status: 400 }
      );
    }

    const notification = await prisma.notification.create({
      data: {
        title,
        message,
        cat_id: cat_id ? parseInt(cat_id) : null,
        item_id: item_id ? parseInt(item_id) : null,
      },
    });

    // Mock Firebase notification trigger
    // In a full implementation, you would fetch the setting and users where is_notification=1 
    // and send the FCM request via fetch() similar to the legacy curl.

    return NextResponse.json({
      status: 1,
      message: "Notification created successfully",
      notification,
    });
  } catch (error) {
    console.error("Notifications POST Error:", error);
    return NextResponse.json(
      { status: 0, error: "Failed to create notification" },
      { status: 500 }
    );
  }
}
