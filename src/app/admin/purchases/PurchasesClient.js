"use client";

import { useState } from "react";

export default function PurchasesClient({ initialPurchases, suppliers, items, error }) {
  const [purchases, setPurchases] = useState(initialPurchases);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  
  // Status Edit Modal
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusToUpdate, setStatusToUpdate] = useState("unpaid");

  // Form inputs
  const [supplierId, setSupplierId] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("unpaid");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [taxAmount, setTaxAmount] = useState(0);
  const [notes, setNotes] = useState("");
  
  // Dynamic items list
  const [purchaseItems, setPurchaseItems] = useState([{ product_id: "", quantity: 1, cost_price: 0 }]);

  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");

  const handleOpenAddModal = () => {
    setSupplierId("");
    setPaymentStatus("unpaid");
    setPaymentMethod("");
    setDiscountAmount(0);
    setTaxAmount(0);
    setNotes("");
    setPurchaseItems([{ product_id: "", quantity: 1, cost_price: 0 }]);
    setFormError("");
    setShowAddModal(true);
  };

  const handleOpenViewModal = (purchase) => {
    setSelectedPurchase(purchase);
    setShowViewModal(true);
  };

  const handleOpenStatusModal = (purchase) => {
    setSelectedPurchase(purchase);
    setStatusToUpdate(purchase.payment_status);
    setShowStatusModal(true);
  };

  const addItemRow = () => {
    setPurchaseItems([...purchaseItems, { product_id: "", quantity: 1, cost_price: 0 }]);
  };

  const removeItemRow = (index) => {
    const newItems = [...purchaseItems];
    newItems.splice(index, 1);
    setPurchaseItems(newItems);
  };

  const updateItemRow = (index, field, value) => {
    const newItems = [...purchaseItems];
    newItems[index][field] = value;
    setPurchaseItems(newItems);
  };

  const calculateTotal = () => {
    const itemsTotal = purchaseItems.reduce((acc, item) => {
      return acc + (Number(item.quantity) * Number(item.cost_price));
    }, 0);
    return itemsTotal - Number(discountAmount) + Number(taxAmount);
  };

  // Add Purchase Handler
  const handleAddPurchase = async (e) => {
    e.preventDefault();
    if (!supplierId) {
      setFormError("Please select a supplier");
      return;
    }
    
    // Validate items
    const validItems = purchaseItems.filter(item => item.product_id && Number(item.quantity) > 0 && Number(item.cost_price) >= 0);
    if (validItems.length === 0) {
      setFormError("Please add at least one valid item");
      return;
    }

    setLoading(true);
    setFormError("");

    try {
      const res = await fetch("/api/admin/purchases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          supplier_id: supplierId,
          payment_status: paymentStatus,
          payment_method: paymentMethod,
          discount_amount: discountAmount,
          tax_amount: taxAmount,
          notes: notes,
          items: validItems
        }),
      });

      const data = await res.json();
      if (data.status === 1) {
        setPurchases([data.purchase, ...purchases]);
        setShowAddModal(false);
      } else {
        setFormError(data.error || "Failed to add purchase order");
      }
    } catch (err) {
      setFormError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Edit Status Handler
  const handleEditStatus = async (e) => {
    e.preventDefault();
    if (!selectedPurchase) return;
    setLoading(true);
    setFormError("");

    try {
      const res = await fetch(`/api/admin/purchases/${selectedPurchase.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          payment_status: statusToUpdate,
        }),
      });

      const data = await res.json();
      if (data.status === 1) {
        setPurchases(
          purchases.map((p) => (p.id === selectedPurchase.id ? data.purchase : p))
        );
        setShowStatusModal(false);
      } else {
        setFormError(data.error || "Failed to update status");
      }
    } catch (err) {
      setFormError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Filter list
  const filtered = purchases.filter((p) =>
    (p.reference_no?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
    (p.suppliers?.name?.toLowerCase() || "").includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/30 text-[#ff1744] text-xs">
          {error}
        </div>
      )}

      {/* ========== HEADER CONTROL BAR ========== */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-[#111111]/60 border border-[#222222] p-4 rounded-2xl">
        <div className="relative flex-1 max-w-md">
          <i className="fas fa-search absolute left-4.5 top-1/2 -translate-y-1/2 text-gray-500"></i>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by reference or supplier..."
            className="w-full pl-11 pr-4 py-2.5 bg-[#080808] border border-[#222222] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#00e676]/50 focus:ring-1 focus:ring-[#00e676]/30 transition-all text-sm"
          />
        </div>
        <button
          onClick={handleOpenAddModal}
          className="bg-[#00e676] text-[#0d0d0d] hover:bg-[#00c853] py-2.5 px-5 rounded-xl font-bold text-sm tracking-wide transition-all shadow-lg shadow-[#00e676]/10 flex items-center justify-center gap-2"
        >
          <i className="fas fa-plus"></i> Add Purchase
        </button>
      </div>

      {/* ========== PURCHASES LIST TABLE ========== */}
      <div className="bg-[#111]/80 border border-[#222] rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#222] text-[10px] text-gray-500 uppercase font-bold tracking-wider bg-[#0a0a0a]">
                <th className="py-4 px-6">Reference No</th>
                <th className="py-4 px-6">Supplier</th>
                <th className="py-4 px-6">Grand Total</th>
                <th className="py-4 px-6">Payment Status</th>
                <th className="py-4 px-6">Date</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1c1c1c] text-xs">
              {filtered.map((purchase) => (
                <tr key={purchase.id} className="hover:bg-[#161616]/40 transition-colors group">
                  <td className="py-4 px-6 font-semibold text-[#00e676]">
                    {purchase.reference_no}
                  </td>
                  <td className="py-4 px-6 text-gray-200">
                    {purchase.suppliers?.name || "N/A"}
                  </td>
                  <td className="py-4 px-6 font-mono text-gray-200">
                    ${Number(purchase.grand_total).toFixed(2)}
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`px-3 py-1 rounded-full border text-[10px] font-bold transition-all ${
                        purchase.payment_status === "paid"
                          ? "bg-green-950/20 border-green-500/20 text-[#00e676]"
                          : purchase.payment_status === "partial"
                          ? "bg-yellow-950/20 border-yellow-500/20 text-yellow-500"
                          : "bg-red-950/20 border-red-500/20 text-[#ff1744]"
                      }`}
                    >
                      {purchase.payment_status?.toUpperCase() || "UNPAID"}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-gray-500">
                    {new Date(purchase.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-6 text-right space-x-2">
                    <button
                      onClick={() => handleOpenStatusModal(purchase)}
                      className="px-2.5 py-1.5 bg-[#1c1c1c] border border-[#333] hover:border-gray-500 rounded-lg text-gray-300 hover:text-white transition-all"
                      title="Update Payment Status"
                    >
                      <i className="fas fa-credit-card"></i> Status
                    </button>
                    <button
                      onClick={() => handleOpenViewModal(purchase)}
                      className="px-2.5 py-1.5 bg-[#1c1c1c] border border-[#333] hover:border-[#00e676]/50 rounded-lg text-gray-300 hover:text-[#00e676] transition-all"
                    >
                      <i className="fas fa-eye"></i> View
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-gray-500">
                    No purchase orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========== ADD MODAL ========== */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" onClick={() => setShowAddModal(false)}></div>
          <div className="relative bg-[#111111] border border-[#222] rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col z-10">
            <div className="p-5 border-b border-[#222] flex items-center justify-between">
              <h3 className="text-base font-bold flex items-center gap-2">
                <i className="fas fa-file-invoice-dollar text-[#00e676]"></i> Create Purchase Order
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-white">
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="overflow-y-auto p-6">
              {formError && (
                <div className="mb-4 p-3 rounded-lg bg-red-950/20 border border-red-500/20 text-[#ff1744] text-[11px]">
                  {formError}
                </div>
              )}

              <form id="add-purchase-form" onSubmit={handleAddPurchase} className="space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                      Supplier *
                    </label>
                    <select
                      required
                      value={supplierId}
                      onChange={(e) => setSupplierId(e.target.value)}
                      className="w-full px-4 py-2.5 bg-[#050505] border border-[#222] rounded-xl text-white focus:outline-none focus:border-[#00e676]/50 text-sm"
                    >
                      <option value="">Select Supplier</option>
                      {suppliers.map(s => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                      Payment Status *
                    </label>
                    <select
                      required
                      value={paymentStatus}
                      onChange={(e) => setPaymentStatus(e.target.value)}
                      className="w-full px-4 py-2.5 bg-[#050505] border border-[#222] rounded-xl text-white focus:outline-none focus:border-[#00e676]/50 text-sm"
                    >
                      <option value="unpaid">Unpaid</option>
                      <option value="partial">Partial</option>
                      <option value="paid">Paid</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                      Payment Method
                    </label>
                    <input
                      type="text"
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      placeholder="e.g. Cash, Bank Transfer"
                      className="w-full px-4 py-2.5 bg-[#050505] border border-[#222] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#00e676]/50 text-sm"
                    />
                  </div>

                  <div className="form-group">
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                      Notes
                    </label>
                    <input
                      type="text"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Any additional notes..."
                      className="w-full px-4 py-2.5 bg-[#050505] border border-[#222] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#00e676]/50 text-sm"
                    />
                  </div>
                </div>

                {/* Items Section */}
                <div className="border border-[#222] rounded-xl p-4 bg-[#080808]">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-sm font-bold text-gray-300">Purchase Items</h4>
                    <button
                      type="button"
                      onClick={addItemRow}
                      className="text-[#00e676] hover:text-[#00c853] text-xs font-bold bg-[#00e676]/10 px-3 py-1.5 rounded-lg"
                    >
                      + Add Row
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {purchaseItems.map((item, index) => (
                      <div key={index} className="flex gap-3 items-end">
                        <div className="flex-1">
                          <label className="block text-[10px] text-gray-500 mb-1">Product</label>
                          <select
                            required
                            value={item.product_id}
                            onChange={(e) => updateItemRow(index, 'product_id', e.target.value)}
                            className="w-full px-3 py-2 bg-[#050505] border border-[#222] rounded-lg text-white text-xs focus:border-[#00e676]/50"
                          >
                            <option value="">Select Product</option>
                            {items.map(product => (
                              <option key={product.id} value={product.id}>{product.item_name}</option>
                            ))}
                          </select>
                        </div>
                        <div className="w-24">
                          <label className="block text-[10px] text-gray-500 mb-1">Quantity</label>
                          <input
                            type="number"
                            required
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updateItemRow(index, 'quantity', e.target.value)}
                            className="w-full px-3 py-2 bg-[#050505] border border-[#222] rounded-lg text-white text-xs"
                          />
                        </div>
                        <div className="w-32">
                          <label className="block text-[10px] text-gray-500 mb-1">Unit Cost ($)</label>
                          <input
                            type="number"
                            required
                            min="0"
                            step="0.01"
                            value={item.cost_price}
                            onChange={(e) => updateItemRow(index, 'cost_price', e.target.value)}
                            className="w-full px-3 py-2 bg-[#050505] border border-[#222] rounded-lg text-white text-xs"
                          />
                        </div>
                        <div className="w-32">
                          <label className="block text-[10px] text-gray-500 mb-1">Line Total</label>
                          <div className="px-3 py-2 bg-[#111] border border-[#222] rounded-lg text-gray-400 text-xs text-right">
                            ${(Number(item.quantity) * Number(item.cost_price)).toFixed(2)}
                          </div>
                        </div>
                        {purchaseItems.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeItemRow(index)}
                            className="w-8 h-8 flex items-center justify-center bg-red-950/20 text-[#ff1744] rounded-lg hover:bg-red-950/40"
                          >
                            <i className="fas fa-trash text-xs"></i>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Summary Section */}
                <div className="flex justify-end">
                  <div className="w-64 space-y-3 p-4 bg-[#080808] border border-[#222] rounded-xl text-sm">
                    <div className="flex justify-between items-center text-gray-400">
                      <span>Subtotal:</span>
                      <span>${purchaseItems.reduce((acc, item) => acc + (Number(item.quantity) * Number(item.cost_price)), 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-gray-400">
                      <span>Discount:</span>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={discountAmount}
                        onChange={(e) => setDiscountAmount(e.target.value)}
                        className="w-20 px-2 py-1 bg-[#050505] border border-[#222] rounded text-right text-white text-xs"
                      />
                    </div>
                    <div className="flex justify-between items-center text-gray-400">
                      <span>Tax:</span>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={taxAmount}
                        onChange={(e) => setTaxAmount(e.target.value)}
                        className="w-20 px-2 py-1 bg-[#050505] border border-[#222] rounded text-right text-white text-xs"
                      />
                    </div>
                    <div className="pt-2 border-t border-[#333] flex justify-between items-center font-bold text-white text-base">
                      <span>Grand Total:</span>
                      <span className="text-[#00e676]">${calculateTotal().toFixed(2)}</span>
                    </div>
                  </div>
                </div>

              </form>
            </div>

            <div className="p-4 flex gap-3 border-t border-[#222] bg-[#0a0a0a]">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-2.5 bg-[#1c1c1c] hover:bg-[#222] rounded-xl border border-[#222] text-xs font-bold transition-all text-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="add-purchase-form"
                disabled={loading}
                className="flex-1 py-2.5 bg-[#00e676] text-[#0d0d0d] hover:bg-[#00c853] rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
              >
                {loading ? <i className="fas fa-spinner fa-spin"></i> : "Create Purchase Order"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========== VIEW MODAL ========== */}
      {showViewModal && selectedPurchase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" onClick={() => setShowViewModal(false)}></div>
          <div className="relative bg-[#111111] border border-[#222] rounded-2xl w-full max-w-2xl overflow-hidden flex flex-col z-10">
            <div className="p-5 border-b border-[#222] flex items-center justify-between">
              <h3 className="text-base font-bold flex items-center gap-2">
                <i className="fas fa-eye text-[#00e676]"></i> Purchase Details: {selectedPurchase.reference_no}
              </h3>
              <button onClick={() => setShowViewModal(false)} className="text-gray-400 hover:text-white">
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[80vh] space-y-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500 text-[10px] uppercase font-bold tracking-wider mb-1">Supplier</p>
                  <p className="text-white">{selectedPurchase.suppliers?.name || "N/A"}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-[10px] uppercase font-bold tracking-wider mb-1">Date</p>
                  <p className="text-white">{new Date(selectedPurchase.created_at).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-[10px] uppercase font-bold tracking-wider mb-1">Payment Status</p>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    selectedPurchase.payment_status === "paid" ? "bg-green-950/40 text-[#00e676]" :
                    selectedPurchase.payment_status === "partial" ? "bg-yellow-950/40 text-yellow-500" :
                    "bg-red-950/40 text-[#ff1744]"
                  }`}>
                    {selectedPurchase.payment_status?.toUpperCase() || "UNPAID"}
                  </span>
                </div>
                <div>
                  <p className="text-gray-500 text-[10px] uppercase font-bold tracking-wider mb-1">Payment Method</p>
                  <p className="text-white">{selectedPurchase.payment_method || "N/A"}</p>
                </div>
                {selectedPurchase.notes && (
                  <div className="col-span-2">
                    <p className="text-gray-500 text-[10px] uppercase font-bold tracking-wider mb-1">Notes</p>
                    <p className="text-gray-300 bg-[#1c1c1c] p-3 rounded-lg text-xs">{selectedPurchase.notes}</p>
                  </div>
                )}
              </div>

              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Items</h4>
                <div className="border border-[#222] rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#0a0a0a] text-gray-500">
                      <tr>
                        <th className="py-2 px-4">Item ID</th>
                        <th className="py-2 px-4 text-center">Qty</th>
                        <th className="py-2 px-4 text-right">Cost</th>
                        <th className="py-2 px-4 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#222]">
                      {selectedPurchase.purchase_items?.map((pi) => (
                        <tr key={pi.id} className="bg-[#111]">
                          <td className="py-2 px-4 text-gray-300 font-mono">{pi.product_id?.toString()}</td>
                          <td className="py-2 px-4 text-center text-gray-300">{Number(pi.quantity)}</td>
                          <td className="py-2 px-4 text-right text-gray-400">${Number(pi.cost_price).toFixed(2)}</td>
                          <td className="py-2 px-4 text-right text-white font-mono">${Number(pi.total).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex justify-end">
                <div className="w-48 text-xs space-y-2">
                  <div className="flex justify-between text-gray-400">
                    <span>Subtotal:</span>
                    <span>${Number(selectedPurchase.total_amount).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Discount:</span>
                    <span>-${Number(selectedPurchase.discount_amount).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Tax:</span>
                    <span>+${Number(selectedPurchase.tax_amount).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-base text-[#00e676] pt-2 border-t border-[#333]">
                    <span>Grand Total:</span>
                    <span>${Number(selectedPurchase.grand_total).toFixed(2)}</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ========== EDIT STATUS MODAL ========== */}
      {showStatusModal && selectedPurchase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" onClick={() => setShowStatusModal(false)}></div>
          <div className="relative bg-[#111111] border border-[#222] rounded-2xl w-full max-w-sm overflow-hidden flex flex-col z-10">
            <div className="p-5 border-b border-[#222] flex items-center justify-between">
              <h3 className="text-base font-bold flex items-center gap-2">
                <i className="fas fa-edit text-[#00e676]"></i> Update Status
              </h3>
              <button onClick={() => setShowStatusModal(false)} className="text-gray-400 hover:text-white">
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            {formError && (
              <div className="mx-6 mt-4 p-3 rounded-lg bg-red-950/20 border border-red-500/20 text-[#ff1744] text-[11px]">
                {formError}
              </div>
            )}

            <form onSubmit={handleEditStatus} className="p-6 space-y-4">
              <div className="form-group">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Payment Status
                </label>
                <select
                  required
                  value={statusToUpdate}
                  onChange={(e) => setStatusToUpdate(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#050505] border border-[#222] rounded-xl text-white focus:outline-none focus:border-[#00e676]/50 text-sm"
                >
                  <option value="unpaid">Unpaid</option>
                  <option value="partial">Partial</option>
                  <option value="paid">Paid</option>
                </select>
              </div>

              <div className="pt-4 flex gap-3 border-t border-[#222] mt-6">
                <button
                  type="button"
                  onClick={() => setShowStatusModal(false)}
                  className="flex-1 py-2.5 bg-[#1c1c1c] hover:bg-[#222] rounded-xl border border-[#222] text-xs font-bold transition-all text-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2.5 bg-[#00e676] text-[#0d0d0d] hover:bg-[#00c853] rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
                >
                  {loading ? <i className="fas fa-spinner fa-spin"></i> : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
