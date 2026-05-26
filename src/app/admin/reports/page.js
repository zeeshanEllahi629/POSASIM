"use client";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

export default function ReportsPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // today, week, month, custom
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchReports = async () => {
    setLoading(true);
    try {
      let url = `/api/admin/reports?filter=${filter}`;
      if (filter === "custom" && startDate && endDate) {
        url += `&startDate=${startDate}&endDate=${endDate}`;
      }
      
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setOrders(data.data);
      } else {
        toast.error("Failed to load reports");
      }
    } catch (e) {
      toast.error("An error occurred");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (filter !== "custom" || (filter === "custom" && startDate && endDate)) {
      fetchReports();
    }
  }, [filter, startDate, endDate]);

  const totalRevenue = orders.reduce((sum, o) => sum + parseFloat(o.grand_total || 0), 0);

  return (
    <div className="max-w-7xl mx-auto pb-10">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold text-white">Sales Reports</h1>
        <div className="flex items-center gap-3">
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="bg-[#1a1a1a] border border-[#333] text-white rounded px-4 py-2"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
            <option value="custom">Custom Range</option>
          </select>
          {filter === "custom" && (
            <div className="flex gap-2">
              <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="bg-[#1a1a1a] border border-[#333] text-white rounded px-2 py-2" />
              <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="bg-[#1a1a1a] border border-[#333] text-white rounded px-2 py-2" />
            </div>
          )}
          <button onClick={fetchReports} className="bg-[#222] hover:bg-[#333] text-white px-4 py-2 rounded border border-[#333]">
            <i className="fa-solid fa-sync"></i> Refresh
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-[#111] border border-[#222] p-6 rounded-xl">
          <h3 className="text-gray-400 text-sm font-semibold mb-2">Total Orders</h3>
          <p className="text-3xl font-bold text-white">{orders.length}</p>
        </div>
        <div className="bg-[#111] border border-[#222] p-6 rounded-xl">
          <h3 className="text-gray-400 text-sm font-semibold mb-2">Total Revenue</h3>
          <p className="text-3xl font-bold text-[#00e676]">${totalRevenue.toFixed(2)}</p>
        </div>
      </div>

      <div className="bg-[#111] border border-[#222] rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-white">Loading reports...</div>
        ) : (
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-[#1a1a1a] text-gray-400 uppercase">
              <tr>
                <th className="px-4 py-3">Order #</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Branch</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222]">
              {orders.map(order => (
                <tr key={order.id} className="hover:bg-[#1a1a1a]">
                  <td className="px-4 py-3 font-semibold text-white">{order.order_number}</td>
                  <td className="px-4 py-3">{new Date(order.created_at).toLocaleString()}</td>
                  <td className="px-4 py-3">{order.name} <br/><span className="text-xs text-gray-500">{order.mobile}</span></td>
                  <td className="px-4 py-3">
                    {order.order_type === '1' ? 'Delivery' : order.order_type === '2' ? 'Collection' : order.order_type}
                  </td>
                  <td className="px-4 py-3">{order.branch_info?.name || 'Main'}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs ${order.status === '1' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-green-500/20 text-green-500'}`}>
                      {order.status === '1' ? 'Pending' : 'Completed'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-white">${parseFloat(order.grand_total).toFixed(2)}</td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr><td colSpan="7" className="text-center p-8 text-gray-500">No orders found for this period.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
