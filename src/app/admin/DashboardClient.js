"use client";

import { useState } from "react";
import Link from "next/link";

export default function DashboardClient({ initialData }) {
  const { stats, lowStockItems, recentOrders, topItems, error } = initialData;
  const [activeTab, setActiveTab] = useState("top-selling");

  // Format currency helper
  const formatPrice = (value) => {
    const val = parseFloat(value);
    return isNaN(val) ? "$0.00" : `$${val.toFixed(2)}`;
  };

  // Helper for order status badge styling
  const getStatusBadge = (status) => {
    // 1 = pending, 2 = preparing, 3 = ready, 4 = delivered, 5 = cancelled, etc.
    const statuses = {
      1: { text: "Pending", class: "bg-yellow-950/30 border-yellow-500/30 text-yellow-400" },
      2: { text: "Preparing", class: "bg-blue-950/30 border-blue-500/30 text-blue-400" },
      3: { text: "Ready", class: "bg-indigo-950/30 border-indigo-500/30 text-indigo-400" },
      4: { text: "Delivered", class: "bg-green-950/30 border-green-500/30 text-green-400" },
      5: { text: "Cancelled", class: "bg-red-950/30 border-red-500/30 text-red-400" },
      6: { text: "Failed", class: "bg-red-950/30 border-red-500/30 text-red-400" },
    };
    const s = statuses[status] || { text: "Order Placed", class: "bg-zinc-800 border-zinc-700 text-zinc-300" };
    return (
      <span className={`px-2 py-0.5 rounded-full border text-[10px] font-bold ${s.class}`}>
        {s.text}
      </span>
    );
  };

  // Helper for payment status badge styling
  const getPaymentStatusBadge = (status) => {
    // 1 = unpaid, 2 = paid, 3 = partial
    const statuses = {
      1: { text: "Unpaid", class: "bg-red-950/20 border-red-900/30 text-[#ff1744]" },
      2: { text: "Paid", class: "bg-green-950/20 border-green-900/30 text-[#00e676]" },
      3: { text: "Partial", class: "bg-yellow-950/20 border-yellow-900/30 text-yellow-500" },
    };
    const s = statuses[status] || { text: "Unknown", class: "bg-zinc-800 border-zinc-700 text-zinc-300" };
    return (
      <span className={`px-2.5 py-0.5 rounded-lg border text-[10px] font-bold ${s.class}`}>
        {s.text}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 rounded-xl bg-yellow-950/20 border border-yellow-500/30 text-yellow-400 text-xs flex items-center gap-3">
          <i className="fas fa-exclamation-circle text-base"></i>
          <span>{error}</span>
        </div>
      )}

      {/* ========== STATS ROW ========== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Revenue */}
        <div className="bg-[#111111]/85 border border-[#222222] rounded-2xl p-5 hover:border-[#00e676]/30 transition-all group shadow-lg">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[11px] text-gray-500 uppercase tracking-wider font-bold">Total Revenue</span>
              <h3 className="text-2xl font-extrabold font-display text-white mt-1 group-hover:text-[#00e676] transition-colors">
                {formatPrice(stats.totalRevenue)}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#00e676]/10 text-[#00e676] flex items-center justify-center border border-[#00e676]/10">
              <i className="fas fa-coins text-lg"></i>
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-4 text-xs text-gray-400">
            <span className="text-[#00e676] font-bold flex items-center gap-0.5">
              <i className="fas fa-arrow-trend-up"></i> +12%
            </span>
            <span>vs last month</span>
          </div>
        </div>

        {/* Today's Sales */}
        <div className="bg-[#111111]/85 border border-[#222222] rounded-2xl p-5 hover:border-[#00e676]/30 transition-all group shadow-lg">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[11px] text-gray-500 uppercase tracking-wider font-bold">Today's Revenue</span>
              <h3 className="text-2xl font-extrabold font-display text-[#00e676] mt-1">
                {formatPrice(stats.todayRevenue)}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#00e676]/10 text-[#00e676] flex items-center justify-center border border-[#00e676]/10">
              <i className="fas fa-receipt text-lg"></i>
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-4 text-xs text-gray-400">
            <span className="font-bold text-white">{stats.todayOrders} orders</span>
            <span>completed today</span>
          </div>
        </div>

        {/* Total Customers */}
        <div className="bg-[#111111]/85 border border-[#222222] rounded-2xl p-5 hover:border-purple-500/30 transition-all group shadow-lg">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[11px] text-gray-500 uppercase tracking-wider font-bold">Total Customers</span>
              <h3 className="text-2xl font-extrabold font-display text-white mt-1 group-hover:text-purple-400 transition-colors">
                {stats.customers}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/10">
              <i className="fas fa-users text-lg"></i>
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-4 text-xs text-gray-400">
            <span className="text-purple-400 font-bold flex items-center gap-0.5">
              <i className="fas fa-arrow-trend-up"></i> +4%
            </span>
            <span>new customers</span>
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="bg-[#111111]/85 border border-[#222222] rounded-2xl p-5 hover:border-[#ff1744]/30 transition-all group shadow-lg">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[11px] text-gray-500 uppercase tracking-wider font-bold">Low Stock Warning</span>
              <h3
                className={`text-2xl font-extrabold font-display mt-1 transition-colors ${
                  lowStockItems.length > 0 ? "text-[#ff1744]" : "text-white"
                }`}
              >
                {lowStockItems.length} items
              </h3>
            </div>
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${
                lowStockItems.length > 0
                  ? "bg-[#ff1744]/15 text-[#ff1744] border-[#ff1744]/20 animate-pulse"
                  : "bg-[#222] text-gray-400 border-[#333]"
              }`}
            >
              <i className="fas fa-triangle-exclamation text-lg"></i>
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-4 text-xs text-gray-400">
            {lowStockItems.length > 0 ? (
              <span className="text-[#ff1744] font-bold">Action required</span>
            ) : (
              <span className="text-green-500 font-bold">Stock levels normal</span>
            )}
            <span>threshold is 5 units</span>
          </div>
        </div>
      </div>

      {/* ========== CHARTS & METRICS ========== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Graph - Left (2 Cols wide on desktop) */}
        <div className="lg:col-span-2 bg-[#111111]/80 border border-[#222222] rounded-2xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between h-[340px]">
          <div>
            <div className="flex justify-between items-center mb-4">
              <div>
                <h4 className="font-bold text-sm tracking-tight font-display text-white">Sales & Revenue Trend</h4>
                <p className="text-[11px] text-gray-500">Weekly transaction performance report</p>
              </div>
              <span className="text-xs font-bold text-[#00e676] bg-[#00e676]/10 px-2.5 py-1 rounded-lg border border-[#00e676]/10">
                Live Data
              </span>
            </div>
          </div>

          {/* SVG Line Chart */}
          <div className="flex-1 w-full relative h-[180px] mt-4">
            <svg viewBox="0 0 500 150" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="chart-glow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00e676" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#00e676" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {/* Grid Lines */}
              <line x1="0" y1="20" x2="500" y2="20" stroke="#222" strokeWidth="1" strokeDasharray="5,5" />
              <line x1="0" y1="60" x2="500" y2="60" stroke="#222" strokeWidth="1" strokeDasharray="5,5" />
              <line x1="0" y1="100" x2="500" y2="100" stroke="#222" strokeWidth="1" strokeDasharray="5,5" />
              <line x1="0" y1="140" x2="500" y2="140" stroke="#333" strokeWidth="1.5" />

              {/* Glowing Area under line */}
              <path
                d="M0,140 Q80,100 160,110 T320,50 T500,20 L500,140 L0,140 Z"
                fill="url(#chart-glow)"
              />

              {/* Neon Line */}
              <path
                d="M0,140 Q80,100 160,110 T320,50 T500,20"
                fill="none"
                stroke="#00e676"
                strokeWidth="3.5"
                strokeLinecap="round"
                className="drop-shadow-[0_0_8px_rgba(0,230,118,0.5)]"
              />

              {/* Data points */}
              <circle cx="80" cy="118" r="4.5" fill="#00e676" stroke="#0d0d0d" strokeWidth="1.5" />
              <circle cx="160" cy="110" r="4.5" fill="#00e676" stroke="#0d0d0d" strokeWidth="1.5" />
              <circle cx="320" cy="50" r="4.5" fill="#00e676" stroke="#0d0d0d" strokeWidth="1.5" />
              <circle cx="500" cy="20" r="4.5" fill="#00e676" stroke="#0d0d0d" strokeWidth="1.5" />
            </svg>
          </div>

          <div className="flex justify-between items-center text-[10px] text-gray-500 uppercase tracking-wider font-bold mt-2 pt-3 border-t border-[#1c1c1c]">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
          </div>
        </div>

        {/* Order Sources - Right (1 Col wide) */}
        <div className="bg-[#111111]/80 border border-[#222222] rounded-2xl p-6 shadow-xl flex flex-col justify-between h-[340px]">
          <div>
            <h4 className="font-bold text-sm tracking-tight font-display text-white">Order Channels</h4>
            <p className="text-[11px] text-gray-500">Distribution of billing channels</p>
          </div>

          {/* Simple Donut Bar/Visual List */}
          <div className="space-y-4 my-auto">
            {/* POS Channel */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#00e676]"></span>
                  POS Terminals
                </span>
                <span className="text-[#00e676]">78%</span>
              </div>
              <div className="w-full h-2 bg-[#222] rounded-full overflow-hidden">
                <div className="h-full bg-[#00e676] rounded-full" style={{ width: "78%" }}></div>
              </div>
            </div>

            {/* Delivery/Online Channel */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
                  Online Website
                </span>
                <span className="text-cyan-400">18%</span>
              </div>
              <div className="w-full h-2 bg-[#222] rounded-full overflow-hidden">
                <div className="h-full bg-cyan-400 rounded-full" style={{ width: "18%" }}></div>
              </div>
            </div>

            {/* Kiosk/Third-Party Channel */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
                  Third-Party Apps
                </span>
                <span className="text-purple-400">4%</span>
              </div>
              <div className="w-full h-2 bg-[#222] rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full" style={{ width: "4%" }}></div>
              </div>
            </div>
          </div>

          <div className="text-[10px] text-center text-gray-500 pt-3 border-t border-[#1c1c1c]">
            POS remains the primary revenue channel
          </div>
        </div>
      </div>

      {/* ========== RECENT ORDERS & TOP PRODUCTS GRID ========== */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Orders (Left 2 columns on wide screen) */}
        <div className="xl:col-span-2 bg-[#111111]/80 border border-[#222222] rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h4 className="font-bold text-sm tracking-tight font-display text-white">Recent Transactions</h4>
              <p className="text-[11px] text-gray-500">Overview of recent checkout activities</p>
            </div>
            <Link
              href="/admin/orders"
              className="text-xs text-[#00e676] hover:underline font-semibold"
            >
              View All Orders <i className="fas fa-angle-right ml-1"></i>
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#222] text-[10px] text-gray-500 uppercase font-bold tracking-wider">
                  <th className="pb-3">Order Number</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Total Amount</th>
                  <th className="pb-3">Payment</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1c1c1c] text-xs">
                {recentOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-[#161616]/40 transition-colors group">
                    <td className="py-3.5 font-mono font-bold text-gray-300">
                      {ord.order_number}
                    </td>
                    <td className="py-3.5 text-gray-200">
                      {ord.name || "Walk-in Customer"}
                    </td>
                    <td className="py-3.5 font-bold text-[#00e676]">
                      {formatPrice(ord.grand_total)}
                    </td>
                    <td className="py-3.5">
                      {getPaymentStatusBadge(ord.payment_status)}
                    </td>
                    <td className="py-3.5">
                      {getStatusBadge(ord.status)}
                    </td>
                    <td className="py-3.5 text-right">
                      <Link
                        href={`/admin/pos/receipt/${ord.id}`}
                        target="_blank"
                        className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-white px-2.5 py-1.5 bg-[#1a1a1a] rounded-lg border border-[#333] transition-all text-[11px]"
                      >
                        <i className="fas fa-print mr-1"></i> Receipt
                      </Link>
                    </td>
                  </tr>
                ))}
                {recentOrders.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center py-10 text-gray-500">
                      No recent orders found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Tabs - Top Selling / Low Stock (Right 1 column) */}
        <div className="bg-[#111111]/80 border border-[#222222] rounded-2xl p-6 shadow-xl flex flex-col">
          {/* Tab headers */}
          <div className="flex border-b border-[#222] mb-4">
            <button
              onClick={() => setActiveTab("top-selling")}
              className={`flex-1 pb-3 text-xs font-bold transition-all relative ${
                activeTab === "top-selling" ? "text-[#00e676]" : "text-gray-500 hover:text-white"
              }`}
            >
              Top Selling
              {activeTab === "top-selling" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00e676]"></span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("low-stock")}
              className={`flex-1 pb-3 text-xs font-bold transition-all relative flex items-center justify-center gap-1.5 ${
                activeTab === "low-stock" ? "text-[#ff1744]" : "text-gray-500 hover:text-[#ff1744]"
              }`}
            >
              Low Stock
              {lowStockItems.length > 0 && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff1744] animate-ping"></span>
              )}
              {activeTab === "low-stock" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#ff1744]"></span>
              )}
            </button>
          </div>

          {/* Tab contents */}
          <div className="flex-1 overflow-y-auto max-h-[260px]">
            {activeTab === "top-selling" ? (
              <div className="divide-y divide-[#1c1c1c] text-xs">
                {topItems.map((item, idx) => (
                  <div key={item.id} className="py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="w-5 h-5 rounded bg-zinc-800 text-[10px] font-bold flex items-center justify-center text-gray-400">
                        #{idx + 1}
                      </span>
                      <span className="font-semibold text-gray-200">{item.name}</span>
                    </div>
                    <span className="text-[10px] text-gray-500 font-bold bg-[#1a1a1a] px-2 py-0.5 rounded border border-[#333]">
                      {item.salesCount} sold
                    </span>
                  </div>
                ))}
                {topItems.length === 0 && (
                  <div className="text-center py-10 text-gray-500">
                    No top-selling item details
                  </div>
                )}
              </div>
            ) : (
              <div className="divide-y divide-[#1c1c1c] text-xs">
                {lowStockItems.map((item) => (
                  <div key={item.id} className="py-3 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-gray-200">{item.item_name}</div>
                      <div className="text-[10px] text-[#ff1744] mt-0.5">
                        Stock Left: {item.qty ?? 0}
                      </div>
                    </div>
                    <Link
                      href="/admin/products"
                      className="px-2.5 py-1 bg-red-950/20 hover:bg-[#ff1744]/20 border border-red-500/20 text-[#ff1744] rounded text-[10px] font-bold transition-all"
                    >
                      Restock
                    </Link>
                  </div>
                ))}
                {lowStockItems.length === 0 && (
                  <div className="text-center py-10 text-gray-500">
                    All items are well stocked
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
