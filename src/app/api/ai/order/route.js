import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req) {
  try {
    const body = await req.json();
    const { 
      customer_name, 
      customer_phone, 
      items, // array of { id, quantity, variation_id, addons: [], extras: [] }
      payment_type = "cash", 
      order_type = "pos", // e.g. pos, delivery, pickup
      notes 
    } = body;

    if (!items || !items.length) {
      return NextResponse.json({ success: false, error: "Items array is required" }, { status: 400 });
    }

    // 1. Calculate totals and prepare order details
    let subtotal = 0;
    const orderDetailsData = [];

    for (const orderItem of items) {
      // Fetch the item from db
      const dbItem = await prisma.item.findUnique({
        where: { id: orderItem.id },
        include: { variations: true, addons: true, extras: true }
      });

      if (!dbItem) continue;

      let itemPrice = parseFloat(dbItem.price);
      let variationName = null;

      // Handle variation
      if (orderItem.variation_id) {
        const v = dbItem.variations.find(v => v.id === orderItem.variation_id);
        if (v) {
          itemPrice = parseFloat(v.price);
          variationName = v.name;
        }
      }

      // Handle addons
      let addonsPriceTotal = 0;
      let addonsNames = [];
      let addonsIds = [];
      if (orderItem.addons && orderItem.addons.length > 0) {
        for (const addonId of orderItem.addons) {
          const a = dbItem.addons.find(a => a.id === addonId);
          if (a) {
            addonsPriceTotal += parseFloat(a.price);
            addonsNames.push(a.name);
            addonsIds.push(a.id.toString());
          }
        }
      }

      // Handle extras
      let extrasPriceTotal = 0;
      let extrasNames = [];
      let extrasIds = [];
      if (orderItem.extras && orderItem.extras.length > 0) {
        for (const extraId of orderItem.extras) {
          const e = dbItem.extras.find(e => e.id === extraId);
          if (e) {
            extrasPriceTotal += parseFloat(e.price);
            extrasNames.push(e.name);
            extrasIds.push(e.id.toString());
          }
        }
      }

      const qty = parseInt(orderItem.quantity) || 1;
      const singleItemTotal = itemPrice + addonsPriceTotal + extrasPriceTotal;
      const rowTotal = singleItemTotal * qty;
      subtotal += rowTotal;

      orderDetailsData.push({
        item_id: dbItem.id,
        item_name: dbItem.item_name,
        item_type: dbItem.item_type,
        item_image: dbItem.image,
        item_price: itemPrice.toFixed(2),
        qty: qty.toString(),
        
        addons_id: addonsIds.length ? addonsIds.join(",") : null,
        addons_name: addonsNames.length ? addonsNames.join(",") : null,
        addons_price: addonsPriceTotal > 0 ? addonsPriceTotal.toFixed(2) : null,
        addons_total_price: addonsPriceTotal > 0 ? (addonsPriceTotal * qty).toFixed(2) : null,
        
        extras_id: extrasIds.length ? extrasIds.join(",") : null,
        extras_name: extrasNames.length ? extrasNames.join(",") : null,
        extras_price: extrasPriceTotal > 0 ? extrasPriceTotal.toFixed(2) : null,
        extras_total_price: extrasPriceTotal > 0 ? (extrasPriceTotal * qty).toFixed(2) : null,
      });
    }

    if (orderDetailsData.length === 0) {
      return NextResponse.json({ success: false, error: "No valid items found" }, { status: 400 });
    }

    // Taxes
    let taxAmount = 0;
    const tax = await prisma.tax.findFirst({ where: { status: 1 } });
    if (tax) {
      taxAmount = subtotal * (parseFloat(tax.tax) / 100);
    }
    
    const grandTotal = subtotal + taxAmount;

    // Generate Order Number
    const orderPrefix = "ORD-AI-";
    const orderDigits = Math.floor(100000 + Math.random() * 900000).toString();
    const orderNumber = orderPrefix + orderDigits;

    // Create Order
    const newOrder = await prisma.order.create({
      data: {
        order_number: orderNumber,
        order_number_start: orderPrefix,
        order_number_digit: orderDigits,
        name: customer_name || "AI Customer",
        mobile: customer_phone ? parseInt(customer_phone) : null,
        order_type: order_type,
        tax_amount: taxAmount.toFixed(2),
        grand_total: grandTotal.toFixed(2),
        payment_status: payment_type === "cash" ? 2 : 1, // 1=paid, 2=unpaid
        status: "1", // 1=placed, 2=preparing, 3=ready, 4=delivered, 5=cancelled
        transaction_type: payment_type,
        address: notes || "AI Receptionist Order",
      }
    });

    // Create Order Details
    for (const detail of orderDetailsData) {
      await prisma.order_details.create({
        data: {
          ...detail,
          order_id: newOrder.id,
        }
      });
    }

    return NextResponse.json({
      success: true,
      message: "Order placed successfully",
      data: {
        order_id: newOrder.id.toString(),
        order_number: newOrder.order_number,
        grand_total: newOrder.grand_total,
        status: "placed"
      }
    });

  } catch (error) {
    console.error("AI Order POST API Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
