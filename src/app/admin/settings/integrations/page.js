"use client";

import { useState, useEffect } from "react";

export default function IntegrationsSettingsPage() {
  const [activeTab, setActiveTab] = useState("ai");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  // AI Keys
  const [openaiKey, setOpenaiKey] = useState("");
  const [geminiKey, setGeminiKey] = useState("");

  // Marketplace Keys
  const [shopifyToken, setShopifyToken] = useState("");
  const [shopifyStoreUrl, setShopifyStoreUrl] = useState("");
  const [amazonSpApi, setAmazonSpApi] = useState("");

  // Logistics Keys
  const [shipstationKey, setShipstationKey] = useState("");
  const [dhlKey, setDhlKey] = useState("");

  // Social Media Keys
  const [facebookGraphKey, setFacebookGraphKey] = useState("");

  // Sourcing Keys
  const [alibabaKey, setAlibabaKey] = useState("");
  const [aliexpressKey, setAliexpressKey] = useState("");

  // Payment Keys
  const [stripeSecret, setStripeSecret] = useState("");
  const [paypalClient, setPaypalClient] = useState("");

  useEffect(() => {
    fetchKeys();
  }, []);

  const fetchKeys = async () => {
    try {
      const keysToFetch = [
        "openai_api_key", "gemini_api_key", 
        "shopify_access_token", "shopify_store_url", "amazon_sp_api_key",
        "shipstation_api_key", "dhl_api_key",
        "facebook_graph_api_key",
        "alibaba_api_key", "aliexpress_api_key",
        "stripe_secret_key", "paypal_client_id"
      ];
      
      for (const key of keysToFetch) {
        const res = await fetch(`/api/settings?key_name=${key}`);
        const data = await res.json();
        if (data.success && data.data) {
          if (key === "openai_api_key") setOpenaiKey(data.data);
          if (key === "gemini_api_key") setGeminiKey(data.data);
          if (key === "shopify_access_token") setShopifyToken(data.data);
          if (key === "shopify_store_url") setShopifyStoreUrl(data.data);
          if (key === "amazon_sp_api_key") setAmazonSpApi(data.data);
          if (key === "shipstation_api_key") setShipstationKey(data.data);
          if (key === "dhl_api_key") setDhlKey(data.data);
          if (key === "facebook_graph_api_key") setFacebookGraphKey(data.data);
          if (key === "alibaba_api_key") setAlibabaKey(data.data);
          if (key === "aliexpress_api_key") setAliexpressKey(data.data);
          if (key === "stripe_secret_key") setStripeSecret(data.data);
          if (key === "paypal_client_id") setPaypalClient(data.data);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const saveKey = async (key_name, value) => {
    try {
      await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key_name, value })
      });
    } catch (e) {
      console.error("Failed to save", key_name);
    }
  };

  const showSuccess = (msg) => {
    setMessage(msg);
    setIsSaving(false);
    setTimeout(() => setMessage(""), 3000);
  };

  const handleSaveAI = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    await saveKey("openai_api_key", openaiKey);
    await saveKey("gemini_api_key", geminiKey);
    showSuccess("AI Keys saved successfully!");
  };

  const handleSaveMarketplace = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    await saveKey("shopify_access_token", shopifyToken);
    await saveKey("shopify_store_url", shopifyStoreUrl);
    await saveKey("amazon_sp_api_key", amazonSpApi);
    showSuccess("Marketplace Keys saved successfully!");
  };

  const handleSaveLogistics = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    await saveKey("shipstation_api_key", shipstationKey);
    await saveKey("dhl_api_key", dhlKey);
    showSuccess("Logistics Keys saved successfully!");
  };

  const handleSaveSocial = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    await saveKey("facebook_graph_api_key", facebookGraphKey);
    showSuccess("Social Media Keys saved successfully!");
  };

  const handleSaveSourcing = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    await saveKey("alibaba_api_key", alibabaKey);
    await saveKey("aliexpress_api_key", aliexpressKey);
    showSuccess("Sourcing API Keys saved successfully!");
  };

  const handleSavePayment = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    await saveKey("stripe_secret_key", stripeSecret);
    await saveKey("paypal_client_id", paypalClient);
    showSuccess("Payment Gateway Keys saved successfully!");
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="bg-[#111] p-6 rounded-2xl border border-[#222]">
        <h1 className="text-2xl font-bold font-display text-white">API & Integrations</h1>
        <p className="text-gray-400 text-sm mt-1">Manage API keys and account details for all external services connected to your ERP.</p>
      </div>

      <div className="flex gap-4 border-b border-[#222] pb-2 overflow-x-auto">
        <button onClick={() => setActiveTab("ai")} className={`px-4 py-2 rounded-lg font-bold text-sm whitespace-nowrap transition-all ${activeTab === "ai" ? "bg-[#00e676]/10 text-[#00e676]" : "text-gray-400 hover:text-white"}`}>
          <i className="fas fa-brain mr-2"></i> AI Providers
        </button>
        <button onClick={() => setActiveTab("sourcing")} className={`px-4 py-2 rounded-lg font-bold text-sm whitespace-nowrap transition-all ${activeTab === "sourcing" ? "bg-[#00e676]/10 text-[#00e676]" : "text-gray-400 hover:text-white"}`}>
          <i className="fas fa-globe-asia mr-2"></i> Sourcing
        </button>
        <button onClick={() => setActiveTab("marketplaces")} className={`px-4 py-2 rounded-lg font-bold text-sm whitespace-nowrap transition-all ${activeTab === "marketplaces" ? "bg-[#00e676]/10 text-[#00e676]" : "text-gray-400 hover:text-white"}`}>
          <i className="fas fa-store mr-2"></i> Marketplaces
        </button>
        <button onClick={() => setActiveTab("logistics")} className={`px-4 py-2 rounded-lg font-bold text-sm whitespace-nowrap transition-all ${activeTab === "logistics" ? "bg-[#00e676]/10 text-[#00e676]" : "text-gray-400 hover:text-white"}`}>
          <i className="fas fa-shipping-fast mr-2"></i> Logistics
        </button>
        <button onClick={() => setActiveTab("social")} className={`px-4 py-2 rounded-lg font-bold text-sm whitespace-nowrap transition-all ${activeTab === "social" ? "bg-[#00e676]/10 text-[#00e676]" : "text-gray-400 hover:text-white"}`}>
          <i className="fas fa-hashtag mr-2"></i> Social Media
        </button>
        <button onClick={() => setActiveTab("payments")} className={`px-4 py-2 rounded-lg font-bold text-sm whitespace-nowrap transition-all ${activeTab === "payments" ? "bg-[#00e676]/10 text-[#00e676]" : "text-gray-400 hover:text-white"}`}>
          <i className="fas fa-credit-card mr-2"></i> Payments
        </button>
      </div>

      {activeTab === "ai" && (
        <form onSubmit={handleSaveAI} className="bg-[#111] p-6 rounded-2xl border border-[#222] space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><i className="fas fa-robot text-[#00e676]"></i> OpenAI</h2>
            <label className="block text-sm text-gray-400 mb-2">API Key (sk-...)</label>
            <input type="password" value={openaiKey} onChange={(e) => setOpenaiKey(e.target.value)} placeholder="sk-..." className="w-full bg-[#050505] border border-[#333] rounded-xl px-4 py-3 text-white focus:border-[#00e676] font-mono" />
            <p className="text-xs text-gray-500 mt-2">Required for Product Sourcing Analysis and AI Ad Copywriting.</p>
          </div>
          <div>
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><i className="fas fa-sparkles text-blue-500"></i> Google Gemini (Optional)</h2>
            <label className="block text-sm text-gray-400 mb-2">API Key</label>
            <input type="password" value={geminiKey} onChange={(e) => setGeminiKey(e.target.value)} placeholder="AIzaSy..." className="w-full bg-[#050505] border border-[#333] rounded-xl px-4 py-3 text-white focus:border-[#00e676] font-mono" />
          </div>
          <div className="flex items-center gap-4 pt-4 border-t border-[#222]">
            <button type="submit" disabled={isSaving} className="bg-[#00e676] text-[#0d0d0d] px-6 py-2 rounded-xl font-bold hover:bg-[#00c853]">Save AI Keys</button>
            {message && <span className="text-[#00e676] text-sm font-bold">{message}</span>}
          </div>
        </form>
      )}

      {activeTab === "sourcing" && (
        <form onSubmit={handleSaveSourcing} className="bg-[#111] p-6 rounded-2xl border border-[#222] space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><i className="fas fa-shopping-bag text-[#FF6A00]"></i> Alibaba API</h2>
            <label className="block text-sm text-gray-400 mb-2">Alibaba Open Platform App Key</label>
            <input type="password" value={alibabaKey} onChange={(e) => setAlibabaKey(e.target.value)} placeholder="..." className="w-full bg-[#050505] border border-[#333] rounded-xl px-4 py-3 text-white focus:border-[#00e676] font-mono" />
            <p className="text-xs text-gray-500 mt-2">Required for fetching B2B supplier products and dropshipping integration.</p>
          </div>
          <div>
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><i className="fas fa-shopping-cart text-[#FF4747]"></i> AliExpress API</h2>
            <label className="block text-sm text-gray-400 mb-2">AliExpress Affiliate / Dropshipping API Key</label>
            <input type="password" value={aliexpressKey} onChange={(e) => setAliexpressKey(e.target.value)} placeholder="..." className="w-full bg-[#050505] border border-[#333] rounded-xl px-4 py-3 text-white focus:border-[#00e676] font-mono" />
          </div>
          <div className="flex items-center gap-4 pt-4 border-t border-[#222]">
            <button type="submit" disabled={isSaving} className="bg-[#00e676] text-[#0d0d0d] px-6 py-2 rounded-xl font-bold hover:bg-[#00c853]">Save Sourcing Keys</button>
            {message && <span className="text-[#00e676] text-sm font-bold">{message}</span>}
          </div>
        </form>
      )}

      {activeTab === "marketplaces" && (
        <form onSubmit={handleSaveMarketplace} className="bg-[#111] p-6 rounded-2xl border border-[#222] space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><i className="fab fa-shopify text-[#95BF47]"></i> Shopify Integration</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Store URL</label>
                <input type="text" value={shopifyStoreUrl} onChange={(e) => setShopifyStoreUrl(e.target.value)} placeholder="my-store.myshopify.com" className="w-full bg-[#050505] border border-[#333] rounded-xl px-4 py-3 text-white focus:border-[#00e676]" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Admin API Access Token</label>
                <input type="password" value={shopifyToken} onChange={(e) => setShopifyToken(e.target.value)} placeholder="shpat_..." className="w-full bg-[#050505] border border-[#333] rounded-xl px-4 py-3 text-white focus:border-[#00e676] font-mono" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Required for inventory syncing and automatic order imports.</p>
          </div>
          <div>
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><i className="fab fa-amazon text-[#FF9900]"></i> Amazon SP-API (Optional)</h2>
            <label className="block text-sm text-gray-400 mb-2">Selling Partner API Token</label>
            <input type="password" value={amazonSpApi} onChange={(e) => setAmazonSpApi(e.target.value)} placeholder="..." className="w-full bg-[#050505] border border-[#333] rounded-xl px-4 py-3 text-white focus:border-[#00e676] font-mono" />
          </div>
          <div className="flex items-center gap-4 pt-4 border-t border-[#222]">
            <button type="submit" disabled={isSaving} className="bg-[#00e676] text-[#0d0d0d] px-6 py-2 rounded-xl font-bold hover:bg-[#00c853]">Save Marketplace Keys</button>
            {message && <span className="text-[#00e676] text-sm font-bold">{message}</span>}
          </div>
        </form>
      )}

      {activeTab === "logistics" && (
        <form onSubmit={handleSaveLogistics} className="bg-[#111] p-6 rounded-2xl border border-[#222] space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><i className="fas fa-box text-blue-400"></i> ShipStation Integration</h2>
            <label className="block text-sm text-gray-400 mb-2">API Key & Secret (Base64)</label>
            <input type="password" value={shipstationKey} onChange={(e) => setShipstationKey(e.target.value)} placeholder="Basic ..." className="w-full bg-[#050505] border border-[#333] rounded-xl px-4 py-3 text-white focus:border-[#00e676] font-mono" />
            <p className="text-xs text-gray-500 mt-2">Allows auto-generation of shipping labels.</p>
          </div>
          <div>
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><i className="fas fa-plane-departure text-yellow-500"></i> DHL Express API (Optional)</h2>
            <label className="block text-sm text-gray-400 mb-2">DHL Developer Key</label>
            <input type="password" value={dhlKey} onChange={(e) => setDhlKey(e.target.value)} placeholder="..." className="w-full bg-[#050505] border border-[#333] rounded-xl px-4 py-3 text-white focus:border-[#00e676] font-mono" />
          </div>
          <div className="flex items-center gap-4 pt-4 border-t border-[#222]">
            <button type="submit" disabled={isSaving} className="bg-[#00e676] text-[#0d0d0d] px-6 py-2 rounded-xl font-bold hover:bg-[#00c853]">Save Logistics Keys</button>
            {message && <span className="text-[#00e676] text-sm font-bold">{message}</span>}
          </div>
        </form>
      )}

      {activeTab === "social" && (
        <form onSubmit={handleSaveSocial} className="bg-[#111] p-6 rounded-2xl border border-[#222] space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><i className="fab fa-facebook text-[#1877F2]"></i> Meta Graph API</h2>
            <label className="block text-sm text-gray-400 mb-2">Facebook / Instagram Page Access Token</label>
            <input type="password" value={facebookGraphKey} onChange={(e) => setFacebookGraphKey(e.target.value)} placeholder="EAA..." className="w-full bg-[#050505] border border-[#333] rounded-xl px-4 py-3 text-white focus:border-[#00e676] font-mono" />
            <p className="text-xs text-gray-500 mt-2">Required for Auto-Publishing AI Ads from the Scheduler.</p>
          </div>
          <div className="flex items-center gap-4 pt-4 border-t border-[#222]">
            <button type="submit" disabled={isSaving} className="bg-[#00e676] text-[#0d0d0d] px-6 py-2 rounded-xl font-bold hover:bg-[#00c853]">Save Social Keys</button>
            {message && <span className="text-[#00e676] text-sm font-bold">{message}</span>}
          </div>
        </form>
      )}

      {activeTab === "payments" && (
        <form onSubmit={handleSavePayment} className="bg-[#111] p-6 rounded-2xl border border-[#222] space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><i className="fab fa-stripe text-[#635BFF]"></i> Stripe API</h2>
            <label className="block text-sm text-gray-400 mb-2">Stripe Secret Key</label>
            <input type="password" value={stripeSecret} onChange={(e) => setStripeSecret(e.target.value)} placeholder="sk_live_..." className="w-full bg-[#050505] border border-[#333] rounded-xl px-4 py-3 text-white focus:border-[#00e676] font-mono" />
            <p className="text-xs text-gray-500 mt-2">Required for processing B2B and consumer payments directly.</p>
          </div>
          <div>
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><i className="fab fa-paypal text-[#003087]"></i> PayPal REST API (Optional)</h2>
            <label className="block text-sm text-gray-400 mb-2">PayPal Client ID</label>
            <input type="password" value={paypalClient} onChange={(e) => setPaypalClient(e.target.value)} placeholder="..." className="w-full bg-[#050505] border border-[#333] rounded-xl px-4 py-3 text-white focus:border-[#00e676] font-mono" />
          </div>
          <div className="flex items-center gap-4 pt-4 border-t border-[#222]">
            <button type="submit" disabled={isSaving} className="bg-[#00e676] text-[#0d0d0d] px-6 py-2 rounded-xl font-bold hover:bg-[#00c853]">Save Payment Keys</button>
            {message && <span className="text-[#00e676] text-sm font-bold">{message}</span>}
          </div>
        </form>
      )}

    </div>
  );
}
