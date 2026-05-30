"use client";

import { useState, useEffect } from "react";

export default function ModuleManagerPage() {
  const [modules, setModules] = useState({
    sourcing: true,
    suppliers: true,
    logistics: true,
    marketplaces: true,
    marketing: true
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchModules();
  }, []);

  const fetchModules = async () => {
    try {
      const res = await fetch("/api/settings/modules");
      const data = await res.json();
      if (data.success) {
        setModules(data.modules);
      }
      setLoading(false);
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  const toggleModule = async (moduleKey, currentStatus) => {
    const newStatus = !currentStatus;
    
    // Optimistic UI update
    setModules(prev => ({ ...prev, [moduleKey]: newStatus }));

    try {
      await fetch("/api/settings/modules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ module: moduleKey, isEnabled: newStatus })
      });
      // Optionally trigger a full page reload or sidebar event to refresh the menu immediately
      // window.location.reload(); // Uncomment if you want to force reload to update sidebar
    } catch (e) {
      console.error("Failed to toggle module:", e);
      // Revert on failure
      setModules(prev => ({ ...prev, [moduleKey]: currentStatus }));
    }
  };

  const moduleList = [
    { key: "sourcing", name: "Product Sourcing Agent", icon: "fa-globe-asia", desc: "Discover products and calculate margins with AI." },
    { key: "suppliers", name: "Supplier Management CRM", icon: "fa-handshake", desc: "Manage supplier profiles, RFQs, and Quotations." },
    { key: "logistics", name: "Forwarding & Logistics", icon: "fa-shipping-fast", desc: "Track global shipments and freight costs." },
    { key: "marketplaces", name: "Marketplace Management", icon: "fa-store-alt", desc: "Sync inventory with Shopify, Amazon, etc." },
    { key: "marketing", name: "Digital Marketing Agent", icon: "fa-bullhorn", desc: "Generate AI ad copy and manage campaigns." }
  ];

  if (loading) return <div className="p-6 text-white">Loading modules...</div>;

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="bg-[#111] p-6 rounded-2xl border border-[#222]">
        <h1 className="text-2xl font-bold font-display text-white">Module Manager</h1>
        <p className="text-gray-400 text-sm mt-1">Super Admins can toggle major ERP modules on or off. Disabled modules will be hidden from the sidebar for all users.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {moduleList.map(mod => {
          const isEnabled = modules[mod.key];
          return (
            <div key={mod.key} className={`bg-[#111] p-5 rounded-2xl border transition-all ${isEnabled ? 'border-[#00e676]/30' : 'border-[#333] opacity-75'}`}>
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${isEnabled ? 'bg-[#00e676]/10 text-[#00e676]' : 'bg-[#222] text-gray-500'}`}>
                    <i className={`fas ${mod.icon}`}></i>
                  </div>
                  <div>
                    <h3 className={`font-bold ${isEnabled ? 'text-white' : 'text-gray-400'}`}>{mod.name}</h3>
                  </div>
                </div>
                
                {/* Toggle Switch */}
                <button 
                  onClick={() => toggleModule(mod.key, isEnabled)}
                  className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${isEnabled ? 'bg-[#00e676]' : 'bg-[#333]'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 ${isEnabled ? 'left-7' : 'left-1'}`}></div>
                </button>
              </div>
              <p className="text-sm text-gray-500 pl-13">{mod.desc}</p>
              
              {!isEnabled && (
                <div className="mt-4 bg-[#222] text-xs text-gray-400 px-3 py-2 rounded-lg">
                  <i className="fas fa-eye-slash mr-1"></i> Hidden from dashboard
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl flex gap-3 text-sm text-blue-400">
        <i className="fas fa-info-circle mt-0.5"></i>
        <p>Changes apply instantly. If the sidebar does not update automatically, please refresh the page to see the new layout.</p>
      </div>
    </div>
  );
}
