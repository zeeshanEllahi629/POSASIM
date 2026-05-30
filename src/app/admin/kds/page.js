"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function KDSPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/kds");
      const data = await res.json();
      if (data.status === 1) {
        setOrders(data.orders);
        setError(null);
      } else {
        setError(data.error || "Failed to fetch orders");
      }
    } catch (err) {
      setError("Network error fetching orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchOrders();

    // Polling every 10 seconds
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, []);

  const updateStatus = async (orderId, newStatus) => {
    // Optimistic UI update
    setOrders((prev) => {
      if (newStatus === "3") {
        return prev.filter(o => o.id !== orderId); // Remove if ready
      }
      return prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o);
    });

    try {
      const res = await fetch("/api/kds/update-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_id: orderId, status: newStatus })
      });
      const data = await res.json();
      if (data.status !== 1) {
        // Revert on failure by re-fetching
        fetchOrders();
        alert(data.error || "Failed to update status");
      }
    } catch (err) {
      console.error(err);
      fetchOrders();
    }
  };

  if (loading && orders.length === 0) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center text-white">
        <i className="fas fa-spinner fa-spin text-4xl text-[#ff1744]"></i>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white flex flex-col font-sans h-screen overflow-hidden">
      {/* Header */}
      <header className="h-16 border-b border-[#222] bg-[#c60000] flex items-center justify-between px-6 shrink-0 shadow-lg z-10">
        <div className="flex items-center gap-4">
          <i className="fas fa-fire-burner text-white text-2xl"></i>
          <h1 className="text-2xl font-extrabold tracking-tight text-white uppercase">Kitchen Display System</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <span className="text-xs font-bold bg-white/20 px-3 py-1.5 rounded-full flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            Live Updates
          </span>
          <Link href="/admin/pos" className="bg-[#111] hover:bg-[#222] text-white px-4 py-2 rounded-lg font-bold text-xs transition-all border border-[#333] shadow-md flex items-center gap-2">
            <i className="fas fa-cash-register"></i> Back to POS
          </Link>
        </div>
      </header>

      {/* Main Board */}
      <main className="flex-1 overflow-x-auto overflow-y-auto p-6 bg-[url('/img/pattern-dark.png')] bg-repeat bg-black/40">
        {error && (
          <div className="bg-red-900/50 border border-red-500 text-white p-4 rounded-xl mb-6 text-sm flex items-center gap-3">
            <i className="fas fa-exclamation-triangle"></i> {error}
          </div>
        )}

        {orders.length === 0 && !error ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 opacity-70">
            <i className="fas fa-check-circle text-6xl mb-4 text-[#00e676]"></i>
            <h2 className="text-2xl font-bold font-display uppercase tracking-wider">All Clear</h2>
            <p className="text-sm mt-2">No active orders in the kitchen.</p>
          </div>
        ) : (
          <div className="flex gap-6 h-full items-start">
            {orders.map((order) => {
              // Determine card colors based on status and time
              let headerBg = "bg-[#1e1e1e]";
              let statusText = "PENDING";
              let statusColor = "text-yellow-500";
              
              if (order.status === "2") {
                headerBg = "bg-[#ff9100]/20 border-b border-[#ff9100]/50";
                statusText = "COOKING";
                statusColor = "text-[#ff9100]";
              } else if (order.elapsed_minutes > 15) {
                // Delayed pending order
                headerBg = "bg-red-900/30 border-b border-red-500/50";
                statusText = "DELAYED";
                statusColor = "text-red-500 animate-pulse";
              }

              return (
                <div key={order.id} className="min-w-[320px] w-[320px] bg-[#161616] border border-[#333] rounded-2xl overflow-hidden shadow-2xl flex flex-col shrink-0 max-h-[85vh]">
                  
                  {/* Ticket Header */}
                  <div className={`p-4 ${headerBg} transition-colors duration-300`}>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-2xl font-bold font-display text-white">#{order.order_number}</h3>
                      <div className="text-right">
                        <span className="text-xl font-bold bg-[#0d0d0d] px-2.5 py-1 rounded-lg border border-[#333]">
                          {order.elapsed_minutes} <span className="text-[10px] text-gray-500 uppercase">min</span>
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className={`font-bold ${order.order_type === 'Delivery' ? 'text-blue-400' : 'text-purple-400'} uppercase tracking-wider`}>
                        <i className={`fas ${order.order_type === 'Delivery' ? 'fa-motorcycle' : 'fa-shopping-bag'} mr-1`}></i>
                        {order.order_type}
                      </span>
                      <span className={`font-extrabold tracking-widest ${statusColor}`}>
                        {statusText}
                      </span>
                    </div>
                  </div>

                  {/* Special Instructions (If Any) */}
                  {order.special_instructions && (
                    <div className="bg-[#ff1744]/10 border-y border-[#ff1744]/30 p-3">
                      <span className="text-[10px] font-bold text-[#ff1744] uppercase tracking-wider block mb-1">
                        <i className="fas fa-exclamation-circle mr-1"></i> Special Instructions
                      </span>
                      <p className="text-sm font-semibold italic text-red-100 leading-tight">
                        "{order.special_instructions}"
                      </p>
                    </div>
                  )}

                  {/* Order Items */}
                  <div className="p-4 flex-1 overflow-y-auto scrollbar-thin space-y-3">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex gap-3 pb-3 border-b border-[#2a2a2a] last:border-0 last:pb-0">
                        <div className="w-8 h-8 rounded-lg bg-[#222] flex items-center justify-center font-bold text-lg border border-[#333] shrink-0 text-[#00e676]">
                          {item.qty}
                        </div>
                        <div>
                          <h4 className="font-bold text-lg leading-tight">{item.name}</h4>
                          {item.addons && <p className="text-xs text-gray-400 mt-1"><span className="text-gray-500 font-bold">+</span> {item.addons}</p>}
                          {item.extras && <p className="text-xs text-gray-400"><span className="text-gray-500 font-bold">+</span> {item.extras}</p>}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="p-4 bg-[#111] border-t border-[#333] mt-auto">
                    {order.status === "1" ? (
                      <button 
                        onClick={() => updateStatus(order.id, "2")}
                        className="w-full bg-[#ff9100] hover:bg-[#e68200] text-black font-bold py-3.5 rounded-xl text-sm uppercase tracking-wider transition-all shadow-lg shadow-[#ff9100]/20 flex items-center justify-center gap-2"
                      >
                        <i className="fas fa-fire"></i> Start Cooking
                      </button>
                    ) : (
                      <button 
                        onClick={() => updateStatus(order.id, "3")}
                        className="w-full bg-[#00e676] hover:bg-[#00c853] text-black font-bold py-3.5 rounded-xl text-sm uppercase tracking-wider transition-all shadow-lg shadow-[#00e676]/20 flex items-center justify-center gap-2"
                      >
                        <i className="fas fa-check-circle"></i> Mark Ready
                      </button>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
