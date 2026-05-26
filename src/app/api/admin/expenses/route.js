import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const expenses = await prisma.expenses.findMany({
      orderBy: { id: "desc" }
    });
    
    const serialized = JSON.parse(JSON.stringify(expenses, (k, v) => typeof v === 'bigint' ? v.toString() : v));
    return NextResponse.json({ status: 1, expenses: serialized }, { status: 200 });
  } catch (error) {
    console.error("GET Expenses Error:", error);
    return NextResponse.json({ status: 0, error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const formData = await req.formData();
    
    const title = formData.get("title");
    const amount = parseFloat(formData.get("amount") || 0);
    const category = formData.get("category") || "";
    const description = formData.get("description") || "";
    const expense_date = formData.get("expense_date") ? new Date(formData.get("expense_date")) : new Date();
    const branch_id = formData.get("branch_id") ? Number(formData.get("branch_id")) : null;

    if (!title || amount <= 0) {
      return NextResponse.json({ status: 0, error: "Title and a valid Amount are required." }, { status: 400 });
    }

    let receiptName = null;
    const docFile = formData.get("attach_document");
    if (docFile && docFile.name) {
      const bytes = await docFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const ext = path.extname(docFile.name);
      receiptName = `receipt-${Date.now()}-${Math.floor(Math.random() * 1000)}${ext}`;
      const uploadDir = path.join(process.cwd(), "public/storage/app/public/admin-assets/documents/expenses");
      if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
      fs.writeFileSync(path.join(uploadDir, receiptName), buffer);
    }

    const created_by = 1; // Default to admin

    const newExpense = await prisma.expenses.create({
      data: {
        title,
        amount: amount.toString(),
        category,
        description,
        branch_id: branch_id ? BigInt(branch_id) : null,
        receipt_image: receiptName,
        expense_date,
        created_by: BigInt(created_by),
        created_at: new Date(),
        updated_at: new Date()
      }
    });

    const serialized = JSON.parse(JSON.stringify(newExpense, (k, v) => typeof v === 'bigint' ? v.toString() : v));
    return NextResponse.json({ status: 1, message: "Expense added successfully", expense: serialized }, { status: 201 });
  } catch (error) {
    console.error("POST Expense Error:", error);
    return NextResponse.json({ status: 0, error: "Internal Server Error: " + error.message }, { status: 500 });
  }
}
