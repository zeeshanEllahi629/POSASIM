import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import fs from "fs";
import path from "path";

export async function POST(req) {
  try {
    const formData = await req.formData();
    
    const supplier_id = formData.get("supplier_id");
    const reference_no = formData.get("reference_no") || `PO-${Date.now()}`;
    const purchase_date = formData.get("purchase_date") ? new Date(formData.get("purchase_date")) : new Date();
    const purchase_status = formData.get("purchase_status") || "received";
    const branch_id = formData.get("branch_id") ? Number(formData.get("branch_id")) : null;
    const pay_term = formData.get("pay_term") || "";
    const payment_status = formData.get("payment_status") || "unpaid";
    
    // Parse numeric totals
    const discount_amount = parseFloat(formData.get("discount_amount")) || 0;
    const tax_amount = parseFloat(formData.get("tax_amount")) || 0;
    const shipping_charges = parseFloat(formData.get("shipping_charges")) || 0;
    
    // items should be a JSON string
    const itemsJson = formData.get("items");
    let items = [];
    if (itemsJson) {
      items = JSON.parse(itemsJson);
    }

    if (!supplier_id || items.length === 0) {
      return NextResponse.json({ status: 0, error: "Supplier and Items are required." }, { status: 400 });
    }

    // Calculate totals
    const total_amount = items.reduce((sum, item) => sum + (parseFloat(item.cost_price) * parseFloat(item.quantity)), 0);
    const grand_total = total_amount - discount_amount + tax_amount + shipping_charges;

    let docName = null;
    const docFile = formData.get("attach_document");
    if (docFile && docFile.name) {
      const bytes = await docFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const ext = path.extname(docFile.name);
      docName = `doc-${Date.now()}-${Math.floor(Math.random() * 1000)}${ext}`;
      const uploadDir = path.join(process.cwd(), "public/storage/app/public/admin-assets/documents");
      if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
      fs.writeFileSync(path.join(uploadDir, docName), buffer);
    }

    // Default created_by to admin (id 1) for now
    const created_by = 1;

    // Use transaction to create purchase and purchase items
    const result = await prisma.$transaction(async (tx) => {
      const purchase = await tx.purchases.create({
        data: {
          supplier_id: BigInt(supplier_id),
          branch_id: branch_id ? BigInt(branch_id) : null,
          reference_no,
          total_amount,
          discount_amount,
          tax_amount,
          grand_total,
          payment_status,
          purchase_status,
          purchase_date,
          pay_term,
          attach_document: docName,
          created_by: BigInt(created_by),
          created_at: new Date(),
          updated_at: new Date(),
        }
      });

      const purchaseItemsData = items.map(item => ({
        purchase_id: purchase.id,
        product_id: BigInt(item.id),
        quantity: parseFloat(item.quantity),
        cost_price: parseFloat(item.cost_price),
        total: parseFloat(item.cost_price) * parseFloat(item.quantity),
        created_at: new Date(),
        updated_at: new Date()
      }));

      if (purchaseItemsData.length > 0) {
        await tx.purchase_items.createMany({
          data: purchaseItemsData
        });
      }

      // If status is received, update stock in item table
      if (purchase_status === "received") {
        for (const item of items) {
          await tx.item.update({
            where: { id: BigInt(item.id) },
            data: {
              qty: {
                increment: parseInt(item.quantity)
              }
            }
          });
        }
      }

      return purchase;
    });

    const serialized = JSON.parse(JSON.stringify(result, (k, v) => typeof v === 'bigint' ? v.toString() : v));

    return NextResponse.json({ status: 1, message: "Purchase created successfully", purchase: serialized }, { status: 201 });
  } catch (error) {
    console.error("POST Purchase Error:", error);
    return NextResponse.json({ status: 0, error: "Internal Server Error: " + error.message }, { status: 500 });
  }
}
