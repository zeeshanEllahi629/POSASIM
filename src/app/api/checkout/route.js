import prisma from "@/lib/prisma";
import { NextResponse } from 'next/server';
import { verifyToken } from "@/lib/auth";

// Helper to generate an order number
function generateOrderNumber() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `ORD-${result}`;
}

// Ensure BigInts are properly serialized if we need to return them in JSON
BigInt.prototype.toJSON = function() { return this.toString() }

export async function GET() {
  try {
    const payments = await prisma.payment.findMany({
      where: { is_available: 1 },
      orderBy: { reorder_id: "asc" }
    });
    const branches = await prisma.branches.findMany({
      where: { status: 1 },
      orderBy: { name: "asc" }
    });
    return NextResponse.json({ success: true, payments, branches });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch checkout data" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const { formData, cartItems, subtotal, tax, deliveryFee, discountAmount, promoCode, total } = data;

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    const orderNumber = generateOrderNumber();

    // Check for logged in user to associate the order
    let userId = null;
    const tokenCookie = request.cookies.get("token");
    if (tokenCookie) {
      const payload = verifyToken(tokenCookie.value);
      if (payload && payload.id) {
        userId = parseInt(payload.id);
      }
    }

    // Start a Prisma transaction
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create the Order
      const newOrder = await tx.order.create({
        data: {
          order_number: orderNumber,
          user_id: userId,
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          mobile: formData.phone ? BigInt(formData.phone.replace(/\D/g, '')) : null,
          address: formData.address,
          city: formData.city,
          postal_code: formData.zipCode,
          order_notes: formData.orderNotes,
          order_type: formData.orderType ? formData.orderType.toString() : "1", // 1 for Delivery, 2 for Collection
          transaction_type: formData.paymentMethod,
          payment_status: formData.paymentMethod.toLowerCase().includes('cash') ? 1 : 2, // 1 = Unpaid (COD), 2 = Paid (Stripe/PayPal)
          status: "1", // 1 = Pending
          grand_total: total.toFixed(2),
          tax_amount: tax.toFixed(2),
          delivery_charge: deliveryFee.toFixed(2),
          discount_amount: discountAmount ? discountAmount.toFixed(2) : "0.00",
          offer_code: promoCode || null,
          is_notification: 1,
          is_pos_order: 0,
          branch_id: formData.branchId ? parseInt(formData.branchId) : null,
        }
      });

      // 2. Create Order Details
      const orderDetailsPromises = cartItems.map(item => {
        return tx.order_details.create({
          data: {
            order_id: newOrder.id,
            item_id: BigInt(item.id),
            item_name: item.name,
            item_image: item.image ? item.image.split('/').pop() : null, // Store just filename if possible, or full
            item_price: item.price.toString(),
            qty: item.quantity.toString(),
          }
        });
      });

      await Promise.all(orderDetailsPromises);

      return newOrder;
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Order placed successfully',
      orderNumber: result.order_number 
    });

  } catch (error) {
    console.error("Checkout Error:", error);
    return NextResponse.json({ error: 'Failed to process checkout.' }, { status: 500 });
  }
}
