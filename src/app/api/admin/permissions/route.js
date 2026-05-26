import { NextResponse } from "next/server";

export async function GET() {
  const permissionsGrouped = {
    "User": [
      "View User", "Add User", "Edit User", "Delete User"
    ],
    "Roles": [
      "View Role", "Add Role", "Edit Role", "Delete Role"
    ],
    "Supplier": [
      "View all supplier", "View own supplier", "Add supplier", "Edit supplier", "Delete supplier"
    ],
    "Customer": [
      "View all customer", "View own customer", "Add customer", "Edit customer", "Delete customer"
    ],
    "Product": [
      "View product", "Add product", "Edit product", "Delete product", 
      "Add opening stock", "View purchase price", "Add/Edit/View/Delete unit",
      "Add/Edit/View/Delete category", "Add/Edit/View/Delete brand",
      "Add/Edit/View/Delete tax", "Print barcode"
    ],
    "Purchase & Stock": [
      "View all purchase", "View own purchase", "Add purchase", "Edit purchase", "Delete purchase",
      "Add purchase payment", "Edit purchase payment", "Delete purchase payment",
      "Update status", "View all stock adjustment", "View own stock adjustment", 
      "Add stock adjustment", "Edit stock adjustment", "Delete stock adjustment"
    ],
    "Sell": [
      "View all sell", "View own sell only", "View paid sells only", "View due sells only",
      "View partially paid sells only", "View overdue sells only", "Add Sell", "Update Sell", "Delete Sell",
      "Commission agent can view their own sell", "Add sell payment", "Edit sell payment", "Delete sell payment",
      "Edit product price from sales screen", "Edit product discount from Sale screen", 
      "Add/Edit/Delete Discount", "Access types of service", "Access all sell return", 
      "Access own sell return", "Add edit invoice number"
    ],
    "Draft & Quotations": [
      "View all drafts", "View own drafts", "Edit draft", "Delete draft",
      "View all quotations", "View own quotations", "Edit quotation", "Delete quotation"
    ],
    "Shipments": [
      "Access all shipments", "Access own shipments", "Access pending shipments only",
      "Commission agent can access their own shipments"
    ],
    "Cash Register": [
      "View cash register", "Close cash register"
    ],
    "Brand & Taxonomy": [
      "View brand", "Add brand", "Edit brand", "Delete brand",
      "View taxonomy", "Add taxonomy", "Edit taxonomy", "Delete taxonomy"
    ],
    "Expense": [
      "Access all expenses", "Access own expenses", "Add expense", "Edit expense", "Delete expense"
    ],
    "Account": [
      "Access account", "Edit account", "Delete account", 
      "Add account", "Fund transfer", "Deposit", "Close account"
    ]
  };

  return NextResponse.json({ status: 1, permissions: permissionsGrouped });
}
