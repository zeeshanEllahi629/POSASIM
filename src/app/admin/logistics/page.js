"use client";

import { useState, useEffect } from "react";

export default function LogisticsPage() {
  const [shipments, setShipments] = useState([]);

  useEffect(() => {
    fetchShipments();
  }, []);

  const fetchShipments = async () => {
    try {
      const res = await fetch("/api/logistics");
      const data = await res.json();
      if (data.success) {
        setShipments(data.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const createDummyShipment = async () => {
    try {
      await fetch("/api/logistics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          origin: "Shenzhen, China",
          destination: "Los Angeles, USA",
          cost: 1250.00
        })
      });
      fetchShipments();
    } catch (e) {}
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#111] p-6 rounded-2xl border border-[#222] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-white">Forwarding & Logistics</h1>
          <p className="text-gray-400 text-sm mt-1">Track shipments, manage freight forwarders, and monitor supply chain timelines.</p>
        </div>
        <button onClick={createDummyShipment} className="bg-[#00e676] text-[#0d0d0d] px-4 py-2 rounded-xl text-sm font-bold hover:bg-[#00c853] transition-colors">
          + Book Shipment
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kanban Board Layout for Shipments */}
        
        {/* Column: Pending / Booked */}
        <div className="bg-[#111] border border-[#222] rounded-2xl p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-300">Booked</h3>
            <span className="bg-[#222] px-2 py-0.5 rounded text-xs text-gray-400">{shipments.filter(s => s.status === 'Pending').length}</span>
          </div>
          <div className="space-y-3">
            {shipments.filter(s => s.status === 'Pending').map(s => (
              <div key={s.id} className="bg-[#1a1a1a] p-4 rounded-xl border border-[#333] hover:border-[#444] transition-all cursor-pointer">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-mono text-blue-400">{s.tracking_number}</span>
                  <span className="text-xs text-gray-500">${s.cost}</span>
                </div>
                <div className="text-sm text-gray-300 space-y-1">
                  <p><i className="fas fa-map-marker-alt text-gray-500 w-4"></i> {s.origin}</p>
                  <p><i className="fas fa-flag-checkered text-gray-500 w-4"></i> {s.destination}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Column: In Transit */}
        <div className="bg-[#111] border border-[#222] rounded-2xl p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-[#00e676]">In Transit</h3>
            <span className="bg-[#00e676]/10 px-2 py-0.5 rounded text-xs text-[#00e676]">{shipments.filter(s => s.status === 'In Transit').length}</span>
          </div>
          <div className="space-y-3">
            {shipments.filter(s => s.status === 'In Transit').map(s => (
              <div key={s.id} className="bg-[#1a1a1a] p-4 rounded-xl border border-[#00e676]/30 hover:border-[#00e676] transition-all cursor-pointer relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-[#00e676]"></div>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-mono text-[#00e676]">{s.tracking_number}</span>
                  <span className="text-xs text-gray-500">${s.cost}</span>
                </div>
                <div className="text-sm text-gray-300 space-y-1">
                  <p><i className="fas fa-ship text-[#00e676] w-4"></i> {s.origin}</p>
                  <p><i className="fas fa-anchor text-gray-500 w-4"></i> {s.destination}</p>
                </div>
                <div className="mt-3 pt-3 border-t border-[#333] flex justify-between items-center">
                  <span className="text-xs text-gray-400">Est. Arrival: 5 Days</span>
                  <button className="text-xs bg-[#222] px-2 py-1 rounded hover:bg-[#333]">Track</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Column: Delivered */}
        <div className="bg-[#111] border border-[#222] rounded-2xl p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-400">Delivered</h3>
            <span className="bg-[#222] px-2 py-0.5 rounded text-xs text-gray-400">{shipments.filter(s => s.status === 'Delivered').length}</span>
          </div>
          <div className="space-y-3">
            {shipments.filter(s => s.status === 'Delivered').map(s => (
              <div key={s.id} className="bg-[#1a1a1a] p-4 rounded-xl border border-[#333] opacity-60">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-mono text-gray-400">{s.tracking_number}</span>
                  <i className="fas fa-check-circle text-green-500"></i>
                </div>
                <div className="text-sm text-gray-400 space-y-1">
                  <p>{s.origin} <i className="fas fa-arrow-right mx-1 text-[10px]"></i> {s.destination}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
