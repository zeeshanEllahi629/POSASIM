"use client";

import { useState, useEffect } from "react";

export default function MarketplacesPage() {
  const [configs, setConfigs] = useState([]);

  useEffect(() => {
    fetchConfigs();
  }, []);

  const fetchConfigs = async () => {
    try {
      const res = await fetch("/api/marketplaces");
      const data = await res.json();
      if (data.success) {
        setConfigs(data.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const connectMarketplace = async (platform) => {
    try {
      await fetch("/api/marketplaces", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platform: platform,
          store_url: `https://my-store.${platform.toLowerCase()}.com`
        })
      });
      fetchConfigs();
    } catch (e) {}
  };

  const isConnected = (platform) => {
    return configs.some(c => c.platform === platform && c.is_active === 1);
  };

  const platforms = [
    { name: "Amazon", icon: "fab fa-amazon", color: "text-[#FF9900]" },
    { name: "Shopify", icon: "fab fa-shopify", color: "text-[#95BF47]" },
    { name: "Etsy", icon: "fab fa-etsy", color: "text-[#F56400]" },
    { name: "TikTok Shop", icon: "fab fa-tiktok", color: "text-white" },
    { name: "Facebook Shop", icon: "fab fa-facebook", color: "text-[#1877F2]" },
    { name: "WooCommerce", icon: "fas fa-shopping-cart", color: "text-[#96588a]" }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-[#111] p-6 rounded-2xl border border-[#222]">
        <h1 className="text-2xl font-bold font-display text-white">Marketplace Connections</h1>
        <p className="text-gray-400 text-sm mt-1">Connect your store to global marketplaces to sync inventory, prices, and orders automatically.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {platforms.map(platform => {
          const connected = isConnected(platform.name);
          return (
            <div key={platform.name} className={`bg-[#111] p-6 rounded-2xl border ${connected ? 'border-[#00e676]/50 shadow-[0_0_15px_rgba(0,230,118,0.1)]' : 'border-[#222]'} transition-all flex flex-col items-center text-center`}>
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-4 bg-[#050505] border ${connected ? 'border-[#00e676]/30' : 'border-[#333]'}`}>
                <i className={`${platform.icon} ${platform.color}`}></i>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{platform.name}</h3>
              <p className="text-sm text-gray-400 mb-6">Sync products, pull orders, and update inventory automatically.</p>
              
              {connected ? (
                <div className="w-full">
                  <div className="bg-[#00e676]/10 text-[#00e676] px-4 py-2 rounded-xl font-bold text-sm w-full border border-[#00e676]/20 flex justify-center items-center gap-2">
                    <i className="fas fa-check-circle"></i> Connected
                  </div>
                  <button className="text-xs text-gray-500 hover:text-white mt-3 underline">Configure Settings</button>
                </div>
              ) : (
                <button 
                  onClick={() => connectMarketplace(platform.name)}
                  className="bg-[#222] text-white hover:bg-[#333] px-6 py-2 rounded-xl font-bold text-sm w-full transition-colors border border-[#444]"
                >
                  Connect
                </button>
              )}
            </div>
          );
        })}
      </div>

      <div className="bg-[#111] p-6 rounded-2xl border border-[#222] mt-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-white">Unified Inventory Status</h2>
          <button className="text-sm text-[#00e676] hover:underline">Sync All Now</button>
        </div>
        
        {configs.length === 0 ? (
          <div className="text-center py-8 text-gray-500 border border-dashed border-[#333] rounded-xl">
            <i className="fas fa-plug text-2xl mb-2"></i>
            <p>Connect at least one marketplace to see inventory status.</p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="bg-[#1a1a1a] p-4 rounded-xl border border-[#333] flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded bg-[#222] flex items-center justify-center">
                  <i className="fas fa-box text-gray-400"></i>
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">Smart Watch Series 8</h4>
                  <p className="text-xs text-gray-500">SKU: SW-8-BLK</p>
                </div>
              </div>
              <div className="flex gap-2 text-xs">
                {configs.map(c => (
                  <span key={c.id} className="bg-green-500/10 text-green-500 border border-green-500/20 px-2 py-1 rounded">
                    {c.platform}: 150 in stock
                  </span>
                ))}
              </div>
            </div>
            {/* Add more dummy inventory items as needed */}
          </div>
        )}
      </div>
    </div>
  );
}
