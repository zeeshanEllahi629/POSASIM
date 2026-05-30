"use client";

import { useState } from "react";
import Link from "next/link";

export default function OrdersClient({ initialOrders, error }) {
  const [orders, setOrders] = useState(initialOrders);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  
  // Detail modal state
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);
  const [orderDetailsItems, setOrderDetailsItems] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // Status mapping
  const orderStatuses = [
    { value: "1", label: "Pending", class: "bg-yellow-950/20 border-yellow-500/20 text-yellow-400" },
    { value: "2", label: "Preparing", class: "bg-blue-950/20 border-blue-500/20 text-blue-400" },
    { value: "3", label: "Ready", class: "bg-indigo-950/20 border-indigo-500/20 text-indigo-400" },
    { value: "4", label: "Delivered", class: "bg-green-950/20 border-green-500/20 text-green-400" },
    { value: "5", label: "Cancelled", class: "bg-red-950/20 border-red-500/20 text-[#ff1744]" },
    { value: "6", label: "Failed", class: "bg-red-950/20 border-red-500/20 text-[#ff1744]" },
  ];

  const paymentStatuses = [
    { value: 1, label: "Unpaid", class: "bg-red-950/20 border-red-500/20 text-[#ff1744]" },
    { value: 2, label: "Paid", class: "bg-green-950/20 border-green-500/20 text-[#00e676]" },
    { value: 3, label: "Partial", class: "bg-yellow-950/20 border-yellow-500/20 text-yellow-500" },
  ];

  // Update order status/payment
  const handleUpdateField = async (orderId, field, value) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: value }),
      });

      const data = await res.json();
      if (data.status === 1) {
        setOrders(
          orders.map((o) => (o.id.toString() === orderId.toString() ? data.order : o))
        );
        // Also update details modal if open
        if (selectedOrderDetails && selectedOrderDetails.id.toString() === orderId.toString()) {
          setSelectedOrderDetails(data.order);
        }
      } else {
        alert(data.error || "Failed to update order");
      }
    } catch (err) {
      alert("Connection error");
    }
  };

  // View details handler
  const handleViewDetails = async (order) => {
    setSelectedOrderDetails(order);
    setOrderDetailsItems([]);
    setLoadingDetails(true);
    try {
      // Fetch details items
      const res = await fetch(`/api/pos/receipt/${order.id}`);
      const data = await res.json();
      if (data.status === 1) {
        setOrderDetailsItems(data.order_details || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingDetails(false);
    }
  };

  // Format date helper
  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Filter logic
  const filtered = orders.filter((o) => {
    const matchesSearch =
      o.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (o.name && o.name.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = statusFilter === "all" || o.status.toString() === statusFilter.toString();
    
    const matchesType =
      typeFilter === "all" ||
      (typeFilter === "pos" && o.is_pos_order === 1) ||
      (typeFilter === "online" && o.is_pos_order !== 1);

    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/30 text-[#ff1744] text-xs">
          {error}
        </div>
      )}

      {/* ========== HEADER CONTROL BAR ========== */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-[#111111]/60 border border-[#222222] p-4 rounded-2xl">
        <div className="grid grid-cols-1 sm:grid-cols-3 flex-1 gap-3 max-w-4xl">
          {/* Search bar */}
          <div className="relative">
            <i className="fas fa-search absolute left-4.5 top-1/2 -translate-y-1/2 text-gray-500"></i>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by order # or name..."
              className="w-full pl-11 pr-4 py-2.5 bg-[#080808] border border-[#222222] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#00e676]/50 focus:ring-1 focus:ring-[#00e676]/30 transition-all text-sm"
            />
          </div>

          {/* Type selector */}
          <div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#080808] border border-[#222222] rounded-xl text-white focus:outline-none focus:border-[#00e676]/50 text-sm"
            >
              <option value="all">All Channels</option>
              <option value="pos">POS Terminals</option>
              <option value="online">Online / Website</option>
            </select>
          </div>

          {/* Status selector */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#080808] border border-[#222222] rounded-xl text-white focus:outline-none focus:border-[#00e676]/50 text-sm"
            >
              <option value="all">All Statuses</option>
              {orderStatuses.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ========== ORDERS TABLE ========== */}
      <div className="bg-[#111]/80 border border-[#222] rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#222] text-[10px] text-gray-500 uppercase font-bold tracking-wider bg-[#0a0a0a]">
                <th className="py-4 px-6">Order Number</th>
                <th className="py-4 px-6">Date</th>
                <th className="py-4 px-6">Customer Name</th>
                <th className="py-4 px-6">Channel</th>
                <th className="py-4 px-6">Total Amount</th>
                <th className="py-4 px-6">Payment</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1c1c1c] text-xs">
              {filtered.map((ord) => {
                const currentStatus = orderStatuses.find((s) => s.value === ord.status) || {
                  label: "Unknown",
                  class: "bg-zinc-800 border-zinc-700 text-zinc-300",
                };
                const currentPayment = paymentStatuses.find((p) => p.value === ord.payment_status) || {
                  label: "Unknown",
                  class: "bg-zinc-800 border-zinc-700 text-zinc-300",
                };

                return (
                  <tr key={ord.id} className="hover:bg-[#161616]/40 transition-colors group">
                    <td className="py-4 px-6 font-mono font-bold text-gray-200">
                      {ord.order_number}
                    </td>
                    <td className="py-4 px-6 text-gray-400">
                      {formatDate(ord.created_at)}
                    </td>
                    <td className="py-4 px-6 text-gray-300 font-semibold">
                      {ord.name || <span className="text-gray-500 italic">Walk-in Customer</span>}
                    </td>
                    <td className="py-4 px-6 text-gray-400">
                      {ord.is_pos_order === 1 ? (
                        <span className="text-xs bg-[#00e676]/10 text-[#00e676] px-2 py-0.5 rounded border border-[#00e676]/10 font-bold">
                          POS
                        </span>
                      ) : (
                        <span className="text-xs bg-cyan-950/20 text-cyan-400 px-2 py-0.5 rounded border border-cyan-500/20 font-bold">
                          Online
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 font-bold text-[#00e676]">
                      ${parseFloat(ord.grand_total || 0).toFixed(2)}
                    </td>
                    <td className="py-4 px-6">
                      <select
                        value={ord.payment_status}
                        onChange={(e) => handleUpdateField(ord.id, "payment_status", Number(e.target.value))}
                        className={`px-2 py-1 rounded-lg border text-[10px] font-bold focus:outline-none ${currentPayment.class}`}
                      >
                        {paymentStatuses.map((p) => (
                          <option key={p.value} value={p.value} className="bg-[#111] text-white">
                            {p.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-4 px-6">
                      <select
                        value={ord.status}
                        onChange={(e) => handleUpdateField(ord.id, "status", e.target.value)}
                        className={`px-2 py-1 rounded-lg border text-[10px] font-bold focus:outline-none ${currentStatus.class}`}
                      >
                        {orderStatuses.map((s) => (
                          <option key={s.value} value={s.value} className="bg-[#111] text-white">
                            {s.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <button
                        onClick={() => handleViewDetails(ord)}
                        className="px-2.5 py-1.5 bg-[#1c1c1c] border border-[#333] hover:border-gray-500 rounded-lg text-gray-300 hover:text-white transition-all"
                      >
                        <i className="fas fa-eye"></i> Details
                      </button>
                      <Link
                        href={`/admin/pos/receipt/${ord.id}`}
                        target="_blank"
                        className="px-2.5 py-1.5 bg-[#1c1c1c] border border-[#333] hover:border-gray-500 rounded-lg text-gray-300 hover:text-white transition-all inline-block"
                      >
                        <i className="fas fa-print"></i> Print
                      </Link>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="8" className="text-center py-12 text-gray-500">
                    No orders found matching filters
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========== DETAILS MODAL ========== */}
      {selectedOrderDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" onClick={() => setSelectedOrderDetails(null)}></div>
          <div className="relative bg-[#111111] border border-[#222] rounded-2xl w-full max-w-2xl overflow-hidden flex flex-col z-10">
            {/* Header */}
            <div className="p-5 border-b border-[#222] flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold flex items-center gap-2">
                  <i className="fas fa-receipt text-[#00e676]"></i> Order: {selectedOrderDetails.order_number}
                </h3>
                <p className="text-[10px] text-gray-500 mt-0.5">Placed on {formatDate(selectedOrderDetails.created_at)}</p>
              </div>
              <button onClick={() => setSelectedOrderDetails(null)} className="text-gray-400 hover:text-white">
                <i className="fas fa-times"></i>
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6 overflow-y-auto max-h-[65vh]">
              {/* Customer and billing summary */}
              <div className="grid grid-cols-2 gap-4 bg-[#0a0a0a] p-4 rounded-xl border border-[#222]">
                <div>
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Customer Details</span>
                  <div className="text-sm font-semibold text-gray-200 mt-1">{selectedOrderDetails.name || "Walk-in Customer"}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{selectedOrderDetails.email || "No email"}</div>
                  <div className="text-xs text-gray-400">{selectedOrderDetails.mobile ? selectedOrderDetails.mobile.toString() : ""}</div>
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Order Metadata</span>
                  <div className="text-xs text-gray-300 mt-1">Payment Method: <span className="font-bold">{selectedOrderDetails.transaction_type}</span></div>
                  <div className="text-xs text-gray-300">Transaction ID: <span className="font-mono">{selectedOrderDetails.transaction_id || "Cash Transaction"}</span></div>
                  <div className="text-xs text-gray-300">Order Channel: <span className="font-bold">{selectedOrderDetails.is_pos_order === 1 ? "POS" : "Online"}</span></div>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-3">
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Order Items</span>
                {loadingDetails ? (
                  <div className="text-center py-6 text-gray-500"><i className="fas fa-spinner fa-spin mr-2"></i> Loading details...</div>
                ) : (
                  <div className="border border-[#222] rounded-xl overflow-hidden divide-y divide-[#222]">
                    {orderDetailsItems.map((item) => (
                      <div key={item.id} className="p-3 bg-[#0a0a0a] flex justify-between items-center text-xs">
                        <div>
                          <div className="font-bold text-gray-200">{item.item_name}</div>
                          {item.addons_name && <div className="text-[9px] text-[#00e676] mt-0.5">Addons: {item.addons_name}</div>}
                          {item.extras_name && <div className="text-[9px] text-[#ff1744]">Extras: {item.extras_name}</div>}
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-gray-300">{item.qty} x ${parseFloat(item.item_price).toFixed(2)}</div>
                          <div className="font-bold text-[#00e676] mt-0.5">${(parseFloat(item.qty) * parseFloat(item.item_price)).toFixed(2)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Summary totals */}
              <div className="bg-[#0a0a0a] border border-[#222] p-4 rounded-xl space-y-2 text-xs">
                <div className="flex justify-between text-gray-400">
                  <span>Tax Amount</span>
                  <span>${parseFloat(selectedOrderDetails.tax_amount || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Discount Amount</span>
                  <span>-${parseFloat(selectedOrderDetails.discount_amount || 0).toFixed(2)}</span>
                </div>
                {selectedOrderDetails.delivery_charge && parseFloat(selectedOrderDetails.delivery_charge) > 0 && (
                  <div className="flex justify-between text-gray-400">
                    <span>Delivery Charge</span>
                    <span>${parseFloat(selectedOrderDetails.delivery_charge).toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-[#222]">
                  <span>Grand Total</span>
                  <span className="text-[#00e676] text-base">${parseFloat(selectedOrderDetails.grand_total).toFixed(2)}</span>
                </div>
              </div>

              {/* Notes */}
              {selectedOrderDetails.order_notes && (
                <div className="bg-[#1a1112] border border-red-950/20 p-4 rounded-xl text-xs">
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-1">Customer / Chef Notes</span>
                  <p className="text-gray-300 italic">"{selectedOrderDetails.order_notes}"</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-5 border-t border-[#222] bg-[#0a0a0a] flex gap-3">
              <button
                onClick={() => setSelectedOrderDetails(null)}
                className="flex-1 py-2.5 bg-[#1c1c1c] hover:bg-[#222] rounded-xl border border-[#222] text-xs font-bold transition-all text-gray-300"
              >
                Close
              </button>
              <Link
                href={`/admin/pos/receipt/${selectedOrderDetails.id}`}
                target="_blank"
                className="flex-1 py-2.5 bg-[#00e676] text-[#0d0d0d] hover:bg-[#00c853] rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
              >
                <i className="fas fa-print"></i> Print Receipt
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
