"use client";
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function TrackingForm() {
  const searchParams = useSearchParams();
  const initialPo = searchParams.get('po') || "";
  
  const [purchaseOrderId, setPurchaseOrderId] = useState(initialPo);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [carrier, setCarrier] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleManualTrack = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");
    
    try {
      const res = await fetch("/api/sourcing/tracking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ purchaseOrderId, trackingNumber, carrier })
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg("Tracking added successfully. 17TRACK webhook activated (simulated).");
        setTrackingNumber("");
      } else {
        setErrorMsg(data.error || "Failed to add tracking");
      }
    } catch (err) {
      setErrorMsg("Network error");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold font-display mb-6">Shipment Tracker</h1>

      <div className="bg-[#111] p-8 rounded-xl border border-[#222] shadow-xl">
        <h2 className="text-xl font-bold text-white mb-4">Manual Tracking Entry</h2>
        <p className="text-sm text-gray-400 mb-6">
          Since 17TRACK API key is pending, use this tool to manually input tracking numbers. This will update the order status and notify the customer via Email.
        </p>

        <form onSubmit={handleManualTrack} className="space-y-5">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Purchase Order ID</label>
            <input
              type="text"
              required
              value={purchaseOrderId}
              onChange={e => setPurchaseOrderId(e.target.value)}
              className="w-full bg-[#0d0d0d] border border-[#333] rounded-lg px-4 py-3 text-white focus:border-[#00e676] outline-none transition-all"
              placeholder="e.g. 5"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Tracking Number</label>
            <input
              type="text"
              required
              value={trackingNumber}
              onChange={e => setTrackingNumber(e.target.value)}
              className="w-full bg-[#0d0d0d] border border-[#333] rounded-lg px-4 py-3 text-white focus:border-[#00e676] outline-none transition-all font-mono"
              placeholder="e.g. YT23490823490"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Carrier (Optional)</label>
            <input
              type="text"
              value={carrier}
              onChange={e => setCarrier(e.target.value)}
              className="w-full bg-[#0d0d0d] border border-[#333] rounded-lg px-4 py-3 text-white focus:border-[#00e676] outline-none transition-all"
              placeholder="e.g. YunExpress"
            />
          </div>

          {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}
          {successMsg && <p className="text-[#00e676] text-sm">{successMsg}</p>}

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#00e676] text-black px-6 py-3 rounded-lg font-bold hover:bg-[#00c853] disabled:opacity-50 transition-all shadow-lg shadow-[#00e676]/20 flex justify-center items-center gap-2"
            >
              {loading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-paper-plane"></i>}
              {loading ? "Processing..." : "Add Tracking & Notify Customer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function TrackingPage() {
  return (
    <Suspense fallback={<div className="p-6 text-white text-center">Loading tracker...</div>}>
      <TrackingForm />
    </Suspense>
  );
}
