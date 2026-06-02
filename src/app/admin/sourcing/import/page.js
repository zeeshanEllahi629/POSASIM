"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ImportProductPage() {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [productData, setProductData] = useState(null);
  const [error, setError] = useState("");
  
  const [sellingPrice, setSellingPrice] = useState("");
  const [preferredAgent, setPreferredAgent] = useState("superbuy");

  const handleImport = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/sourcing/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url })
      });
      const data = await res.json();
      if (data.success) {
        setProductData(data);
        // auto-suggest price (demo margin 40%)
        if (data.productInfo?.priceRmb) {
          const usd = data.productInfo.priceRmb * 0.138;
          setSellingPrice((usd * 1.4).toFixed(2));
        }
      } else {
        setError(data.error || "Failed to import");
      }
    } catch (err) {
      setError("Network error");
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!productData) return;
    setLoading(true);
    try {
      const res = await fetch("/api/sourcing/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourceUrl: url,
          sourceType: productData.sourceType,
          agentUrl: productData.agentUrls[preferredAgent],
          preferredAgent,
          sourceName: productData.productInfo.title,
          sourceImages: productData.productInfo.images,
          sourcePriceRmb: productData.productInfo.priceRmb || 0,
          sellingPrice: parseFloat(sellingPrice) || 0,
          status: 'active'
        })
      });
      const data = await res.json();
      if (data.success) {
        router.push("/admin/sourcing");
      } else {
        setError(data.error || "Failed to save");
      }
    } catch (err) {
      setError("Network error");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold font-display mb-6">Import Product from China</h1>

      <div className="bg-[#111] p-6 rounded-xl border border-[#222] mb-6">
        <form onSubmit={handleImport} className="flex gap-4">
          <div className="flex-1">
            <input
              type="url"
              required
              placeholder="Paste 1688, Taobao, Tmall, or Agent URL here..."
              value={url}
              onChange={e => setUrl(e.target.value)}
              className="w-full bg-[#0d0d0d] border border-[#333] rounded-lg px-4 py-3 text-white focus:border-[#00e676] outline-none transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !url}
            className="bg-[#00e676] text-black px-6 py-3 rounded-lg font-bold hover:bg-[#00c853] disabled:opacity-50 transition-all shadow-lg shadow-[#00e676]/20"
          >
            {loading && !productData ? "Fetching..." : "Fetch Info"}
          </button>
        </form>
        {error && <p className="text-red-500 mt-3 text-sm">{error}</p>}
      </div>

      {productData && (
        <div className="bg-[#111] rounded-xl border border-[#222] overflow-hidden animate-fade-in">
          <div className="p-6 border-b border-[#222]">
            <h2 className="text-lg font-bold text-white mb-2">{productData.productInfo.title}</h2>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span className="bg-[#222] px-3 py-1 rounded-full text-xs">Source: {productData.sourceType.toUpperCase()}</span>
              {productData.productInfo.priceRmb && (
                <span className="text-yellow-500 font-bold">Cost: ¥{productData.productInfo.priceRmb}</span>
              )}
            </div>
          </div>

          <div className="p-6">
            <h3 className="font-semibold mb-3">Images Found</h3>
            <div className="flex gap-3 overflow-x-auto pb-4">
              {productData.productInfo.images.map((img, idx) => (
                <img key={idx} src={img} alt="Product" className="w-24 h-24 object-cover rounded-lg border border-[#333]" />
              ))}
              {productData.productInfo.images.length === 0 && <span className="text-gray-500 text-sm">No images scraped. (Use API or manual upload later)</span>}
            </div>

            <div className="grid grid-cols-2 gap-6 mt-6">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Preferred Sourcing Agent</label>
                <select
                  value={preferredAgent}
                  onChange={e => setPreferredAgent(e.target.value)}
                  className="w-full bg-[#0d0d0d] border border-[#333] rounded-lg px-4 py-2.5 text-white outline-none focus:border-[#00e676]"
                >
                  <option value="superbuy">Superbuy</option>
                  <option value="cssbuy">CSSBuy</option>
                  <option value="sugargoo">Sugargoo</option>
                  <option value="basetao">Basetao</option>
                  <option value="yoybuy">Yoybuy</option>
                  <option value="bhiner">Bhiner</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Suggested Selling Price (USD)</label>
                <div className="relative">
                  <span className="absolute left-4 top-2.5 text-gray-500">$</span>
                  <input
                    type="number"
                    step="0.01"
                    value={sellingPrice}
                    onChange={e => setSellingPrice(e.target.value)}
                    className="w-full bg-[#0d0d0d] border border-[#333] rounded-lg pl-8 pr-4 py-2.5 text-white focus:border-[#00e676] outline-none"
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                onClick={handleSave}
                disabled={loading}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
              >
                {loading ? "Saving..." : "Save to My Catalog"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
