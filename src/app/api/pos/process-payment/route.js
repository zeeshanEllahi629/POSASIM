import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function POST(req) {
  try {
    const data = await req.json();

    if (!data.items || data.items.length === 0) {
      return NextResponse.json(
        { status: 0, message: "Cart is empty" },
        { status: 400 }
      );
    }

    // Run transaction
    const result = await prisma.$transaction(async (tx) => {
      // 1. Get settings for order prefix and start number
      const settings = await tx.settings.findFirst();
      const orderPrefix = settings?.order_prefix || "ORD-";
      const startNum = settings?.order_number_start || "1000";

      // 2. Generate order number
      const lastOrder = await tx.order.findFirst({
        orderBy: { id: "desc" },
      });

      let newDigit;
      if (!lastOrder || !lastOrder.order_number_digit) {
        newDigit = parseInt(startNum);
      } else {
        if (lastOrder.order_number_start === startNum) {
          newDigit = parseInt(lastOrder.order_number_digit) + 1;
        } else {
          newDigit = parseInt(startNum);
        }
      }

      const orderNumberDigit = newDigit.toString();
      const orderNumber = `${orderPrefix}${orderNumberDigit}`;

      // Get cashier ID from token cookie
      const token = req.cookies.get("token")?.value;
      let cashierId = null;
      if (token) {
        const user = verifyToken(token);
        if (user && user.id) {
          cashierId = BigInt(user.id);
        }
      }

      // 3. Create Order
      const createdOrder = await tx.order.create({
        data: {
          order_number: orderNumber,
          order_number_digit: orderNumberDigit,
          order_number_start: startNum,
          user_id: data.customer_id ? BigInt(data.customer_id) : null,
          order_type: (data.order_type || 2).toString(), // 1=Delivery, 2=Takeaway, 3=Dine-in
          name: data.customer_name || "Walk-in Customer",
          mobile: data.customer_phone ? BigInt(data.customer_phone.replace(/\D/g, "")) : null,
          email: data.customer_email || "",
          transaction_type: (data.payment_method || 1).toString(), // 1=Cash, 2=Card, 5=Split
          tax_amount: (data.tax_amount || 0).toString(),
          discount_amount: (data.discount_amount || 0).toString(),
          grand_total: (data.grand_total || 0).toString(),
          order_notes: data.notes || "",
          admin_notes: data.payment_method === 5 ? `Split Payment: Cash $${data.split_cash.toFixed(2)}, Card $${data.split_card.toFixed(2)}` : "",
          order_from: "pos",
          status: "1", // Pending
          status_type: 1, // Pending
          payment_status: 2, // Paid
          delivery_charge: "0.00",
          is_pos_order: 1,
          cashier_id: cashierId,
        },
      });

      // 4. Create Order Details and Reduce Stock
      for (const cartItem of data.items) {
        let warrantyText = "";
        const itemRecord = await tx.item.findUnique({ where: { id: BigInt(cartItem.id) } });
        if (itemRecord && itemRecord.warranty_id) {
          const warranty = await tx.warranties.findUnique({ where: { id: itemRecord.warranty_id } });
          if (warranty) warrantyText = ` (Warranty: ${warranty.name})`;
        }

        await tx.order_details.create({
          data: {
            order_id: createdOrder.id,
            user_id: data.customer_id ? BigInt(data.customer_id) : null,
            item_id: BigInt(cartItem.id),
            item_name: (cartItem.name || "") + warrantyText,
            item_image: cartItem.image || "",
            qty: (cartItem.quantity || 1).toString(),
            item_price: (cartItem.price || 0).toString(),
            addons_name: cartItem.addons_name || "",
            addons_price: cartItem.addons_price || "",
            addons_total_price: (cartItem.addons_total || 0).toString(),
            extras_name: cartItem.extras_name || "",
            extras_price: cartItem.extras_price || "",
            extras_total_price: (cartItem.extras_total || 0).toString(),
          },
        });

        // 5. Reduce stock if variation has stock management
        if (cartItem.variation_id) {
          const variation = await tx.variation.findUnique({
            where: { id: parseInt(cartItem.variation_id) },
          });

          if (variation && variation.stock_management === 1) {
            const currentQty = variation.qty || 0;
            const deductQty = cartItem.quantity || 1;
            const newQty = Math.max(0, currentQty - deductQty);

            await tx.variation.update({
              where: { id: variation.id },
              data: { qty: newQty },
            });
          }
        }
      }

      return {
        id: createdOrder.id.toString(),
        order_number: createdOrder.order_number,
      };
    });

    return NextResponse.json(
      {
        status: 1,
        message: "Order placed successfully!",
        order_id: result.id,
        order_number: result.order_number,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("POS Payment processing failed:", error);
    return NextResponse.json(
      {
        status: 0,
        message: "Payment processing failed: " + error.message,
      },
      { status: 500 }
    );
  }
}
