"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function PurchaseOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/sourcing/orders")
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setOrders(data.orders || []);
        }
        setLoading(false);
      });
  }, []);

  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(`/api/sourcing/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        setOrders(orders.map(o => o.id === id ? { ...o, status } : o));
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold font-display mb-6">Sourcing Purchase Orders</h1>

      <div className="bg-[#111] rounded-xl border border-[#222] overflow-hidden">
        <div className="p-4 border-b border-[#222] bg-[#1a1a1a]">
          <h2 className="font-semibold text-white">All Purchase Orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#0d0d0d] text-gray-400 text-sm">
              <tr>
                <th className="p-4">PO ID</th>
                <th className="p-4">Customer Order</th>
                <th className="p-4">Product</th>
                <th className="p-4">Agent</th>
                <th className="p-4">Agent Order ID</th>
                <th className="p-4">Cost (RMB)</th>
                <th className="p-4">Status</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222]">
              {loading ? (
                <tr><td colSpan="8" className="p-4 text-center">Loading...</td></tr>
              ) : orders.length === 0 ? (
                <tr><td colSpan="8" className="p-4 text-center text-gray-500">No purchase orders found.</td></tr>
              ) : (
                orders.map(o => (
                  <tr key={o.id} className="hover:bg-[#1a1a1a]">
                    <td className="p-4 text-sm font-mono text-gray-300">PO-{o.id}</td>
                    <td className="p-4">
                      {o.order ? (
                        <Link href={`/admin/orders/${o.order.id}`} className="text-blue-400 hover:text-blue-300 text-sm font-semibold">
                          {o.order.order_number}
                        </Link>
                      ) : <span className="text-gray-500 text-sm">N/A</span>}
                    </td>
                    <td className="p-4 text-sm truncate max-w-[150px]" title={o.sourcingProduct?.sourceName}>
                      {o.sourcingProduct?.sourceName || `Prod #${o.sourcingProductId}`}
                    </td>
                    <td className="p-4 text-sm capitalize">{o.agentName}</td>
                    <td className="p-4 text-sm font-mono text-gray-400">{o.agentOrderId || '-'}</td>
                    <td className="p-4 text-sm">
                      {o.unitCostRmb ? `¥${o.unitCostRmb}` : '-'}
                    </td>
                    <td className="p-4">
                      <select 
                        className="bg-[#0d0d0d] border border-[#333] rounded px-2 py-1 text-xs outline-none"
                        value={o.status}
                        onChange={(e) => updateStatus(o.id, e.target.value)}
                      >
                        <option value="pending">Pending</option>
                        <option value="placed">Placed with Agent</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="qc_pass">QC Passed</option>
                        <option value="shipped">Shipped to Customer</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="p-4">
                      {o.status === 'placed' && !o.agentOrderId && (
                        <span className="text-yellow-500 text-xs"><i className="fas fa-exclamation-triangle"></i> Needs ID</span>
                      )}
                      {['qc_pass', 'shipped', 'delivered'].includes(o.status) && (
                        <Link href={`/admin/sourcing/tracking?po=${o.id}`} className="text-[#00e676] hover:text-[#00c853] text-sm ml-2">
                          <i className="fas fa-truck"></i> Track
                        </Link>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
