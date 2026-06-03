"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function PlatformSettingsPage() {
  const { platform } = useParams();
  
  const platformNames = {
    ebay: "eBay",
    tiktok: "TikTok Shop",
    facebook: "Facebook Marketplace"
  };

  const platformName = platformNames[platform] || platform;

  const [settings, setSettings] = useState({
    apiKey: "",
    apiSecret: "",
    accessToken: "",
    storeId: "",
    active: false,
  });

  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    // Fetch existing settings
    fetch(`/api/marketplaces/settings?platform=${platform}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.settings) {
          setSettings(data.settings);
        }
      })
      .catch(() => {});
  }, [platform]);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/marketplaces/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platform, settings })
      });
      const data = await res.json();
      if (data.success) {
        alert("Settings saved successfully!");
      } else {
        alert("Failed to save settings: " + data.error);
      }
    } catch(err) {
      alert("Network error.");
    }
    setLoading(false);
  };

  const handleSync = async (type) => {
    setSyncing(type);
    try {
      const res = await fetch("/api/marketplaces/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platform, type })
      });
      const data = await res.json();
      if (data.success) {
        alert(`${type} synced successfully!`);
      } else {
        alert(`Sync failed: ${data.error}`);
      }
    } catch(err) {
      alert("Sync error.");
    }
    setSyncing(false);
  };

  return (
    <div className="p-6 font-sans max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/marketplaces" className="w-10 h-10 bg-[#111] hover:bg-[#222] border border-[#333] rounded-xl flex items-center justify-center text-gray-400 hover:text-white transition-colors">
          <i className="fas fa-arrow-left"></i>
        </Link>
        <div>
          <h1 className="text-3xl font-extrabold text-white capitalize font-display">{platformName} Integration</h1>
          <p className="text-gray-400">Manage API credentials and synchronization for {platformName}.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-[#111] border border-[#222] rounded-2xl p-6 shadow-[0_0_20px_rgba(0,0,0,0.3)]">
            <h2 className="text-xl font-bold text-white mb-4 border-b border-[#222] pb-4">
              <i className="fas fa-key text-[#00e676] mr-2"></i> API Credentials
            </h2>
            
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-400 mb-1">API Key / Client ID</label>
                <input 
                  type="text" 
                  value={settings.apiKey}
                  onChange={e => setSettings({...settings, apiKey: e.target.value})}
                  className="w-full bg-[#0a0a0a] border border-[#333] rounded-xl px-4 py-3 text-white focus:border-[#00e676] outline-none transition-colors"
                  placeholder="Enter API Key"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-400 mb-1">API Secret / Client Secret</label>
                <input 
                  type="password" 
                  value={settings.apiSecret}
                  onChange={e => setSettings({...settings, apiSecret: e.target.value})}
                  className="w-full bg-[#0a0a0a] border border-[#333] rounded-xl px-4 py-3 text-white focus:border-[#00e676] outline-none transition-colors"
                  placeholder="Enter API Secret"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-400 mb-1">Access Token (Optional)</label>
                <textarea 
                  value={settings.accessToken}
                  onChange={e => setSettings({...settings, accessToken: e.target.value})}
                  className="w-full bg-[#0a0a0a] border border-[#333] rounded-xl px-4 py-3 text-white focus:border-[#00e676] outline-none transition-colors h-24 resize-none"
                  placeholder="Enter Access Token if applicable"
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-400 mb-1">Store / Merchant ID</label>
                <input 
                  type="text" 
                  value={settings.storeId}
                  onChange={e => setSettings({...settings, storeId: e.target.value})}
                  className="w-full bg-[#0a0a0a] border border-[#333] rounded-xl px-4 py-3 text-white focus:border-[#00e676] outline-none transition-colors"
                  placeholder="Enter Store ID"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input 
                  type="checkbox" 
                  id="active" 
                  checked={settings.active}
                  onChange={e => setSettings({...settings, active: e.target.checked})}
                  className="w-5 h-5 accent-[#00e676]"
                />
                <label htmlFor="active" className="text-white font-bold cursor-pointer">Enable {platformName} Sync</label>
              </div>

              <div className="pt-4 border-t border-[#222]">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="bg-[#00e676] hover:bg-[#00c853] text-black font-extrabold px-6 py-3 rounded-xl transition-colors flex items-center gap-2"
                >
                  {loading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-save"></i>}
                  Save Settings
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-[#111] border border-[#222] rounded-2xl p-6 shadow-[0_0_20px_rgba(0,0,0,0.3)]">
            <h2 className="text-xl font-bold text-white mb-4 border-b border-[#222] pb-4">
              <i className="fas fa-sync-alt text-[#00e676] mr-2"></i> Manual Sync
            </h2>
            
            <div className="space-y-4">
              <p className="text-sm text-gray-400">Trigger manual synchronization for orders and inventory.</p>
              
              <button 
                onClick={() => handleSync('orders')}
                disabled={syncing !== false}
                className="w-full bg-[#1a1a1a] hover:bg-[#222] text-white border border-[#333] rounded-xl py-3 text-sm font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              >
                {syncing === 'orders' ? <i className="fas fa-spinner fa-spin text-[#00e676]"></i> : <i className="fas fa-download text-[#00e676]"></i>}
                Fetch Orders
              </button>

              <button 
                onClick={() => handleSync('inventory')}
                disabled={syncing !== false}
                className="w-full bg-[#1a1a1a] hover:bg-[#222] text-white border border-[#333] rounded-xl py-3 text-sm font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              >
                {syncing === 'inventory' ? <i className="fas fa-spinner fa-spin text-blue-500"></i> : <i className="fas fa-upload text-blue-500"></i>}
                Push Inventory
              </button>
            </div>
          </div>
          
          <div className="bg-[#1a1a1a] border border-[#222] rounded-2xl p-5">
            <h3 className="font-bold text-white text-sm mb-2"><i className="fas fa-info-circle text-gray-400 mr-2"></i> Instructions</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              To setup this integration, obtain your API keys from the {platformName} Developer Console. Once saved, you can use the sync buttons to run manual syncs or set up automated cron jobs targeting the <code className="bg-[#0a0a0a] text-[#00e676] px-1 rounded">/api/marketplaces/sync</code> endpoint.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
