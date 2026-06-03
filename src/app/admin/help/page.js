"use client";

import { useState } from "react";
import Link from "next/link";

export default function AdminHelp() {
  const [activeTab, setActiveTab] = useState("api");

  return (
    <div className="bg-[#050505] min-h-screen p-8 text-white">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-4xl font-extrabold text-white uppercase tracking-tight flex items-center gap-3">
            <i className="fa-solid fa-circle-question text-blue-500"></i>
            Help & Integration Guide
          </h1>
          <p className="text-gray-400 mt-2 text-lg">Comprehensive documentation for connecting and configuring Foodefy.</p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#222] mb-8 overflow-x-auto scrollbar-hide">
          {[
            { id: "api", label: "REST APIs", icon: "fa-code" },
            { id: "printer", label: "POS Printer", icon: "fa-print" },
            { id: "payment", label: "Payment Gateways", icon: "fa-credit-card" },
            { id: "import", label: "CSV Import/Export", icon: "fa-file-csv" },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 font-bold text-sm uppercase tracking-wider transition-colors border-b-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-500 bg-blue-500/10"
                  : "border-transparent text-gray-500 hover:text-white hover:bg-[#111]"
              }`}
            >
              <i className={`fa-solid ${tab.icon}`}></i>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-[#111] border border-[#222] rounded-2xl p-8 shadow-xl">
          {activeTab === "api" && (
            <div className="animate-[fadeInUp_0.5s_ease-out]">
              <h2 className="text-2xl font-bold mb-4 text-blue-400 border-b border-[#222] pb-2">REST API Endpoints</h2>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Use these endpoints to connect the backend with any external frontend, mobile app, or third-party service.
                Authentication is managed via JWT. Pass the token in the <code className="bg-[#222] px-2 py-1 rounded text-red-400">Authorization: Bearer &lt;token&gt;</code> header.
              </p>

              <div className="space-y-6">
                {/* API Item */}
                <div className="bg-[#1a1a1a] p-5 rounded-xl border border-[#333] hover:border-gray-500 transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="bg-green-600 text-white font-bold px-3 py-1 rounded text-xs uppercase tracking-wider">GET</span>
                    <code className="text-lg font-mono text-gray-300">/api/products</code>
                  </div>
                  <p className="text-sm text-gray-400 mb-2">Fetch all active products and their variations. Useful for building a custom menu interface.</p>
                </div>

                <div className="bg-[#1a1a1a] p-5 rounded-xl border border-[#333] hover:border-gray-500 transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="bg-blue-600 text-white font-bold px-3 py-1 rounded text-xs uppercase tracking-wider">POST</span>
                    <code className="text-lg font-mono text-gray-300">/api/checkout</code>
                  </div>
                  <p className="text-sm text-gray-400 mb-2">Submit a new order. Payload should include <code className="text-red-400">formData</code> and <code className="text-red-400">cartItems</code> arrays.</p>
                </div>

                <div className="bg-[#1a1a1a] p-5 rounded-xl border border-[#333] hover:border-gray-500 transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="bg-yellow-600 text-black font-bold px-3 py-1 rounded text-xs uppercase tracking-wider">PUT</span>
                    <code className="text-lg font-mono text-gray-300">/api/orders/:id/status</code>
                  </div>
                  <p className="text-sm text-gray-400 mb-2">Update order status (e.g., from Processing to Delivered). Requires Admin or Staff token.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "printer" && (
            <div className="animate-[fadeInUp_0.5s_ease-out]">
              <h2 className="text-2xl font-bold mb-4 text-green-400 border-b border-[#222] pb-2">POS Thermal Printer Setup</h2>
              <div className="space-y-6 text-gray-300 leading-relaxed">
                <p>
                  Foodefy is optimized for <strong>80mm Thermal Receipt Printers</strong>. Follow these instructions to enable silent background printing on your POS terminal without showing the browser print dialog.
                </p>
                
                <div className="bg-blue-900/20 border border-blue-800 p-5 rounded-xl">
                  <h3 className="font-bold text-blue-400 mb-2">1. Install Chrome Extension (Recommended)</h3>
                  <p className="text-sm">
                    For completely silent printing, install an extension like <em>QZ Tray</em> or enable Chrome's Kiosk Mode. <br/><br/>
                    <strong>Kiosk Mode Shortcut Target:</strong><br/>
                    <code className="bg-black p-2 block mt-2 rounded border border-[#333] text-green-400">"C:\Program Files\Google\Chrome\Application\chrome.exe" --kiosk --kiosk-printing http://your-domain.com/admin/pos</code>
                  </p>
                </div>

                <div className="bg-[#1a1a1a] border border-[#333] p-5 rounded-xl">
                  <h3 className="font-bold text-white mb-2">2. Receipt Styles (80mm)</h3>
                  <p className="text-sm text-gray-400">
                    The POS Receipt page (<code className="text-red-400">/admin/pos/receipt/[id]</code>) automatically uses CSS <code className="text-red-400">@media print</code> queries tailored for 80mm width. Ensure your printer margins are set to "None" in the browser settings.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "payment" && (
            <div className="animate-[fadeInUp_0.5s_ease-out]">
              <h2 className="text-2xl font-bold mb-4 text-orange-400 border-b border-[#222] pb-2">Payment Gateways Configuration</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#1a1a1a] p-6 rounded-xl border border-[#333]">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg text-white">Stripe Integration</h3>
                    <i className="fa-brands fa-stripe text-3xl text-indigo-500"></i>
                  </div>
                  <p className="text-sm text-gray-400 mb-4">
                    Used for frontend credit card processing. Ensure you add your webhook endpoint to Stripe Dashboard.
                  </p>
                  <ul className="text-sm text-gray-500 space-y-2 list-disc list-inside">
                    <li>Go to <Link href="/admin/payment-gateways" className="text-blue-400 hover:underline">Payment Gateways</Link></li>
                    <li>Enter Publishable Key</li>
                    <li>Enter Secret Key</li>
                  </ul>
                </div>

                <div className="bg-[#1a1a1a] p-6 rounded-xl border border-[#333]">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg text-white">PayPal Setup</h3>
                    <i className="fa-brands fa-paypal text-3xl text-blue-400"></i>
                  </div>
                  <p className="text-sm text-gray-400 mb-4">
                    PayPal Smart Buttons are implemented for instant checkout.
                  </p>
                  <ul className="text-sm text-gray-500 space-y-2 list-disc list-inside">
                    <li>Create a PayPal REST API app.</li>
                    <li>Copy Client ID to the settings page.</li>
                    <li>Ensure mode is set to "Live" for production.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === "import" && (
            <div className="animate-[fadeInUp_0.5s_ease-out]">
              <h2 className="text-2xl font-bold mb-4 text-purple-400 border-b border-[#222] pb-2">CSV Import & Export</h2>
              <div className="space-y-6">
                <p className="text-gray-300">
                  You can easily bulk manage your store data using CSV files.
                </p>

                <div className="flex gap-4">
                  <div className="flex-1 bg-[#1a1a1a] p-6 rounded-xl border border-[#333] flex flex-col items-center text-center hover:border-purple-500 transition-colors">
                    <i className="fa-solid fa-file-arrow-up text-4xl text-purple-500 mb-4"></i>
                    <h3 className="font-bold text-lg mb-2">Import Products</h3>
                    <p className="text-sm text-gray-400 mb-4">Upload a CSV file to add or update hundreds of products at once.</p>
                    <Link href="/admin/products/import" className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-bold w-full">
                      Go to Import
                    </Link>
                  </div>

                  <div className="flex-1 bg-[#1a1a1a] p-6 rounded-xl border border-[#333] flex flex-col items-center text-center hover:border-blue-500 transition-colors">
                    <i className="fa-solid fa-file-arrow-down text-4xl text-blue-500 mb-4"></i>
                    <h3 className="font-bold text-lg mb-2">Export Data</h3>
                    <p className="text-sm text-gray-400 mb-4">Download your Orders, Customers, or Products as CSV for Excel.</p>
                    <Link href="/admin/reports" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold w-full">
                      Go to Reports
                    </Link>
                  </div>
                </div>
                
                <div className="bg-[#111] p-4 rounded-xl border border-gray-700 mt-4">
                  <h4 className="font-bold text-white mb-2 text-sm">Required CSV Headers for Products:</h4>
                  <code className="text-xs text-green-400 font-mono break-all">
                    name, description, price, category_id, branch_id, is_available, reorder_id
                  </code>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
