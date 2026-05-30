"use client";

import { useState, useEffect } from "react";

export default function MarketingPage() {
  const [campaigns, setCampaigns] = useState([]);
  const [activeTab, setActiveTab] = useState("campaigns");
  const [generatedCopy, setGeneratedCopy] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [productName, setProductName] = useState("");
  const [features, setFeatures] = useState("");
  const [audience, setAudience] = useState("");

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const res = await fetch("/api/marketing");
      const data = await res.json();
      if (data.success) {
        setCampaigns(data.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const createDummyCampaign = async () => {
    try {
      await fetch("/api/marketing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Summer Sale 2026 - Smart Watches",
          objective: "Conversions",
          budget: 500.00
        })
      });
      fetchCampaigns();
    } catch (e) {}
  };

  const generateAdCopy = async () => {
    if (!productName || !features || !audience) {
      alert("Please fill out all fields");
      return;
    }

    setIsGenerating(true);
    setGeneratedCopy(null);
    
    try {
      const res = await fetch("/api/marketing/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productName, features, audience })
      });
      const data = await res.json();
      if (data.success) {
        setGeneratedCopy(data.data);
      } else {
        alert(data.error || "Failed to generate ad copy.");
      }
    } catch (e) {
      console.error(e);
      alert("Something went wrong");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#111] p-6 rounded-2xl border border-[#222] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-white">AI Digital Marketing</h1>
          <p className="text-gray-400 text-sm mt-1">Manage ad campaigns, generate AI copywriting, and schedule social media posts.</p>
        </div>
        <button onClick={createDummyCampaign} className="bg-[#00e676] text-[#0d0d0d] px-4 py-2 rounded-xl text-sm font-bold hover:bg-[#00c853] transition-colors shadow-lg shadow-[#00e676]/20">
          + New Campaign
        </button>
      </div>

      <div className="flex gap-4 border-b border-[#222] pb-2">
        <button
          onClick={() => setActiveTab("campaigns")}
          className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
            activeTab === "campaigns" ? "bg-[#00e676]/10 text-[#00e676]" : "text-gray-400 hover:text-white"
          }`}
        >
          <i className="fas fa-bullhorn mr-2"></i> Ad Campaigns
        </button>
        <button
          onClick={() => setActiveTab("ai_copy")}
          className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
            activeTab === "ai_copy" ? "bg-[#00e676]/10 text-[#00e676]" : "text-gray-400 hover:text-white"
          }`}
        >
          <i className="fas fa-robot mr-2"></i> AI Copywriter
        </button>
        <button
          onClick={() => setActiveTab("scheduler")}
          className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
            activeTab === "scheduler" ? "bg-[#00e676]/10 text-[#00e676]" : "text-gray-400 hover:text-white"
          }`}
        >
          <i className="fas fa-calendar-alt mr-2"></i> Post Scheduler
        </button>
      </div>

      {activeTab === "campaigns" && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {campaigns.length === 0 ? (
            <p className="text-gray-500">No active campaigns. Click 'New Campaign' to start.</p>
          ) : (
            campaigns.map((camp) => (
              <div key={camp.id} className="bg-[#111] p-5 rounded-2xl border border-[#222] flex flex-col gap-3 hover:border-[#333] transition-colors relative overflow-hidden">
                <div className="absolute top-0 right-0 w-2 h-full bg-[#00e676]"></div>
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-bold text-white">{camp.name}</h3>
                </div>
                <div className="flex gap-2 mb-2">
                  <span className="bg-[#222] text-xs px-2 py-1 rounded text-gray-300">{camp.objective}</span>
                  <span className="bg-[#00e676]/10 text-[#00e676] text-xs px-2 py-1 rounded font-bold">{camp.status}</span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <p className="text-xs text-gray-500">Budget</p>
                    <p className="font-bold text-white">${camp.budget}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Spent</p>
                    <p className="font-bold text-white">$0.00</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Clicks</p>
                    <p className="font-bold text-white">0</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">ROAS</p>
                    <p className="font-bold text-[#00e676]">0.0x</p>
                  </div>
                </div>
                <button className="mt-4 w-full border border-[#333] text-gray-300 py-2 rounded-lg text-sm hover:bg-[#222] transition-colors">
                  View Analytics
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === "ai_copy" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-[#111] p-6 rounded-2xl border border-[#222]">
            <h3 className="text-lg font-bold text-white mb-4">Generate Ad Copy</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Product Name</label>
                <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="e.g. Smart Watch Series 8" className="w-full bg-[#050505] border border-[#333] rounded-xl px-4 py-2 text-white focus:border-[#00e676]" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Key Features/Benefits</label>
                <textarea rows="3" value={features} onChange={(e) => setFeatures(e.target.value)} placeholder="Fitness tracking, long battery life, waterproof..." className="w-full bg-[#050505] border border-[#333] rounded-xl px-4 py-2 text-white focus:border-[#00e676]"></textarea>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Target Audience</label>
                <input type="text" value={audience} onChange={(e) => setAudience(e.target.value)} placeholder="e.g. Fitness enthusiasts, tech lovers" className="w-full bg-[#050505] border border-[#333] rounded-xl px-4 py-2 text-white focus:border-[#00e676]" />
              </div>
              <button onClick={generateAdCopy} disabled={isGenerating} className="w-full bg-[#00e676] text-[#0d0d0d] px-4 py-3 rounded-xl font-bold hover:bg-[#00c853] transition-colors disabled:opacity-50">
                {isGenerating ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-magic"></i>} {isGenerating ? "Generating..." : "Generate AI Copy"}
              </button>
            </div>
          </div>

          <div className="bg-[#111] p-6 rounded-2xl border border-[#222]">
            <h3 className="text-lg font-bold text-white mb-4">AI Output</h3>
            {generatedCopy ? (
              <div className="space-y-4">
                <div className="bg-[#050505] p-4 rounded-xl border border-[#333]">
                  <p className="text-xs text-gray-500 mb-1">Headline</p>
                  <p className="font-bold text-white">{generatedCopy.headline}</p>
                </div>
                <div className="bg-[#050505] p-4 rounded-xl border border-[#333]">
                  <p className="text-xs text-gray-500 mb-1">Primary Text</p>
                  <p className="text-gray-300 text-sm whitespace-pre-wrap">{generatedCopy.primary_text}</p>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 bg-[#222] text-white py-2 rounded-lg text-sm hover:bg-[#333] border border-[#444]"><i className="fas fa-copy"></i> Copy</button>
                  <button className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm hover:bg-blue-700 font-bold"><i className="fab fa-facebook"></i> Send to Ads Manager</button>
                </div>
              </div>
            ) : (
              <div className="h-48 border border-dashed border-[#333] rounded-xl flex items-center justify-center text-gray-500 flex-col">
                <i className="fas fa-robot text-3xl mb-2"></i>
                <p>Fill out the details to generate ad copy.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "scheduler" && (
        <div className="bg-[#111] p-10 rounded-2xl border border-[#222] text-center">
          <i className="fas fa-calendar-alt text-4xl text-gray-500 mb-4"></i>
          <h3 className="text-xl font-bold text-white mb-2">Social Media Scheduler</h3>
          <p className="text-gray-400 max-w-md mx-auto">Connect your social accounts to schedule posts directly from the dashboard. Calendar view coming soon.</p>
          <button className="mt-6 bg-[#222] text-white px-6 py-2 rounded-xl text-sm hover:bg-[#333] transition-colors border border-[#444]">
            Connect Social Accounts
          </button>
        </div>
      )}
    </div>
  );
}
