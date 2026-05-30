"use client";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

export default function PaymentGatewaysPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const res = await fetch("/api/admin/payments");
      const data = await res.json();
      if (data.success) {
        setPayments(data.data);
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to load payment gateways");
    }
    setLoading(false);
  };

  const handleUpdate = async (payment) => {
    try {
      const res = await fetch("/api/admin/payments", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: payment.id,
          is_available: payment.is_available,
          environment: payment.environment,
          public_key: payment.public_key,
          secret_key: payment.secret_key,
        })
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`${payment.payment_name} settings updated!`);
      } else {
        toast.error(data.error || "Failed to update");
      }
    } catch (e) {
      toast.error("An error occurred");
    }
  };

  const handleChange = (id, field, value) => {
    setPayments(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  if (loading) {
    return <div className="p-8 text-white">Loading Gateways...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto pb-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Payment Gateways Setup</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {payments.map(payment => (
          <div key={payment.id} className={`bg-[#111] border ${payment.is_available ? 'border-[#00e676]' : 'border-[#333]'} rounded-xl p-6 relative overflow-hidden transition-all shadow-lg`}>
            {/* Header */}
            <div className="flex justify-between items-center mb-6 border-b border-[#222] pb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                {payment.payment_name === 'Stripe' && <i className="fa-brands fa-stripe text-indigo-400"></i>}
                {payment.payment_name === 'Paypal' && <i className="fa-brands fa-paypal text-blue-400"></i>}
                {payment.payment_name === 'Cash On Delivery' && <i className="fa-solid fa-money-bill-wave text-green-400"></i>}
                {payment.payment_name}
              </h2>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={payment.is_available === 1}
                  onChange={(e) => handleChange(payment.id, 'is_available', e.target.checked ? 1 : 0)}
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00e676]"></div>
              </label>
            </div>

            {/* Form Fields for APIs (Stripe/PayPal usually need keys) */}
            {(payment.payment_name === 'Stripe' || payment.payment_name === 'Paypal' || payment.payment_name === 'Razorpay') && (
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-xs text-gray-400 mb-1 font-semibold">Environment</label>
                  <select 
                    value={payment.environment}
                    onChange={(e) => handleChange(payment.id, 'environment', parseInt(e.target.value))}
                    className="w-full bg-[#1a1a1a] border border-[#333] text-white rounded px-3 py-2 text-sm focus:border-[#00e676] outline-none"
                  >
                    <option value={1}>Sandbox / Test</option>
                    <option value={2}>Production / Live</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1 font-semibold">Public Key / Client ID</label>
                  <input 
                    type="text" 
                    value={payment.public_key || ""}
                    onChange={(e) => handleChange(payment.id, 'public_key', e.target.value)}
                    className="w-full bg-[#1a1a1a] border border-[#333] text-white rounded px-3 py-2 text-sm focus:border-[#00e676] outline-none"
                    placeholder="pk_test_..."
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1 font-semibold">Secret Key</label>
                  <input 
                    type="password" 
                    value={payment.secret_key || ""}
                    onChange={(e) => handleChange(payment.id, 'secret_key', e.target.value)}
                    className="w-full bg-[#1a1a1a] border border-[#333] text-white rounded px-3 py-2 text-sm focus:border-[#00e676] outline-none"
                    placeholder="sk_test_..."
                  />
                </div>
              </div>
            )}

            {/* Description fallback for non-API gateways */}
            {payment.payment_name === 'Cash On Delivery' && (
              <div className="mb-6 text-sm text-gray-400 h-32">
                Enable this to allow customers to pay with cash when their order is delivered. No API keys required.
              </div>
            )}

            {/* Save Button */}
            <button 
              onClick={() => handleUpdate(payment)}
              className="w-full bg-[#222] hover:bg-[#00e676] text-white hover:text-black font-bold py-2 px-4 rounded transition-colors"
            >
              Save Settings
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
