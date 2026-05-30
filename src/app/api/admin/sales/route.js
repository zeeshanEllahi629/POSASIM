import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import fs from "fs";
import path from "path";

export async function POST(req) {
  try {
    const formData = await req.formData();
    
    const user_id = formData.get("user_id");
    const order_number = formData.get("order_number") || `INV-${Date.now()}`;
    const branch_id = formData.get("branch_id") ? Number(formData.get("branch_id")) : null;
    
    // Status can be: quotation, final, proforma, draft
    const status = formData.get("status") || "final";
    const shipping_status = formData.get("shipping_status") || "pending";
    
    // Addresses
    const billing_address = formData.get("billing_address") || "";
    const shipping_address = formData.get("shipping_address") || "";
    const shipping_area = formData.get("shipping_area") || "";
    const driver_id = formData.get("driver_id") ? Number(formData.get("driver_id")) : null;

    // Financials
    const discount_type = formData.get("discount_type") || "fixed";
    const discount_amount = formData.get("discount_amount") || "0.00";
    const tax_amount = formData.get("tax_amount") || "0.00";
    const delivery_charge = formData.get("delivery_charge") || "0.00";
    
    // Payments
    const advance_balance = parseFloat(formData.get("advance_balance") || "0.00");
    const payment_status = formData.get("payment_status") === "paid" ? 1 : (formData.get("payment_status") === "partial" ? 2 : 0);
    const transaction_type = formData.get("transaction_type") || "cash";
    const payment_account = formData.get("payment_account") || "";
    const payment_note = formData.get("payment_note") || "";
    
    // Advanced Expenses
    const additional_expense_name = formData.get("additional_expense_name") || "";
    const additional_expense_amount = parseFloat(formData.get("additional_expense_amount") || "0.00");
    const pay_term = formData.get("pay_term") || "";

    const itemsJson = formData.get("items");
    let items = [];
    if (itemsJson) {
      items = JSON.parse(itemsJson);
    }

    if (!user_id || items.length === 0) {
      return NextResponse.json({ status: 0, error: "Customer and Items are required." }, { status: 400 });
    }

    // Subtotal
    const subtotal = items.reduce((sum, item) => sum + (parseFloat(item.price) * parseFloat(item.quantity)), 0);
    
    // Calculate final grand total based on discount type
    let final_discount = 0;
    if (discount_type === "percentage") {
      final_discount = (subtotal * parseFloat(discount_amount)) / 100;
    } else {
      final_discount = parseFloat(discount_amount);
    }

    const grand_total = subtotal - final_discount + parseFloat(tax_amount) + parseFloat(delivery_charge) + additional_expense_amount;
    const change_return = advance_balance > grand_total ? (advance_balance - grand_total) : 0;

    let docName = null;
    const docFile = formData.get("attach_document");
    if (docFile && docFile.name) {
      const bytes = await docFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const ext = path.extname(docFile.name);
      docName = `sale-doc-${Date.now()}-${Math.floor(Math.random() * 1000)}${ext}`;
      const uploadDir = path.join(process.cwd(), "public/storage/app/public/admin-assets/documents");
      if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
      fs.writeFileSync(path.join(uploadDir, docName), buffer);
    }

    const result = await prisma.$transaction(async (tx) => {
      // Create the order/sale record
      const order = await tx.order.create({
        data: {
          user_id: BigInt(user_id),
          branch_id: branch_id ? BigInt(branch_id) : null,
          order_number,
          order_type: "3", // E.g. "3" for Admin POS / ERP Sales
          billing_address,
          address: shipping_address, // Map shipping to address
          shipping_area,
          driver_id,
          status,
          shipping_status,
          discount_type,
          discount_amount: final_discount.toString(),
          tax_amount: tax_amount.toString(),
          delivery_charge: delivery_charge.toString(),
          grand_total: grand_total.toString(),
          advance_balance,
          change_return,
          payment_status,
          transaction_type,
          payment_account,
          payment_note,
          pay_term,
          additional_expense_name,
          additional_expense_amount,
          attach_document: docName,
          paid_on: payment_status > 0 ? new Date() : null,
          is_notification: 1,
          created_at: new Date(),
          updated_at: new Date(),
        }
      });

      // Create order items (order_details)
      const orderDetailsData = items.map(item => ({
        order_id: order.id,
        item_id: BigInt(item.id),
        item_name: item.item_name,
        price: item.price.toString(),
        qty: item.quantity.toString(),
        total_price: (parseFloat(item.price) * parseFloat(item.quantity)).toString(),
        tax: "0" // For simplicity
      }));

      if (orderDetailsData.length > 0) {
        await tx.order_details.createMany({
          data: orderDetailsData
        });
      }

      // Decrement stock if final
      if (status === "final") {
        for (const item of items) {
          await tx.item.update({
            where: { id: BigInt(item.id) },
            data: {
              qty: {
                decrement: parseInt(item.quantity)
              }
            }
          });
        }
      }

      return order;
    });

    const serialized = JSON.parse(JSON.stringify(result, (k, v) => typeof v === 'bigint' ? v.toString() : v));

    return NextResponse.json({ status: 1, message: "Sale created successfully", sale: serialized }, { status: 201 });
  } catch (error) {
    console.error("POST Sale Error:", error);
    return NextResponse.json({ status: 0, error: "Internal Server Error: " + error.message }, { status: 500 });
  }
}
