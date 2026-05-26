"use client";

import { useState } from "react";

export default function CmsClient({ initialData, error }) {
  const [activeTab, setActiveTab] = useState("privacypolicy");
  const [formData, setFormData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const tabs = [
    { id: "privacypolicy", label: "Privacy Policy", icon: "fa-user-shield" },
    { id: "termscondition", label: "Terms & Conditions", icon: "fa-file-contract" },
    { id: "refundpolicy", label: "Refund Policy", icon: "fa-undo" },
    { id: "aboutus", label: "About Us", icon: "fa-info-circle" },
  ];

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await fetch("/api/admin/cms", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: activeTab,
          content: formData[activeTab],
        }),
      });

      const data = await res.json();
      if (data.status === 1) {
        setMessage({ type: "success", text: "Content updated successfully!" });
      } else {
        setMessage({ type: "error", text: data.error || "Failed to update." });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Connection error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/30 text-[#ff1744] text-xs">
          {error}
        </div>
      )}

      {message.text && (
        <div className={`p-4 rounded-xl border text-xs ${
          message.type === "success" 
            ? "bg-green-950/20 border-green-500/30 text-[#00e676]"
            : "bg-red-950/20 border-red-500/30 text-[#ff1744]"
        }`}>
          {message.text}
        </div>
      )}

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-[#222] pb-4 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setMessage({ type: "", text: "" });
            }}
            className={`px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? "bg-[#00e676] text-[#0d0d0d] shadow-lg shadow-[#00e676]/10"
                : "bg-[#111] text-gray-400 hover:bg-[#1a1a1a] border border-[#222]"
            }`}
          >
            <i className={`fas ${tab.icon}`}></i> {tab.label}
          </button>
        ))}
      </div>

      {/* Editor Area */}
      <div className="bg-[#111]/80 border border-[#222] rounded-2xl p-6 shadow-xl">
        <form onSubmit={handleSave} className="space-y-4">
          <div className="form-group">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
              {tabs.find((t) => t.id === activeTab)?.label} Content
            </label>
            <textarea
              required
              rows="15"
              value={formData[activeTab]}
              onChange={(e) => setFormData({ ...formData, [activeTab]: e.target.value })}
              className="w-full px-4 py-3 bg-[#050505] border border-[#222] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#00e676]/50 text-sm font-mono"
              placeholder={`Enter HTML or text for ${tabs.find((t) => t.id === activeTab)?.label}...`}
            ></textarea>
          </div>

          <div className="pt-4 border-t border-[#222] flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-[#00e676] text-[#0d0d0d] hover:bg-[#00c853] py-2.5 px-6 rounded-xl font-bold text-sm tracking-wide transition-all shadow-lg shadow-[#00e676]/10 flex items-center justify-center gap-2"
            >
              {loading ? <i className="fas fa-spinner fa-spin"></i> : <><i className="fas fa-save"></i> Save Changes</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
