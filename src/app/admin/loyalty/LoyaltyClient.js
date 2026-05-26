"use client";

import { useState } from "react";

export default function LoyaltyClient({ initialCustomers, error }) {
  const [customers, setCustomers] = useState(initialCustomers);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Modal state
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [pointsAmount, setPointsAmount] = useState("");
  const [actionType, setActionType] = useState("add"); // "add" or "deduct"
  
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");

  const handleOpenModal = (customer) => {
    setSelectedCustomer(customer);
    setPointsAmount("");
    setActionType("add");
    setFormError("");
    setShowAdjustModal(true);
  };

  const handleAdjustPoints = async (e) => {
    e.preventDefault();
    if (!pointsAmount || isNaN(pointsAmount) || !selectedCustomer) return;
    
    setLoading(true);
    setFormError("");

    try {
      const res = await fetch(`/api/admin/loyalty/${selectedCustomer.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          points: parseInt(pointsAmount, 10),
          action: actionType,
        }),
      });

      const data = await res.json();
      if (data.status === 1) {
        setCustomers(
          customers.map((c) => (c.id === selectedCustomer.id ? data.customer : c))
        );
        setShowAdjustModal(false);
      } else {
        setFormError(data.error || "Failed to adjust points");
      }
    } catch (err) {
      setFormError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const filtered = customers.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTierColor = (tier) => {
    switch (tier) {
      case "Platinum": return "text-cyan-400 bg-cyan-950/30 border-cyan-500/30";
      case "Gold": return "text-yellow-400 bg-yellow-950/30 border-yellow-500/30";
      case "Silver": return "text-gray-300 bg-gray-800/50 border-gray-500/30";
      case "Bronze": return "text-amber-600 bg-amber-950/30 border-amber-700/30";
      default: return "text-gray-400 bg-gray-900 border-gray-700";
    }
  };

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
            placeholder="Search customers by name or email..."
            className="w-full pl-11 pr-4 py-2.5 bg-[#080808] border border-[#222222] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#00e676]/50 focus:ring-1 focus:ring-[#00e676]/30 transition-all text-sm"
          />
        </div>
      </div>

      {/* ========== LOYALTY LIST TABLE ========== */}
      <div className="bg-[#111]/80 border border-[#222] rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#222] text-[10px] text-gray-500 uppercase font-bold tracking-wider bg-[#0a0a0a]">
                <th className="py-4 px-6">Customer</th>
                <th className="py-4 px-6">Contact Info</th>
                <th className="py-4 px-6 text-center">Loyalty Points</th>
                <th className="py-4 px-6 text-center">Tier</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1c1c1c] text-xs">
              {filtered.map((customer) => (
                <tr key={customer.id} className="hover:bg-[#161616]/40 transition-colors group">
                  <td className="py-4 px-6 font-semibold text-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#222] flex items-center justify-center text-gray-400 font-bold">
                        {customer.name.charAt(0).toUpperCase()}
                      </div>
                      {customer.name}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-gray-400 space-y-1">
                    <div><i className="fas fa-envelope mr-1"></i> {customer.email}</div>
                    {customer.mobile && <div><i className="fas fa-phone mr-1"></i> {customer.mobile}</div>}
                  </td>
                  <td className="py-4 px-6 text-center font-mono text-lg text-[#00e676]">
                    {customer.loyalty_points}
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className={`px-3 py-1 rounded-full border text-[10px] font-bold ${getTierColor(customer.loyalty_tier)}`}>
                      {customer.loyalty_tier}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => handleOpenModal(customer)}
                      className="px-3 py-1.5 bg-[#1c1c1c] border border-[#333] hover:border-[#00e676]/50 rounded-lg text-gray-300 hover:text-white transition-all shadow-sm"
                    >
                      <i className="fas fa-coins mr-1"></i> Adjust Points
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-12 text-gray-500">
                    No customers found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========== ADJUST POINTS MODAL ========== */}
      {showAdjustModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" onClick={() => setShowAdjustModal(false)}></div>
          <div className="relative bg-[#111111] border border-[#222] rounded-2xl w-full max-w-md overflow-hidden flex flex-col z-10">
            <div className="p-5 border-b border-[#222] flex items-center justify-between">
              <h3 className="text-base font-bold flex items-center gap-2">
                <i className="fas fa-coins text-[#00e676]"></i> Adjust Points
              </h3>
              <button onClick={() => setShowAdjustModal(false)} className="text-gray-400 hover:text-white">
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="px-6 pt-4 text-sm text-gray-300">
              Customer: <span className="font-bold text-white">{selectedCustomer?.name}</span> <br/>
              Current Points: <span className="font-mono text-[#00e676] font-bold">{selectedCustomer?.loyalty_points}</span>
            </div>

            {formError && (
              <div className="mx-6 mt-4 p-3 rounded-lg bg-red-950/20 border border-red-500/20 text-[#ff1744] text-[11px]">
                {formError}
              </div>
            )}

            <form onSubmit={handleAdjustPoints} className="p-6 space-y-4">
              <div className="flex gap-4">
                <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${
                  actionType === "add" 
                    ? "bg-[#00e676]/10 border-[#00e676] text-[#00e676]" 
                    : "bg-[#111] border-[#333] text-gray-400 hover:bg-[#1a1a1a]"
                }`}>
                  <input 
                    type="radio" 
                    name="actionType" 
                    value="add" 
                    checked={actionType === "add"} 
                    onChange={() => setActionType("add")} 
                    className="hidden" 
                  />
                  <i className="fas fa-plus-circle"></i> Add
                </label>
                <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${
                  actionType === "deduct" 
                    ? "bg-[#ff1744]/10 border-[#ff1744] text-[#ff1744]" 
                    : "bg-[#111] border-[#333] text-gray-400 hover:bg-[#1a1a1a]"
                }`}>
                  <input 
                    type="radio" 
                    name="actionType" 
                    value="deduct" 
                    checked={actionType === "deduct"} 
                    onChange={() => setActionType("deduct")} 
                    className="hidden" 
                  />
                  <i className="fas fa-minus-circle"></i> Deduct
                </label>
              </div>

              <div className="form-group">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Points Amount
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={pointsAmount}
                  onChange={(e) => setPointsAmount(e.target.value)}
                  placeholder="e.g. 500"
                  className="w-full px-4 py-2.5 bg-[#050505] border border-[#222] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#00e676]/50 text-sm font-mono"
                />
              </div>

              <div className="pt-4 flex gap-3 border-t border-[#222] mt-6">
                <button
                  type="button"
                  onClick={() => setShowAdjustModal(false)}
                  className="flex-1 py-2.5 bg-[#1c1c1c] hover:bg-[#222] rounded-xl border border-[#222] text-xs font-bold transition-all text-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2.5 bg-[#00e676] text-[#0d0d0d] hover:bg-[#00c853] rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
                >
                  {loading ? <i className="fas fa-spinner fa-spin"></i> : "Confirm"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
