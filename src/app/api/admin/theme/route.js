import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req) {
  try {
    const settings = await prisma.settings.findFirst();
    const banners = await prisma.banner.findMany({
      orderBy: { reorder_id: 'asc' }
    });
    
    return NextResponse.json({
      success: true,
      settings: settings || {},
      banners
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const data = await req.json();
    
    // Check if settings row exists
    let existingSettings = await prisma.settings.findFirst();
    let updatedSettings;

    const payload = {
      web_primary_color: data.web_primary_color,
      web_secondary_color: data.web_secondary_color,
      footer_title: data.footer_title,
      footer_description: data.footer_description,
      facebook_link: data.facebook_link,
      instagram_link: data.instagram_link,
      tiktok_link: data.tiktok_link,
    };

    if (existingSettings) {
      updatedSettings = await prisma.settings.update({
        where: { id: existingSettings.id },
        data: payload
      });
    } else {
      // Create new with required fields stubbed out (in a real scenario, this relies on defaults or valid data)
      payload.theme = 1;
      payload.login_required = '0';
      payload.is_checkout_login_required = 0;
      payload.notification_tune = '';
      payload.currency_space = '1';
      payload.decimal_separator = '.';
      payload.max_order_qty = 10;
      payload.min_order_amount = 0;
      payload.max_order_amount = 10000;
      payload.firebase = '';
      payload.referral_amount = 0;
      payload.web_primary_color = payload.web_primary_color || '#00e676';
      payload.web_secondary_color = payload.web_secondary_color || '#111111';
      payload.admin_primary_color = '#00e676';
      payload.admin_secondary_color = '#111111';
      payload.cart_checkout_countdown = 0;
      payload.countdown_mins = 0;
      payload.cart_checkout_progressbar = 0;
      payload.fake_sales_notification = 0;
      payload.product_source = 0;
      payload.next_time_popup = 0;
      payload.notification_display_time = 0;
      payload.sales_notification_position = 0;
      payload.product_fake_view = 0;
      payload.min_view_count = 0;
      payload.max_view_count = 0;
      payload.quick_call = 0;
      payload.quick_call_mobile_view_on_off = 0;
      payload.quick_call_position = 0;
      payload.tawk_on_off = 0;
      payload.tawk_widget_id = '';
      payload.review_approved_status = 2;

      updatedSettings = await prisma.settings.create({
        data: payload
      });
    }

    return NextResponse.json({ success: true, settings: updatedSettings });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  // Handle creating new banners
  try {
    const data = await req.json();
    
    if (data.action === 'delete_banner') {
       await prisma.banner.delete({ where: { id: parseInt(data.id) } });
       return NextResponse.json({ success: true });
    }

    if (data.action === 'add_banner') {
      const banner = await prisma.banner.create({
        data: {
          image: data.image || '',
          type: data.type || 'home',
          is_available: 1,
          section: 0,
          reorder_id: data.reorder_id || 1,
        }
      });
      return NextResponse.json({ success: true, banner });
    }

    return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
