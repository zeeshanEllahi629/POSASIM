"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function AddPurchasePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    supplier_id: "",
    reference_no: "",
    purchase_date: new Date().toISOString().split('T')[0],
    purchase_status: "received",
    branch_id: "",
    pay_term: "",
    payment_status: "unpaid",
    discount_amount: 0,
    tax_amount: 0,
    shipping_charges: 0,
    attach_document: null
  });

  const [items, setItems] = useState([]);
  const [options, setOptions] = useState({
    suppliers: [],
    locations: [],
    availableItems: []
  });

  useEffect(() => {
    fetch("/api/admin/purchases/form-data")
      .then(res => res.json())
      .then(data => {
        setOptions({
          suppliers: data.suppliers || [],
          locations: data.locations || [],
          availableItems: data.items || []
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
    setItems([...items, { id: "", item_name: "", quantity: 1, cost_price: 0, total: 0 }]);
  };

  const removeItemRow = (index) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    
    // Auto-fill cost price if product selected
    if (field === "id") {
      const selectedProduct = options.availableItems.find(p => p.id.toString() === value.toString());
      if (selectedProduct) {
        newItems[index].item_name = selectedProduct.item_name;
        newItems[index].cost_price = selectedProduct.price || 0;
      }
    }

    // Recalculate line total
    const qty = parseFloat(newItems[index].quantity) || 0;
    const cost = parseFloat(newItems[index].cost_price) || 0;
    newItems[index].total = qty * cost;
    
    setItems(newItems);
  };

  const subtotal = items.reduce((sum, item) => sum + (parseFloat(item.total) || 0), 0);
  const grandTotal = subtotal - parseFloat(formData.discount_amount || 0) + parseFloat(formData.tax_amount || 0) + parseFloat(formData.shipping_charges || 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (items.length === 0) {
      toast.error("Please add at least one item to purchase.");
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

      const res = await fetch("/api/admin/purchases", {
        method: "POST",
        body: data,
      });

      const result = await res.json();
      if (res.ok && result.status === 1) {
        toast.success("Purchase added successfully!");
        router.push("/admin/purchases");
      } else {
        toast.error(result.error || "Failed to save purchase");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Add Purchase</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Supplier & Details */}
        <div className="bg-[#111] border border-[#222] rounded-xl p-6">
          <h2 className="text-lg font-semibold text-[#00e676] mb-4">Supplier & Reference</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Supplier *</label>
              <select name="supplier_id" required value={formData.supplier_id} onChange={handleChange} className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-3 py-2 text-white text-sm">
                <option value="">Please Select</option>
                {options.suppliers.map(s => <option key={s.id} value={s.id}>{s.name} ({s.company || 'Individual'})</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Reference No</label>
              <input type="text" name="reference_no" value={formData.reference_no} onChange={handleChange} className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-3 py-2 text-white text-sm" placeholder="Leave blank to auto-generate" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Purchase Date *</label>
              <input type="date" name="purchase_date" required value={formData.purchase_date} onChange={handleChange} className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-3 py-2 text-white text-sm" />
            </div>
            
            <div>
              <label className="block text-xs text-gray-400 mb-1">Purchase Status *</label>
              <select name="purchase_status" value={formData.purchase_status} onChange={handleChange} className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-3 py-2 text-white text-sm">
                <option value="received">Received</option>
                <option value="pending">Pending</option>
                <option value="ordered">Ordered</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Business Location</label>
              <select name="branch_id" value={formData.branch_id} onChange={handleChange} className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-3 py-2 text-white text-sm">
                <option value="">All Locations</option>
                {options.locations.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Pay Term</label>
              <select name="pay_term" value={formData.pay_term} onChange={handleChange} className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-3 py-2 text-white text-sm">
                <option value="">Please Select</option>
                <option value="Days">Days</option>
                <option value="Months">Months</option>
              </select>
            </div>
            
            <div className="col-span-3 md:col-span-1">
              <label className="block text-xs text-gray-400 mb-1">Attach Document</label>
              <input type="file" onChange={handleFileChange} className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-3 py-[6px] text-white text-sm" />
            </div>
          </div>
        </div>

        {/* Purchase Items */}
        <div className="bg-[#111] border border-[#222] rounded-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-[#00e676]">Purchase Items</h2>
            <button type="button" onClick={addItemRow} className="bg-[#222] hover:bg-[#333] text-[#00e676] px-4 py-2 rounded-lg text-xs font-bold transition-all border border-[#00e676]/30">
              <i className="fas fa-plus mr-2"></i>Add Item
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#1a1a1a] text-gray-400 text-xs uppercase">
                  <th className="p-3 rounded-tl-lg">Product Name</th>
                  <th className="p-3">Purchase Quantity</th>
                  <th className="p-3">Unit Cost</th>
                  <th className="p-3">Line Total</th>
                  <th className="p-3 rounded-tr-lg"></th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center p-6 text-gray-500 text-sm">No items added. Click "Add Item" to start.</td>
                  </tr>
                ) : items.map((item, index) => (
                  <tr key={index} className="border-b border-[#222]">
                    <td className="p-3">
                      <select required value={item.id} onChange={(e) => handleItemChange(index, 'id', e.target.value)} className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-3 py-2 text-white text-sm">
                        <option value="">Select Product...</option>
                        {options.availableItems.map(p => <option key={p.id} value={p.id}>{p.item_name} {p.sku ? `(${p.sku})` : ''}</option>)}
                      </select>
                    </td>
                    <td className="p-3 w-32">
                      <input type="number" step="0.01" min="0.01" required value={item.quantity} onChange={(e) => handleItemChange(index, 'quantity', e.target.value)} className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-3 py-2 text-white text-sm" />
                    </td>
                    <td className="p-3 w-32">
                      <input type="number" step="0.01" min="0" required value={item.cost_price} onChange={(e) => handleItemChange(index, 'cost_price', e.target.value)} className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-3 py-2 text-white text-sm" />
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

        {/* Payment & Totals */}
        <div className="bg-[#111] border border-[#222] rounded-xl p-6">
          <h2 className="text-lg font-semibold text-[#00e676] mb-4">Payment & Totals</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Discount Amount</label>
                <input type="number" step="0.01" name="discount_amount" value={formData.discount_amount} onChange={handleChange} className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-3 py-2 text-white text-sm" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Purchase Tax</label>
                <input type="number" step="0.01" name="tax_amount" value={formData.tax_amount} onChange={handleChange} className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-3 py-2 text-white text-sm" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Additional Shipping Charges</label>
                <input type="number" step="0.01" name="shipping_charges" value={formData.shipping_charges} onChange={handleChange} className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-3 py-2 text-white text-sm" />
              </div>
            </div>

            <div className="bg-[#050505] p-6 rounded-xl border border-[#222] flex flex-col justify-center space-y-3">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[#ff1744]">
                <span>Discount:</span>
                <span>- ${parseFloat(formData.discount_amount || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Tax:</span>
                <span>+ ${parseFloat(formData.tax_amount || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-400 pb-3 border-b border-[#333]">
                <span>Shipping:</span>
                <span>+ ${parseFloat(formData.shipping_charges || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-display text-2xl font-bold text-[#00e676] pt-2">
                <span>Grand Total:</span>
                <span>${grandTotal.toFixed(2)}</span>
              </div>
              
              <div className="pt-4 mt-2">
                <label className="block text-xs text-gray-400 mb-1">Payment Status *</label>
                <select name="payment_status" required value={formData.payment_status} onChange={handleChange} className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-3 py-2 text-white text-sm">
                  <option value="paid">Paid</option>
                  <option value="partial">Partial</option>
                  <option value="unpaid">Unpaid</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button type="button" onClick={() => router.push('/admin/purchases')} className="px-6 py-2 rounded-lg font-semibold text-gray-300 bg-[#222] hover:bg-[#333] transition-colors">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="px-6 py-2 rounded-lg font-bold text-[#0d0d0d] bg-[#00e676] hover:bg-[#00c853] transition-colors shadow-lg shadow-[#00e676]/20">
            {loading ? "Saving..." : "Save Purchase"}
          </button>
        </div>
      </form>
    </div>
  );
}
