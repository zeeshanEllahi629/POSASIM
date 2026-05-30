"use client";

import { useState, useEffect } from "react";

export default function AISettingsPage() {
  const [apiKey, setApiKey] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchApiKey();
  }, []);

  const fetchApiKey = async () => {
    try {
      const res = await fetch("/api/settings?key_name=openai_api_key");
      const data = await res.json();
      if (data.success && data.data) {
        setApiKey(data.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const saveApiKey = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage("");

    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key_name: "openai_api_key", value: apiKey })
      });
      const data = await res.json();
      
      if (data.success) {
        setMessage("API Key saved successfully!");
      } else {
        setMessage("Failed to save API Key.");
      }
    } catch (e) {
      console.error(e);
      setMessage("An error occurred.");
    } finally {
      setIsSaving(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="bg-[#111] p-6 rounded-2xl border border-[#222]">
        <h1 className="text-2xl font-bold font-display text-white">AI Configuration</h1>
        <p className="text-gray-400 text-sm mt-1">Configure your AI providers for the Digital Marketing and Sourcing agents.</p>
      </div>

      <div className="bg-[#111] p-6 rounded-2xl border border-[#222]">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <i className="fas fa-robot text-[#00e676]"></i> OpenAI Integration
        </h2>
        
        <form onSubmit={saveApiKey} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">OpenAI API Key (sk-...)</label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-..."
              className="w-full bg-[#050505] border border-[#333] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00e676] transition-colors font-mono"
            />
            <p className="text-xs text-gray-500 mt-2">
              This key is required to use the AI Copywriter and AI Sourcing Analyzer. 
              Your key is encrypted and stored securely in the database.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={isSaving}
              className="bg-[#00e676] text-[#0d0d0d] px-6 py-2 rounded-xl font-bold hover:bg-[#00c853] transition-all disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Save API Key"}
            </button>
            {message && <span className="text-sm font-bold text-[#00e676]">{message}</span>}
          </div>
        </form>
      </div>
    </div>
  );
}
