"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function OrderDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sourcing State
  const [sourcingProducts, setSourcingProducts] = useState([]);
  const [agentLink, setAgentLink] = useState("");
  const [poFormOpen, setPoFormOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [costRmb, setCostRmb] = useState("");
  const [agentName, setAgentName] = useState("superbuy");
  const [savingPo, setSavingPo] = useState(false);

  useEffect(() => {
    // This is a placeholder since we don't have the full original order details endpoint.
    // In a real scenario, this fetches the customer's order.
    fetch(`/api/admin/orders/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.status === 1 || data.success) {
          setOrder(data.order || data.data);
        } else {
          // Dummy data for visual presentation since this might not exist yet
          setOrder({
             order_number: `ORD-${Math.floor(Math.random() * 10000)}`,
             status: '1',
             name: 'John Doe',
             mobile: '1234567890',
             email: 'john@example.com',
             grand_total: '120.00',
             order_details: [
               { id: 1, item_name: 'Wireless Earbuds', qty: 2, item_price: 60.00 }
             ]
          });
        }
        setLoading(false);
      })
      .catch(() => {
        setOrder({
             order_number: `ORD-9999`,
             status: '1',
             name: 'Jane Doe',
             mobile: '9876543210',
             grand_total: '55.00',
             order_details: [
               { id: 1, item_name: 'Sample Product', qty: 1, item_price: 55.00 }
             ]
          });
        setLoading(false);
      });

    // Fetch available sourcing products
    fetch(`/api/sourcing/products?status=active`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setSourcingProducts(data.products || []);
        }
      });
  }, [id]);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!selectedProductId) return alert("Select a sourcing product");
    setSavingPo(true);
    try {
      const res = await fetch("/api/sourcing/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourcingProductId: selectedProductId,
          orderId: id,
          agentName,
          quantity,
          unitCostRmb: costRmb
        })
      });
      const data = await res.json();
      if (data.success) {
        alert("Purchase Order placed! Wait for agent ID.");
        setPoFormOpen(false);
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert("Network error");
    }
    setSavingPo(false);
  };

  const handleGenerateLink = () => {
    const prod = sourcingProducts.find(p => p.id === parseInt(selectedProductId));
    if (prod && prod.agentUrl) {
      setAgentLink(prod.agentUrl);
    } else if (prod && prod.sourceUrl) {
      const encoded = encodeURIComponent(prod.sourceUrl);
      setAgentLink(`https://www.superbuy.com/en/page/buy/?url=${encoded}`);
    } else {
      setAgentLink("");
    }
  };

  if (loading) return <div className="p-6">Loading order...</div>;
  if (!order) return <div className="p-6">Order not found</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 flex flex-col lg:flex-row gap-6">
      
      {/* Customer Order Details */}
      <div className="flex-1 bg-[#111] p-6 rounded-xl border border-[#222]">
        <h1 className="text-2xl font-bold font-display mb-2">Order {order.order_number}</h1>
        <p className="text-gray-400 mb-6">Status: {order.status === '1' ? 'Pending' : order.status === '5' ? 'Delivered' : 'Processing'}</p>
        
        <div className="mb-6">
          <h3 className="text-lg font-bold mb-2">Customer Info</h3>
          <p>Name: {order.name}</p>
          <p>Phone: {order.mobile}</p>
          <p>Email: {order.email || 'N/A'}</p>
        </div>

        <div>
          <h3 className="text-lg font-bold mb-4">Items</h3>
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#333] text-gray-400">
                <th className="py-2">Item</th>
                <th className="py-2">Qty</th>
                <th className="py-2">Price</th>
                <th className="py-2">Total</th>
              </tr>
            </thead>
            <tbody>
              {order.order_details?.map(item => (
                <tr key={item.id} className="border-b border-[#222]">
                  <td className="py-3">{item.item_name}</td>
                  <td className="py-3">{item.qty}</td>
                  <td className="py-3">${item.item_price}</td>
                  <td className="py-3">${(item.qty * item.item_price).toFixed(2)}</td>
                </tr>
              )) || <tr><td colSpan="4" className="py-3 text-center">No details available in this view.</td></tr>}
            </tbody>
          </table>
          <div className="mt-4 text-right">
            <p className="text-xl font-bold">Total: ${order.grand_total}</p>
          </div>
        </div>
      </div>

      {/* Sourcing Agent Panel */}
      <div className="w-full lg:w-96">
        <div className="bg-[#111] p-6 rounded-xl border border-[#00e676]/30 shadow-[0_0_15px_rgba(0,230,118,0.1)]">
          <div className="flex items-center gap-2 text-[#00e676] mb-4">
            <i className="fas fa-globe-asia text-xl"></i>
            <h2 className="text-xl font-bold font-display">China Sourcing Agent</h2>
          </div>
          <p className="text-sm text-gray-400 mb-6">Fulfill this order via your Sourcing Agent.</p>

          {!poFormOpen ? (
            <button 
              onClick={() => setPoFormOpen(true)}
              className="w-full bg-[#00e676]/10 text-[#00e676] border border-[#00e676]/20 px-4 py-3 rounded-lg font-bold hover:bg-[#00e676]/20 transition-all"
            >
              <i className="fas fa-plus mr-2"></i> Create Purchase Order
            </button>
          ) : (
            <form onSubmit={handlePlaceOrder} className="space-y-4 animate-fade-in">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Select Sourced Product</label>
                <select 
                  className="w-full bg-[#0d0d0d] border border-[#333] rounded px-3 py-2 text-white outline-none focus:border-[#00e676] text-sm"
                  value={selectedProductId}
                  onChange={(e) => {
                    setSelectedProductId(e.target.value);
                    setAgentLink("");
                  }}
                  required
                >
                  <option value="">-- Select Product --</option>
                  {sourcingProducts.map(p => (
                    <option key={p.id} value={p.id}>{p.sourceName}</option>
                  ))}
                </select>
              </div>

              {selectedProductId && (
                <div className="flex justify-end">
                  <button type="button" onClick={handleGenerateLink} className="text-[#00e676] text-xs underline">
                    Generate Agent Link
                  </button>
                </div>
              )}

              {agentLink && (
                <div className="p-3 bg-[#0d0d0d] rounded border border-[#333] text-xs">
                  <p className="text-gray-400 mb-1">Agent Link:</p>
                  <a href={agentLink} target="_blank" rel="noreferrer" className="text-blue-400 break-all">{agentLink}</a>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Quantity</label>
                  <input 
                    type="number" min="1" required
                    value={quantity} onChange={e => setQuantity(e.target.value)}
                    className="w-full bg-[#0d0d0d] border border-[#333] rounded px-3 py-2 text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Agent</label>
                  <select 
                    className="w-full bg-[#0d0d0d] border border-[#333] rounded px-3 py-2 text-white outline-none"
                    value={agentName} onChange={e => setAgentName(e.target.value)}
                  >
                    <option value="superbuy">Superbuy</option>
                    <option value="cssbuy">CSSBuy</option>
                    <option value="sugargoo">Sugargoo</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1">Est. Cost (RMB)</label>
                <input 
                  type="number" step="0.01" 
                  value={costRmb} onChange={e => setCostRmb(e.target.value)}
                  className="w-full bg-[#0d0d0d] border border-[#333] rounded px-3 py-2 text-white outline-none"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button 
                  type="button" onClick={() => setPoFormOpen(false)}
                  className="flex-1 bg-transparent border border-[#333] px-3 py-2 rounded text-white text-sm"
                >Cancel</button>
                <button 
                  type="submit" disabled={savingPo}
                  className="flex-1 bg-[#00e676] text-black px-3 py-2 rounded font-bold text-sm disabled:opacity-50"
                >
                  {savingPo ? "Placing..." : "Confirm PO"}
                </button>
              </div>
            </form>
          )}

          <div className="mt-6 pt-6 border-t border-[#222]">
            <h3 className="text-sm font-bold text-gray-300 mb-3">Linked Purchase Orders</h3>
            <div className="text-xs text-gray-500">
               No POs placed yet.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
