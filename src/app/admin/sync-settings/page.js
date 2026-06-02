"use client";
import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function SyncSettingsPage() {
  const [activeTab, setActiveTab] = useState("platforms");
  const [logs, setLogs] = useState([]);
  const [settings, setSettings] = useState({
    shopify: { api_key: "", api_secret: "", access_token: "", is_active: 0 },
    amazon: { api_key: "", access_token: "", is_active: 0 },
    meta: { api_key: "", access_token: "", is_active: 0 },
    ebay: { api_key: "", access_token: "", is_active: 0 },
    tiktok: { api_key: "", access_token: "", is_active: 0 },
  });

  useEffect(() => {
    fetchSettings();
    fetchLogs();
  }, []);

  const fetchSettings = async () => {
    const res = await fetch("/api/admin2/marketplace");
    const data = await res.json();
    if (data.success && data.settings) {
      const newSettings = { ...settings };
      data.settings.forEach(s => {
        if (newSettings[s.platform]) {
          newSettings[s.platform] = s;
        } else {
          newSettings[s.platform] = s;
        }
      });
      setSettings(newSettings);
    }
  };

  const fetchLogs = async () => {
    const res = await fetch("/api/admin2/sync");
    const data = await res.json();
    if (data.success && data.logs) {
      setLogs(data.logs);
    }
  };

  const handleUpdate = async (platform) => {
    const data = settings[platform];
    const res = await fetch("/api/admin2/marketplace", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        platform,
        api_key: data.api_key,
        api_secret: data.api_secret,
        access_token: data.access_token,
        is_active: data.is_active ? 1 : 0
      })
    });
    const result = await res.json();
    if (result.success) {
      toast.success(`${platform.toUpperCase()} settings saved!`);
      fetchSettings();
    } else {
      toast.error("Failed to save.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto pb-10">
      <Toaster />
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">SaaS Omnichannel Hub</h1>
        <p className="text-gray-400">Configure your API connections to external marketplaces to sync inventory in real-time.</p>
      </div>

      <div className="flex gap-4 border-b border-[#222] mb-6">
        <button 
          onClick={() => setActiveTab("platforms")}
          className={`px-4 py-2 font-semibold ${activeTab === "platforms" ? "text-[#00e676] border-b-2 border-[#00e676]" : "text-gray-400"}`}>
          Platforms & APIs
        </button>
        <button 
          onClick={() => setActiveTab("logs")}
          className={`px-4 py-2 font-semibold ${activeTab === "logs" ? "text-[#00e676] border-b-2 border-[#00e676]" : "text-gray-400"}`}>
          Sync Logs
        </button>
      </div>

      {activeTab === "platforms" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* SHOPIFY */}
          <div className="bg-[#111] border border-[#222] p-6 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2"><i className="fab fa-shopify text-[#95bf47]"></i> Shopify Integration</h2>
              <label className="flex items-center cursor-pointer">
                <input type="checkbox" checked={settings.shopify?.is_active === 1} onChange={(e) => setSettings({...settings, shopify: {...settings.shopify, is_active: e.target.checked ? 1 : 0}})} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-[#00e676] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
              </label>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Store Name (API Key)</label>
                <input type="text" value={settings.shopify?.api_key || ""} onChange={(e) => setSettings({...settings, shopify: {...settings.shopify, api_key: e.target.value}})} className="w-full bg-[#1a1a1a] border border-[#333] rounded px-3 py-2 text-white" placeholder="mystore" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Admin API Access Token</label>
                <input type="password" value={settings.shopify?.access_token || ""} onChange={(e) => setSettings({...settings, shopify: {...settings.shopify, access_token: e.target.value}})} className="w-full bg-[#1a1a1a] border border-[#333] rounded px-3 py-2 text-white" placeholder="shpat_..." />
              </div>
              <button onClick={() => handleUpdate("shopify")} className="w-full bg-[#00e676] text-black font-bold py-2 rounded">Save Shopify</button>
            </div>
          </div>

          {/* AMAZON */}
          <div className="bg-[#111] border border-[#222] p-6 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2"><i className="fab fa-amazon text-[#ff9900]"></i> Amazon SP-API</h2>
              <label className="flex items-center cursor-pointer">
                <input type="checkbox" checked={settings.amazon?.is_active === 1} onChange={(e) => setSettings({...settings, amazon: {...settings.amazon, is_active: e.target.checked ? 1 : 0}})} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-[#00e676] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
              </label>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Seller ID / API Key</label>
                <input type="text" value={settings.amazon?.api_key || ""} onChange={(e) => setSettings({...settings, amazon: {...settings.amazon, api_key: e.target.value}})} className="w-full bg-[#1a1a1a] border border-[#333] rounded px-3 py-2 text-white" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">SP-API Refresh Token</label>
                <input type="password" value={settings.amazon?.access_token || ""} onChange={(e) => setSettings({...settings, amazon: {...settings.amazon, access_token: e.target.value}})} className="w-full bg-[#1a1a1a] border border-[#333] rounded px-3 py-2 text-white" />
              </div>
              <button onClick={() => handleUpdate("amazon")} className="w-full bg-[#00e676] text-black font-bold py-2 rounded">Save Amazon</button>
            </div>
          </div>

          {/* META / FACEBOOK */}
          <div className="bg-[#111] border border-[#222] p-6 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2"><i className="fab fa-facebook text-[#1877f2]"></i> Meta Commerce</h2>
              <label className="flex items-center cursor-pointer">
                <input type="checkbox" checked={settings.meta?.is_active === 1} onChange={(e) => setSettings({...settings, meta: {...settings.meta, is_active: e.target.checked ? 1 : 0}})} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-[#00e676] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
              </label>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Catalog ID (API Key)</label>
                <input type="text" value={settings.meta?.api_key || ""} onChange={(e) => setSettings({...settings, meta: {...settings.meta, api_key: e.target.value}})} className="w-full bg-[#1a1a1a] border border-[#333] rounded px-3 py-2 text-white" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">System User Access Token</label>
                <input type="password" value={settings.meta?.access_token || ""} onChange={(e) => setSettings({...settings, meta: {...settings.meta, access_token: e.target.value}})} className="w-full bg-[#1a1a1a] border border-[#333] rounded px-3 py-2 text-white" />
              </div>
              <button onClick={() => handleUpdate("meta")} className="w-full bg-[#00e676] text-black font-bold py-2 rounded">Save Meta</button>
            </div>
          </div>

          {/* EBAY */}
          <div className="bg-[#111] border border-[#222] p-6 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2"><i className="fab fa-ebay text-[#e53238]"></i> eBay</h2>
              <label className="flex items-center cursor-pointer">
                <input type="checkbox" checked={settings.ebay?.is_active === 1} onChange={(e) => setSettings({...settings, ebay: {...settings.ebay, is_active: e.target.checked ? 1 : 0}})} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-[#00e676] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
              </label>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">App ID (Client ID)</label>
                <input type="text" value={settings.ebay?.api_key || ""} onChange={(e) => setSettings({...settings, ebay: {...settings.ebay, api_key: e.target.value}})} className="w-full bg-[#1a1a1a] border border-[#333] rounded px-3 py-2 text-white" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">OAuth Token</label>
                <input type="password" value={settings.ebay?.access_token || ""} onChange={(e) => setSettings({...settings, ebay: {...settings.ebay, access_token: e.target.value}})} className="w-full bg-[#1a1a1a] border border-[#333] rounded px-3 py-2 text-white" />
              </div>
              <button onClick={() => handleUpdate("ebay")} className="w-full bg-[#00e676] text-black font-bold py-2 rounded">Save eBay</button>
            </div>
          </div>

          {/* TIKTOK SHOP */}
          <div className="bg-[#111] border border-[#222] p-6 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2"><i className="fab fa-tiktok text-[#ff0050]"></i> TikTok Shop</h2>
              <label className="flex items-center cursor-pointer">
                <input type="checkbox" checked={settings.tiktok?.is_active === 1} onChange={(e) => setSettings({...settings, tiktok: {...settings.tiktok, is_active: e.target.checked ? 1 : 0}})} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-[#00e676] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
              </label>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">App Key</label>
                <input type="text" value={settings.tiktok?.api_key || ""} onChange={(e) => setSettings({...settings, tiktok: {...settings.tiktok, api_key: e.target.value}})} className="w-full bg-[#1a1a1a] border border-[#333] rounded px-3 py-2 text-white" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Access Token</label>
                <input type="password" value={settings.tiktok?.access_token || ""} onChange={(e) => setSettings({...settings, tiktok: {...settings.tiktok, access_token: e.target.value}})} className="w-full bg-[#1a1a1a] border border-[#333] rounded px-3 py-2 text-white" />
              </div>
              <button onClick={() => handleUpdate("tiktok")} className="w-full bg-[#00e676] text-black font-bold py-2 rounded">Save TikTok Shop</button>
            </div>
          </div>
        </div>
      )}

      {activeTab === "logs" && (
        <div className="bg-[#111] border border-[#222] rounded-xl overflow-hidden">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-[#1a1a1a] border-b border-[#333]">
              <tr>
                <th className="p-4">Time</th>
                <th className="p-4">Platform</th>
                <th className="p-4">Action</th>
                <th className="p-4">Target SKU/ID</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 ? (
                <tr><td colSpan="5" className="p-4 text-center text-gray-500">No sync logs found.</td></tr>
              ) : logs.map((log) => (
                <tr key={log.id} className="border-b border-[#222] hover:bg-[#151515]">
                  <td className="p-4">{new Date(log.created_at).toLocaleString()}</td>
                  <td className="p-4 capitalize font-semibold">{log.platform}</td>
                  <td className="p-4">{log.action}</td>
                  <td className="p-4">{log.target_id || "-"}</td>
                  <td className="p-4">
                    {log.status === "SUCCESS" ? (
                      <span className="bg-green-900 text-green-300 px-2 py-1 rounded text-xs font-bold">SUCCESS</span>
                    ) : (
                      <span className="bg-red-900 text-red-300 px-2 py-1 rounded text-xs font-bold">FAILED</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
