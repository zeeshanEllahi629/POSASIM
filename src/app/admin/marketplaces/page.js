"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function MarketplacesDashboard() {
  const [platforms, setPlatforms] = useState([
    { id: "ebay", name: "eBay", icon: "fa-brands fa-ebay", color: "text-blue-500", status: "Inactive", description: "Sync listings, orders, and inventory with eBay." },
    { id: "tiktok", name: "TikTok Shop", icon: "fa-brands fa-tiktok", color: "text-black bg-white rounded-full p-1", status: "Inactive", description: "Manage TikTok Shop orders and products natively." },
    { id: "facebook", name: "Facebook Marketplace", icon: "fa-brands fa-facebook", color: "text-blue-600", status: "Inactive", description: "Connect to FB Shops and Marketplace for inventory." }
  ]);

  useEffect(() => {
    // Fetch real status from API in future
    fetch("/api/marketplaces/settings")
      .then(res => res.json())
      .then(data => {
        if (data.success && data.platforms) {
          setPlatforms(prev => prev.map(p => ({
            ...p,
            status: data.platforms[p.id]?.active ? "Active" : "Inactive"
          })));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="p-6 font-sans">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-white mb-2 font-display">Marketplace Integrations</h1>
        <p className="text-gray-400">Connect and manage your external sales channels.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {platforms.map(platform => (
          <div key={platform.id} className="bg-[#111] border border-[#222] rounded-2xl p-6 hover:border-[#333] transition-all flex flex-col h-full shadow-[0_0_20px_rgba(0,0,0,0.3)]">
            <div className="flex justify-between items-start mb-4">
              <div className={`text-4xl ${platform.color}`}>
                <i className={platform.icon}></i>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-bold ${platform.status === 'Active' ? 'bg-[#00e676]/10 text-[#00e676] border border-[#00e676]/30' : 'bg-gray-800 text-gray-400 border border-gray-700'}`}>
                {platform.status}
              </div>
            </div>
            
            <h2 className="text-xl font-bold text-white mb-2">{platform.name}</h2>
            <p className="text-sm text-gray-400 flex-1 mb-6">{platform.description}</p>
            
            <Link 
              href={`/admin/marketplaces/${platform.id}`}
              className="w-full bg-[#1a1a1a] hover:bg-[#222] text-white border border-[#333] hover:border-[#444] rounded-xl py-3 text-center font-bold text-sm transition-all"
            >
              Manage Integration
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
