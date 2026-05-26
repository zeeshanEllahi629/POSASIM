import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(req) {
  try {
    const body = await req.json();
    const { viewMode } = body; // "list" or "grid"

    if (!viewMode || !["list", "grid"].includes(viewMode)) {
      return NextResponse.json({ status: 0, error: "Invalid view mode" }, { status: 400 });
    }

    // Map "grid" -> 1, "list" -> 2
    const product_card_view = viewMode === "grid" ? 1 : 2;

    const existing = await prisma.settings.findFirst();
    if (existing) {
      await prisma.settings.update({
        where: { id: existing.id },
        data: { product_card_view },
      });
    } else {
      // Should not happen normally, but just in case
      await prisma.settings.create({
        data: { product_card_view, theme: 1, login_required: "1", is_checkout_login_required: 1, max_order_qty: 10, min_order_amount: 1, max_order_amount: 1000, firebase: "", referral_amount: 0, web_primary_color: "", web_secondary_color: "", admin_primary_color: "", admin_secondary_color: "", tawk_widget_id: "", tawk_on_off: 0, quick_call: 0, quick_call_mobile_view_on_off: 0, quick_call_position: 1, fake_sales_notification: 0, product_source: 1, next_time_popup: 1, notification_display_time: 5, sales_notification_position: 1, product_fake_view: 0, min_view_count: 0, max_view_count: 0, cart_checkout_countdown: 0, countdown_mins: 0, cart_checkout_progressbar: 0, interval_time: 1 }
      });
    }

    return NextResponse.json({ status: 1, message: "View mode updated" });
  } catch (error) {
    console.error("PATCH view mode Error:", error);
    return NextResponse.json({ status: 0, error: "Internal Server Error" }, { status: 500 });
  }
}
