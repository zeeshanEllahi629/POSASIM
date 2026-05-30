"use client";

import { useState, useEffect } from "react";

export default function SourcingPage() {
  const [keyword, setKeyword] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [recommendations, setRecommendations] = useState([]);

  // Fetch past sourcing recommendations
  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      const res = await fetch("/api/sourcing");
      const data = await res.json();
      if (data.success) {
        setRecommendations(data.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!keyword) return;
    setIsSearching(true);
    
    try {
      const res = await fetch("/api/sourcing/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword })
      });
      const data = await res.json();
      if (data.success) {
        setRecommendations([data.data, ...recommendations]);
        setKeyword("");
      } else {
        alert(data.error || "Analysis failed");
      }
    } catch (e) {
      console.error(e);
      alert("Something went wrong");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-[#111] p-6 rounded-2xl border border-[#222] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-white">Product Sourcing Agent</h1>
          <p className="text-gray-400 text-sm mt-1">Discover products from global suppliers and evaluate profitability using AI.</p>
        </div>
      </div>

      {/* Sourcing Agent Input */}
      <div className="bg-[#111] p-6 rounded-2xl border border-[#00e676]/30 relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#00e676] to-[#00c853]"></div>
        
        <form onSubmit={handleSearch} className="relative z-10 max-w-3xl">
          <label className="block text-sm font-semibold text-gray-300 mb-2">What product do you want to source?</label>
          <div className="flex gap-4">
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="e.g. Smart Watch, Bamboo Toothbrush, LED Strip Lights..."
              className="flex-1 bg-[#050505] border border-[#333] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00e676] transition-colors"
              disabled={isSearching}
            />
            <button
              type="submit"
              disabled={isSearching}
              className="bg-[#00e676] text-[#0d0d0d] px-6 py-3 rounded-xl font-bold hover:bg-[#00c853] transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {isSearching ? (
                <><i className="fas fa-spinner fa-spin"></i> Analyzing...</>
              ) : (
                <><i className="fas fa-magic"></i> Run AI Analysis</>
              )}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-3 flex items-center gap-2">
            <i className="fas fa-info-circle"></i> The agent will analyze demand, competition, and calculate estimated profit margins.
          </p>
        </form>
      </div>

      {/* Recommendations Grid */}
      <div>
        <h2 className="text-lg font-bold text-white mb-4">Sourcing Recommendations</h2>
        
        {recommendations.length === 0 ? (
          <div className="bg-[#111] p-10 rounded-2xl border border-[#222] text-center">
            <div className="w-16 h-16 bg-[#222] rounded-full flex items-center justify-center mx-auto mb-4 text-gray-500 text-2xl">
              <i className="fas fa-box-open"></i>
            </div>
            <h3 className="text-white font-bold mb-1">No products analyzed yet</h3>
            <p className="text-gray-400 text-sm">Enter a product keyword above to run your first AI sourcing analysis.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {recommendations.map((rec) => (
              <div key={rec.id} className="bg-[#111] p-6 rounded-2xl border border-[#222] hover:border-[#333] transition-all flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-[#00e676] font-display capitalize">{rec.keyword}</h3>
                  <span className="bg-[#222] text-white text-xs px-2 py-1 rounded font-mono">ID: {rec.id}</span>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-[#050505] p-3 rounded-xl border border-[#333] text-center">
                    <div className="text-xs text-gray-400 mb-1">Demand</div>
                    <div className="text-lg font-bold text-white">{rec.demand_score}/10</div>
                  </div>
                  <div className="bg-[#050505] p-3 rounded-xl border border-[#333] text-center">
                    <div className="text-xs text-gray-400 mb-1">Competition</div>
                    <div className="text-lg font-bold text-white">{rec.competition_score}/10</div>
                  </div>
                  <div className="bg-[#050505] p-3 rounded-xl border border-[#333] text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-8 h-8 bg-[#00e676]/10 rounded-bl-full"></div>
                    <div className="text-xs text-[#00e676] mb-1">Margin</div>
                    <div className="text-lg font-bold text-[#00e676]">{rec.estimated_margin}%</div>
                  </div>
                </div>

                <div className="flex-1 bg-[#050505] p-4 rounded-xl border border-[#333] mb-4">
                  <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <i className="fas fa-robot text-[#00e676]"></i> AI Analysis
                  </h4>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {rec.ai_analysis_summary}
                  </p>
                </div>

                <div className="flex justify-between items-center mt-auto">
                  <span className="text-xs font-bold px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    {rec.recommended_action}
                  </span>
                  <button className="text-[#00e676] hover:text-white text-sm font-bold transition-colors">
                    Find Suppliers <i className="fas fa-arrow-right ml-1"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
