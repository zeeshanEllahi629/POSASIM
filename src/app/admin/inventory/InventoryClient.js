"use client";

import { useState } from "react";

export default function InventoryClient({ initialItems = [], initialCategories = [], initialVariations = [], initialLogs = [], error }) {
  const [items, setItems] = useState(initialItems);
  const [variations, setVariations] = useState(initialVariations);
  const [logs, setLogs] = useState(initialLogs);

  const [activeTab, setActiveTab] = useState("stock"); // 'stock', 'alerts', 'history'
  
  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCat, setSelectedCat] = useState("all");
  
  // Modal
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  
  // Adjust Form State
  // adjustmentType: 'set', 'add', 'remove'
  const [adjustmentType, setAdjustmentType] = useState("set");
  const [reason, setReason] = useState("");
  const [variationQtys, setVariationQtys] = useState({});
  
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");

  const handleOpenAdjustModal = (item) => {
    setSelectedItem(item);
    setAdjustmentType("set");
    setReason("");
    setVariationQtys({});
    setFormError("");
    setShowAdjustModal(true);
  };

  const handleAdjustSubmit = async (e) => {
    e.preventDefault();
    if (!selectedItem) return;
    setLoading(true);
    setFormError("");

    try {
      const res = await fetch(`/api/admin/inventory/${selectedItem.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adjustmentType,
          reason,
          variationQtys
        }),
      });

      const data = await res.json();
      if (data.status === 1) {
        // Update local variations and logs
        setVariations(data.updatedVariations || variations);
        if (data.newLog) {
          setLogs([data.newLog, ...logs]);
        }
        setShowAdjustModal(false);
      } else {
        setFormError(data.error || "Failed to adjust stock");
      }
    } catch (err) {
      setFormError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVariationQtyChange = (varId, val) => {
    setVariationQtys((prev) => ({
      ...prev,
      [varId]: val
    }));
  };

  // Process data for display
  const itemsWithStock = items.map((item) => {
    const itemVars = variations.filter((v) => v.item_id === item.id);
    const totalQty = itemVars.reduce((sum, v) => sum + (v.qty || 0), 0);
    const hasLowStock = itemVars.some(v => v.stock_management === 1 && v.qty <= Number(v.low_qty) && v.qty > 0);
    const hasOutOfStock = itemVars.some(v => v.stock_management === 1 && v.qty <= 0);
    const catInfo = initialCategories.find(c => c.id.toString() === item.cat_id?.toString());
    
    return {
      ...item,
      variations: itemVars,
      totalQty,
      hasLowStock,
      hasOutOfStock,
      category_name: catInfo ? catInfo.category_name : "Uncategorized",
    };
  });

  // Filtered lists
  const filteredStock = itemsWithStock.filter((item) => {
    const matchSearch = item.item_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat = selectedCat === "all" || item.cat_id?.toString() === selectedCat;
    return matchSearch && matchCat;
  });

  const lowStockAlerts = itemsWithStock.filter(item => item.hasLowStock || item.hasOutOfStock);

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/30 text-[#ff1744] text-xs">
          {error}
        </div>
      )}

      {/* ========== HEADER CONTROL BAR ========== */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-[#111111]/60 border border-[#222222] p-4 rounded-2xl">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("stock")}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              activeTab === "stock"
                ? "bg-[#00e676]/10 text-[#00e676] border border-[#00e676]/30"
                : "bg-[#1c1c1c] text-gray-400 border border-[#333] hover:text-white"
            }`}
          >
            <i className="fas fa-boxes mr-2"></i>Stock List
          </button>
          <button
            onClick={() => setActiveTab("alerts")}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              activeTab === "alerts"
                ? "bg-orange-500/10 text-orange-500 border border-orange-500/30"
                : "bg-[#1c1c1c] text-gray-400 border border-[#333] hover:text-white"
            }`}
          >
            <i className="fas fa-exclamation-triangle mr-2"></i>Alerts ({lowStockAlerts.length})
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              activeTab === "history"
                ? "bg-[#00e676]/10 text-[#00e676] border border-[#00e676]/30"
                : "bg-[#1c1c1c] text-gray-400 border border-[#333] hover:text-white"
            }`}
          >
            <i className="fas fa-history mr-2"></i>History
          </button>
        </div>

        {activeTab === "stock" && (
          <div className="flex gap-3">
            <select
              value={selectedCat}
              onChange={(e) => setSelectedCat(e.target.value)}
              className="px-4 py-2 bg-[#080808] border border-[#222222] rounded-xl text-white focus:outline-none focus:border-[#00e676]/50 text-sm"
            >
              <option value="all">All Categories</option>
              {initialCategories.map((c) => (
                <option key={c.id} value={c.id.toString()}>{c.category_name}</option>
              ))}
            </select>
            <div className="relative">
              <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"></i>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search items..."
                className="w-full pl-11 pr-4 py-2 bg-[#080808] border border-[#222222] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#00e676]/50 text-sm"
              />
            </div>
          </div>
        )}
      </div>

      {/* ========== TAB: STOCK LIST ========== */}
      {activeTab === "stock" && (
        <div className="bg-[#111]/80 border border-[#222] rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#222] text-[10px] text-gray-500 uppercase font-bold tracking-wider bg-[#0a0a0a]">
                  <th className="py-4 px-6">Item</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6">Total Stock</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1c1c1c] text-xs">
                {filteredStock.map((item) => (
                  <tr key={item.id} className="hover:bg-[#161616]/40 transition-colors group">
                    <td className="py-4 px-6 font-semibold text-gray-200">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#222] border border-[#333] overflow-hidden flex-shrink-0 flex items-center justify-center">
                          {item.image ? (
                            <img src={`/storage/app/public/admin-assets/images/item/${item.image}`} alt={item.item_name} className="w-full h-full object-cover" />
                          ) : (
                            <i className="fas fa-box text-gray-500"></i>
                          )}
                        </div>
                        <div>
                          {item.item_name}
                          <div className="text-[10px] text-gray-500 mt-0.5">{item.variations.length} Variation(s)</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-400">
                      {item.category_name}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-1 rounded bg-[#1c1c1c] border border-[#333] font-mono ${item.totalQty <= 0 ? 'text-[#ff1744]' : 'text-gray-300'}`}>
                        {item.totalQty}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      {item.hasOutOfStock ? (
                        <span className="px-2 py-1 rounded-full bg-red-950/20 border border-red-500/20 text-[#ff1744] text-[10px] font-bold">Out of Stock</span>
                      ) : item.hasLowStock ? (
                        <span className="px-2 py-1 rounded-full bg-orange-950/20 border border-orange-500/20 text-orange-500 text-[10px] font-bold">Low Stock</span>
                      ) : (
                        <span className="px-2 py-1 rounded-full bg-green-950/20 border border-green-500/20 text-[#00e676] text-[10px] font-bold">In Stock</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleOpenAdjustModal(item)}
                        className="px-3 py-1.5 bg-[#00e676]/10 border border-[#00e676]/30 hover:bg-[#00e676]/20 text-[#00e676] rounded-lg transition-all text-xs font-bold"
                      >
                        Adjust Stock
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredStock.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center py-12 text-gray-500">
                      No items found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========== TAB: ALERTS ========== */}
      {activeTab === "alerts" && (
        <div className="bg-[#111]/80 border border-[#222] rounded-2xl overflow-hidden shadow-xl">
           <div className="p-6 border-b border-[#222]">
            <h3 className="text-sm font-bold text-gray-200">Items Requiring Attention</h3>
            <p className="text-xs text-gray-500 mt-1">Showing items that are out of stock or running low based on their threshold.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#222] text-[10px] text-gray-500 uppercase font-bold tracking-wider bg-[#0a0a0a]">
                  <th className="py-4 px-6">Item Name</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6">Alert Type</th>
                  <th className="py-4 px-6">Total Stock</th>
                  <th className="py-4 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1c1c1c] text-xs">
                {lowStockAlerts.map(item => (
                   <tr key={item.id} className="hover:bg-[#161616]/40 transition-colors">
                     <td className="py-4 px-6 font-semibold text-gray-200">{item.item_name}</td>
                     <td className="py-4 px-6 text-gray-400">{item.category_name}</td>
                     <td className="py-4 px-6">
                        {item.hasOutOfStock ? (
                           <span className="text-[#ff1744] font-bold"><i className="fas fa-exclamation-circle mr-1"></i>Out of Stock</span>
                        ) : (
                           <span className="text-orange-500 font-bold"><i className="fas fa-exclamation-triangle mr-1"></i>Low Stock</span>
                        )}
                     </td>
                     <td className="py-4 px-6 font-mono text-gray-300">{item.totalQty}</td>
                     <td className="py-4 px-6 text-right">
                        <button onClick={() => { setActiveTab("stock"); handleOpenAdjustModal(item); }} className="text-[#00e676] hover:underline text-xs">
                          Update
                        </button>
                     </td>
                   </tr>
                ))}
                {lowStockAlerts.length === 0 && (
                   <tr>
                    <td colSpan="5" className="text-center py-12 text-gray-500">
                      No alerts at this time. All stock levels are good!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========== TAB: HISTORY ========== */}
      {activeTab === "history" && (
        <div className="bg-[#111]/80 border border-[#222] rounded-2xl overflow-hidden shadow-xl">
          <div className="p-6 border-b border-[#222]">
            <h3 className="text-sm font-bold text-gray-200">Recent Inventory Activity</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#222] text-[10px] text-gray-500 uppercase font-bold tracking-wider bg-[#0a0a0a]">
                  <th className="py-4 px-6">Date</th>
                  <th className="py-4 px-6">Action</th>
                  <th className="py-4 px-6 w-1/2">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1c1c1c] text-xs">
                {logs.map(log => (
                   <tr key={log.id} className="hover:bg-[#161616]/40 transition-colors">
                     <td className="py-4 px-6 text-gray-400 whitespace-nowrap">
                       {new Date(log.created_at).toLocaleString()}
                     </td>
                     <td className="py-4 px-6 font-semibold text-gray-300">
                       <span className="px-2 py-1 bg-[#1c1c1c] border border-[#333] rounded text-[10px]">
                         {log.action}
                       </span>
                     </td>
                     <td className="py-4 px-6 text-gray-400">
                       {log.description}
                     </td>
                   </tr>
                ))}
                {logs.length === 0 && (
                  <tr>
                    <td colSpan="3" className="text-center py-12 text-gray-500">
                      No activity logs found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========== ADJUST STOCK MODAL ========== */}
      {showAdjustModal && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" onClick={() => setShowAdjustModal(false)}></div>
          <div className="relative bg-[#111111] border border-[#222] rounded-2xl w-full max-w-lg overflow-hidden flex flex-col z-10 max-h-[90vh]">
            <div className="p-5 border-b border-[#222] flex items-center justify-between sticky top-0 bg-[#111] z-20">
              <h3 className="text-base font-bold flex items-center gap-2">
                <i className="fas fa-sliders-h text-[#00e676]"></i> Adjust Stock - {selectedItem.item_name}
              </h3>
              <button onClick={() => setShowAdjustModal(false)} className="text-gray-400 hover:text-white">
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="overflow-y-auto p-6">
              {formError && (
                <div className="mb-4 p-3 rounded-lg bg-red-950/20 border border-red-500/20 text-[#ff1744] text-[11px]">
                  {formError}
                </div>
              )}

              <form id="adjustForm" onSubmit={handleAdjustSubmit} className="space-y-6">
                
                {/* Type Selection */}
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="adjType" value="set" checked={adjustmentType === "set"} onChange={(e)=>setAdjustmentType(e.target.value)} className="accent-[#00e676] bg-[#222] border-[#444]" />
                    <span className="text-sm text-gray-300">Set</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="adjType" value="add" checked={adjustmentType === "add"} onChange={(e)=>setAdjustmentType(e.target.value)} className="accent-[#00e676] bg-[#222] border-[#444]" />
                    <span className="text-sm text-gray-300">Add</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="adjType" value="remove" checked={adjustmentType === "remove"} onChange={(e)=>setAdjustmentType(e.target.value)} className="accent-[#00e676] bg-[#222] border-[#444]" />
                    <span className="text-sm text-gray-300">Remove</span>
                  </label>
                </div>

                {/* Variations Loop */}
                <div className="space-y-3">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Variations Stock
                  </label>
                  {selectedItem.variations.map(variation => (
                    <div key={variation.id} className="flex items-center justify-between p-3 bg-[#050505] border border-[#222] rounded-xl">
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-200">{variation.name || "Default Variation"}</span>
                        <span className="text-[10px] text-gray-500">Current Qty: <strong className="text-gray-300">{variation.qty}</strong></span>
                      </div>
                      <div className="w-32">
                        <input
                          type="number"
                          placeholder="0"
                          min="0"
                          value={variationQtys[variation.id] || ""}
                          onChange={(e) => handleVariationQtyChange(variation.id, e.target.value)}
                          className="w-full px-3 py-2 bg-[#111] border border-[#333] rounded-lg text-white focus:border-[#00e676]/50 text-sm"
                        />
                      </div>
                    </div>
                  ))}
                  {selectedItem.variations.length === 0 && (
                    <div className="text-sm text-gray-500 py-2">No variations found for this item. Ensure stock management is enabled.</div>
                  )}
                </div>

                {/* Reason Input */}
                <div className="form-group">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Reason / Notes (Optional)
                  </label>
                  <input
                    type="text"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="e.g. Damage, Restock, Count correction"
                    className="w-full px-4 py-2.5 bg-[#050505] border border-[#222] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#00e676]/50 text-sm"
                  />
                </div>
              </form>
            </div>

            <div className="p-5 flex gap-3 border-t border-[#222] bg-[#111] sticky bottom-0">
              <button
                type="button"
                onClick={() => setShowAdjustModal(false)}
                className="flex-1 py-2.5 bg-[#1c1c1c] hover:bg-[#222] rounded-xl border border-[#222] text-xs font-bold transition-all text-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="adjustForm"
                disabled={loading || selectedItem.variations.length === 0}
                className="flex-1 py-2.5 bg-[#00e676] text-[#0d0d0d] hover:bg-[#00c853] rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? <i className="fas fa-spinner fa-spin"></i> : "Save Adjustment"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
