import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Example Payload for AI Receptionist:
// {
//   "customer_name": "John Doe",
//   "customer_phone": "+1234567890",
//   "customer_address": "123 Main St",
//   "order_type": 1, // 1 = Delivery, 2 = Takeaway, 3 = Dine-in
//   "payment_method": 1, // 1 = Cash, 2 = Card, etc.
//   "items": [
//     { "id": 1, "quantity": 2, "variation_id": null, "addons": [], "extras": [] }
//   ],
//   "notes": "No onions"
// }

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      customer_name,
      customer_phone,
      customer_address,
      order_type,
      payment_method,
      items,
      notes
    } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ status: 0, error: "Items are required" }, { status: 400 });
    }

    // 1. Calculate totals by fetching current item prices from DB to ensure security
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const dbItem = await prisma.item.findUnique({ where: { id: parseInt(item.id) } });
      if (!dbItem) continue;

      let price = parseFloat(dbItem.price);
      
      // Calculate addons/extras if they exist (simplification for AI)
      let singleItemTotal = price; 
      let totalPrice = singleItemTotal * parseInt(item.quantity);
      subtotal += totalPrice;

      orderItems.push({
        item_id: dbItem.id,
        item_name: dbItem.item_name,
        price: price,
        qty: parseInt(item.quantity),
      });
    }

    const tax = subtotal * 0.05; // 5% flat tax example
    const discountAmount = 0;
    const grandTotal = subtotal + tax - discountAmount;
    
    // Generate order number
    const orderNumber = `AI-${Date.now()}`;

    // 2. Create the Order
    const newOrder = await prisma.order.create({
      data: {
        order_number: orderNumber,
        name: customer_name || "AI Call Customer",
        mobile: customer_phone || "",
        email: "",
        order_type: parseInt(order_type) || 1, 
        payment_status: 1, // Default Unpaid for AI
        status: 1, // Pending
        tax_amount: tax,
        discount_amount: discountAmount,
        grand_total: grandTotal,
        order_notes: notes || "Ordered via AI Receptionist",
        is_pos_order: 1, // Treat as POS order so it prints to kitchen
        transaction_type: payment_method === 2 ? "Card" : "Cash",
      }
    });

    // 3. Create Order Details
    if (orderItems.length > 0) {
      const orderDetailsData = orderItems.map(item => ({
        order_id: newOrder.id,
        item_id: item.item_id,
        item_name: item.item_name,
        item_price: item.price,
        qty: item.qty,
      }));

      await prisma.order_details.createMany({
        data: orderDetailsData
      });
    }

    return NextResponse.json({
      status: 1,
      message: "Order placed successfully",
      order_id: newOrder.id,
      order_number: orderNumber,
      grand_total: grandTotal
    });

  } catch (error) {
    console.error("AI Order API Error:", error);
    return NextResponse.json({ status: 0, error: "Internal Server Error" }, { status: 500 });
  }
}
