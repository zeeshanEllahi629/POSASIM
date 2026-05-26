"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function AddSalePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    user_id: "",
    order_number: "",
    status: "final",
    branch_id: "",
    billing_address: "",
    shipping_address: "",
    shipping_area: "",
    driver_id: "",
    shipping_status: "pending",
    discount_type: "fixed",
    discount_amount: 0,
    tax_amount: 0,
    delivery_charge: 0,
    advance_balance: 0,
    payment_status: "unpaid",
    transaction_type: "cash",
    payment_account: "",
    payment_note: "",
    additional_expense_name: "",
    additional_expense_amount: 0,
    pay_term: "",
    attach_document: null
  });

  const [items, setItems] = useState([]);
  const [options, setOptions] = useState({
    customers: [],
    locations: [],
    availableItems: [],
    taxes: []
  });

  useEffect(() => {
    fetch("/api/admin/sales/form-data")
      .then(res => res.json())
      .then(data => {
        setOptions({
          customers: data.customers || [],
          locations: data.locations || [],
          availableItems: data.items || [],
          taxes: data.taxes || []
        });
      })
      .catch(err => console.error("Failed to load options", err));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, attach_document: e.target.files[0] }));
  };

  const addItemRow = () => {
    setItems([...items, { id: "", item_name: "", quantity: 1, price: 0, total: 0 }]);
  };

  const removeItemRow = (index) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    
    if (field === "id") {
      const selectedProduct = options.availableItems.find(p => p.id.toString() === value.toString());
      if (selectedProduct) {
        newItems[index].item_name = selectedProduct.item_name;
        newItems[index].price = selectedProduct.price || 0;
      }
    }

    const qty = parseFloat(newItems[index].quantity) || 0;
    const price = parseFloat(newItems[index].price) || 0;
    newItems[index].total = qty * price;
    
    setItems(newItems);
  };

  // Calculations
  const subtotal = items.reduce((sum, item) => sum + (parseFloat(item.total) || 0), 0);
  
  let discountValue = 0;
  if (formData.discount_type === "percentage") {
    discountValue = (subtotal * parseFloat(formData.discount_amount || 0)) / 100;
  } else {
    discountValue = parseFloat(formData.discount_amount || 0);
  }

  const grandTotal = subtotal - discountValue + parseFloat(formData.tax_amount || 0) + parseFloat(formData.delivery_charge || 0) + parseFloat(formData.additional_expense_amount || 0);
  const changeReturn = parseFloat(formData.advance_balance || 0) > grandTotal ? (parseFloat(formData.advance_balance || 0) - grandTotal) : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (items.length === 0) {
      toast.error("Please add at least one item to sale.");
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== undefined) {
          data.append(key, formData[key]);
        }
      });
      data.append("items", JSON.stringify(items));

      const res = await fetch("/api/admin/sales", {
        method: "POST",
        body: data,
      });

      const result = await res.json();
      if (res.ok && result.status === 1) {
        toast.success("Sale / Invoice created successfully!");
        router.push("/admin/orders");
      } else {
        toast.error(result.error || "Failed to save sale");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto pb-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Add Sale / Invoice</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Customer & Status */}
        <div className="bg-[#111] border border-[#222] rounded-xl p-6">
          <h2 className="text-lg font-semibold text-[#00e676] mb-4">Customer & Sale Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Customer *</label>
              <select name="user_id" required value={formData.user_id} onChange={handleChange} className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-3 py-2 text-white text-sm">
                <option value="">Please Select</option>
                {options.customers.map(c => <option key={c.id} value={c.id}>{c.name} ({c.mobile || c.email})</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Invoice No</label>
              <input type="text" name="order_number" value={formData.order_number} onChange={handleChange} className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-3 py-2 text-white text-sm" placeholder="Leave blank to auto-generate" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Sale Status *</label>
              <select name="status" value={formData.status} onChange={handleChange} className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-3 py-2 text-white text-sm">
                <option value="final">Final</option>
                <option value="draft">Draft</option>
                <option value="quotation">Quotation</option>
                <option value="proforma">Proforma</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Business Location</label>
              <select name="branch_id" value={formData.branch_id} onChange={handleChange} className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-3 py-2 text-white text-sm">
                <option value="">All Locations</option>
                {options.locations.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Addresses & Shipping */}
        <div className="bg-[#111] border border-[#222] rounded-xl p-6">
          <h2 className="text-lg font-semibold text-[#00e676] mb-4">Addresses & Shipping</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Billing Address</label>
              <textarea name="billing_address" rows="3" value={formData.billing_address} onChange={handleChange} className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-3 py-2 text-white text-sm" placeholder="Full Billing Address..."></textarea>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Shipping Address</label>
              <textarea name="shipping_address" rows="3" value={formData.shipping_address} onChange={handleChange} className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-3 py-2 text-white text-sm" placeholder="Full Shipping Address..."></textarea>
            </div>
            
            <div>
              <label className="block text-xs text-gray-400 mb-1">Shipping Status</label>
              <select name="shipping_status" value={formData.shipping_status} onChange={handleChange} className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-3 py-2 text-white text-sm">
                <option value="pending">Pending</option>
                <option value="ordered">Ordered</option>
                <option value="packed">Packed</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div>
               <label className="block text-xs text-gray-400 mb-1">Shipping Document / Attachment</label>
               <input type="file" onChange={handleFileChange} className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-3 py-[6px] text-white text-sm" />
            </div>
          </div>
        </div>

        {/* Sale Items */}
        <div className="bg-[#111] border border-[#222] rounded-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-[#00e676]">Sale Items</h2>
            <button type="button" onClick={addItemRow} className="bg-[#222] hover:bg-[#333] text-[#00e676] px-4 py-2 rounded-lg text-xs font-bold transition-all border border-[#00e676]/30">
              <i className="fas fa-plus mr-2"></i>Add Product
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#1a1a1a] text-gray-400 text-xs uppercase">
                  <th className="p-3 rounded-tl-lg">Product Name</th>
                  <th className="p-3">Quantity</th>
                  <th className="p-3">Unit Price</th>
                  <th className="p-3">Line Total</th>
                  <th className="p-3 rounded-tr-lg"></th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center p-6 text-gray-500 text-sm">No items added. Click "Add Product" to start.</td>
                  </tr>
                ) : items.map((item, index) => (
                  <tr key={index} className="border-b border-[#222]">
                    <td className="p-3">
                      <select required value={item.id} onChange={(e) => handleItemChange(index, 'id', e.target.value)} className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-3 py-2 text-white text-sm">
                        <option value="">Select Product...</option>
                        {options.availableItems.map(p => <option key={p.id} value={p.id}>{p.item_name} {p.sku ? `(${p.sku})` : ''} - ${p.price}</option>)}
                      </select>
                    </td>
                    <td className="p-3 w-32">
                      <input type="number" step="1" min="1" required value={item.quantity} onChange={(e) => handleItemChange(index, 'quantity', e.target.value)} className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-3 py-2 text-white text-sm" />
                    </td>
                    <td className="p-3 w-32">
                      <input type="number" step="0.01" min="0" required value={item.price} onChange={(e) => handleItemChange(index, 'price', e.target.value)} className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-3 py-2 text-white text-sm" />
                    </td>
                    <td className="p-3 w-32 font-bold text-[#00e676]">
                      ${item.total.toFixed(2)}
                    </td>
                    <td className="p-3 w-12 text-center">
                      <button type="button" onClick={() => removeItemRow(index)} className="text-[#ff1744] hover:bg-[#ff1744]/10 p-2 rounded-lg transition-colors">
                        <i className="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Expenses & Totals */}
        <div className="bg-[#111] border border-[#222] rounded-xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left side settings */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="block text-xs text-gray-400 mb-1">Discount Type</label>
                   <select name="discount_type" value={formData.discount_type} onChange={handleChange} className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-3 py-2 text-white text-sm">
                     <option value="fixed">Fixed</option>
                     <option value="percentage">Percentage</option>
                   </select>
                </div>
                <div>
                   <label className="block text-xs text-gray-400 mb-1">Discount Amount</label>
                   <input type="number" step="0.01" name="discount_amount" value={formData.discount_amount} onChange={handleChange} className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-3 py-2 text-white text-sm" />
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1">Order Tax</label>
                <input type="number" step="0.01" name="tax_amount" value={formData.tax_amount} onChange={handleChange} className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-3 py-2 text-white text-sm" />
              </div>
              
              <div>
                <label className="block text-xs text-gray-400 mb-1">Shipping Charges</label>
                <input type="number" step="0.01" name="delivery_charge" value={formData.delivery_charge} onChange={handleChange} className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-3 py-2 text-white text-sm" />
              </div>

              <div className="pt-4 border-t border-[#333]">
                <h3 className="text-sm font-semibold text-[#00e676] mb-3">Additional Expenses</h3>
                <div className="grid grid-cols-2 gap-4">
                   <div>
                     <label className="block text-xs text-gray-400 mb-1">Expense Name</label>
                     <input type="text" name="additional_expense_name" value={formData.additional_expense_name} onChange={handleChange} className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-3 py-2 text-white text-sm" />
                   </div>
                   <div>
                     <label className="block text-xs text-gray-400 mb-1">Expense Amount</label>
                     <input type="number" step="0.01" name="additional_expense_amount" value={formData.additional_expense_amount} onChange={handleChange} className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-3 py-2 text-white text-sm" />
                   </div>
                </div>
              </div>
            </div>

            {/* Right side totals & payment */}
            <div className="bg-[#050505] p-6 rounded-xl border border-[#222] flex flex-col justify-center space-y-3">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[#ff1744]">
                <span>Discount ({formData.discount_type === 'percentage' ? formData.discount_amount + '%' : 'Fixed'}):</span>
                <span>- ${discountValue.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Tax:</span>
                <span>+ ${parseFloat(formData.tax_amount || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Shipping Charges:</span>
                <span>+ ${parseFloat(formData.delivery_charge || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-400 pb-3 border-b border-[#333]">
                <span>Add. Expense:</span>
                <span>+ ${parseFloat(formData.additional_expense_amount || 0).toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between font-display text-2xl font-bold text-[#00e676] pt-2 mb-4">
                <span>Grand Total:</span>
                <span>${grandTotal.toFixed(2)}</span>
              </div>
              
              <div className="space-y-4 pt-4 border-t border-[#333]">
                 <div className="grid grid-cols-2 gap-4">
                   <div>
                     <label className="block text-xs text-gray-400 mb-1">Payment Status *</label>
                     <select name="payment_status" required value={formData.payment_status} onChange={handleChange} className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-3 py-2 text-white text-sm">
                       <option value="paid">Paid</option>
                       <option value="partial">Partial</option>
                       <option value="unpaid">Unpaid</option>
                     </select>
                   </div>
                   <div>
                     <label className="block text-xs text-gray-400 mb-1">Advance Balance / Paid</label>
                     <input type="number" step="0.01" name="advance_balance" value={formData.advance_balance} onChange={handleChange} className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-3 py-2 text-white text-sm text-[#00e676] font-bold" />
                   </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                   <div>
                     <label className="block text-xs text-gray-400 mb-1">Payment Method</label>
                     <select name="transaction_type" value={formData.transaction_type} onChange={handleChange} className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-3 py-2 text-white text-sm">
                       <option value="cash">Cash</option>
                       <option value="card">Card</option>
                       <option value="bank">Bank Transfer</option>
                       <option value="cheque">Cheque</option>
                     </select>
                   </div>
                   <div>
                     <label className="block text-xs text-gray-400 mb-1">Payment Account</label>
                     <input type="text" name="payment_account" value={formData.payment_account} onChange={handleChange} className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-3 py-2 text-white text-sm" placeholder="e.g. HBL Account" />
                   </div>
                 </div>

                 <div className="flex justify-between items-center bg-[#111] p-3 rounded-lg border border-[#333]">
                   <span className="text-sm text-gray-400">Change Return:</span>
                   <span className="text-lg font-bold text-[#ff1744]">${changeReturn.toFixed(2)}</span>
                 </div>

                 <div>
                   <label className="block text-xs text-gray-400 mb-1">Payment Note</label>
                   <textarea name="payment_note" rows="2" value={formData.payment_note} onChange={handleChange} className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-3 py-2 text-white text-sm"></textarea>
                 </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button type="button" onClick={() => router.push('/admin/orders')} className="px-6 py-2 rounded-lg font-semibold text-gray-300 bg-[#222] hover:bg-[#333] transition-colors">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="px-6 py-2 rounded-lg font-bold text-[#0d0d0d] bg-[#00e676] hover:bg-[#00c853] transition-colors shadow-lg shadow-[#00e676]/20">
            {loading ? "Saving..." : "Submit Sale / Invoice"}
          </button>
        </div>
      </form>
    </div>
  );
}
