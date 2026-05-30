"use client";

import { useState, useEffect } from "react";

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState([]);
  const [rfqs, setRfqs] = useState([]);
  const [activeTab, setActiveTab] = useState("suppliers");

  // Fetch initial data
  useEffect(() => {
    fetchSuppliers();
    fetchRfqs();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const res = await fetch("/api/suppliers");
      const data = await res.json();
      if (data.success) {
        setSuppliers(data.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchRfqs = async () => {
    try {
      const res = await fetch("/api/rfqs");
      const data = await res.json();
      if (data.success) {
        setRfqs(data.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const createDummySupplier = async () => {
    try {
      await fetch("/api/suppliers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company_name: "Guangzhou Electronics Co.",
          contact_person: "Li Wei",
          email: "liwei@gzelectronics.com",
          country: "China",
          reliability_score: 9.2,
          is_verified: 1
        })
      });
      fetchSuppliers();
    } catch (e) {}
  };

  const createDummyRfq = async () => {
    try {
      await fetch("/api/rfqs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_name: "Smart Watch Series 8",
          target_quantity: 500,
          target_price: 15.50
        })
      });
      fetchRfqs();
    } catch (e) {}
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#111] p-6 rounded-2xl border border-[#222] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-white">Supplier Management</h1>
          <p className="text-gray-400 text-sm mt-1">Manage global supplier profiles, RFQs, and quotations.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={createDummySupplier} className="bg-[#222] text-white px-4 py-2 rounded-xl text-sm hover:bg-[#333] transition-colors border border-[#444]">
            + Add Supplier
          </button>
          <button onClick={createDummyRfq} className="bg-[#00e676] text-[#0d0d0d] px-4 py-2 rounded-xl text-sm font-bold hover:bg-[#00c853] transition-colors">
            + Create RFQ
          </button>
        </div>
      </div>

      <div className="flex gap-4 border-b border-[#222] pb-2">
        <button
          onClick={() => setActiveTab("suppliers")}
          className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
            activeTab === "suppliers" ? "bg-[#00e676]/10 text-[#00e676]" : "text-gray-400 hover:text-white"
          }`}
        >
          <i className="fas fa-building mr-2"></i> Supplier Profiles
        </button>
        <button
          onClick={() => setActiveTab("rfqs")}
          className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
            activeTab === "rfqs" ? "bg-[#00e676]/10 text-[#00e676]" : "text-gray-400 hover:text-white"
          }`}
        >
          <i className="fas fa-file-invoice mr-2"></i> RFQs & Quotes
        </button>
      </div>

      {activeTab === "suppliers" && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {suppliers.length === 0 ? (
            <p className="text-gray-500">No suppliers found. Click 'Add Supplier' to create one.</p>
          ) : (
            suppliers.map((sup) => (
              <div key={sup.id} className="bg-[#111] p-5 rounded-2xl border border-[#222] flex flex-col gap-3">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-bold text-white">{sup.company_name}</h3>
                  {sup.is_verified === 1 && (
                    <span className="text-blue-400 bg-blue-400/10 p-1.5 rounded-full" title="Verified Supplier">
                      <i className="fas fa-check-circle"></i>
                    </span>
                  )}
                </div>
                <div className="text-sm text-gray-400 space-y-1">
                  <p><i className="fas fa-user text-[#00e676] w-5"></i> {sup.contact_person}</p>
                  <p><i className="fas fa-envelope text-[#00e676] w-5"></i> {sup.email}</p>
                  <p><i className="fas fa-globe text-[#00e676] w-5"></i> {sup.country}</p>
                </div>
                <div className="mt-2 bg-[#050505] p-3 rounded-xl border border-[#333] flex justify-between items-center">
                  <span className="text-xs text-gray-400">Reliability Score</span>
                  <span className="text-[#00e676] font-bold">{sup.reliability_score}/10</span>
                </div>
                <button className="mt-2 w-full border border-[#333] text-gray-300 py-2 rounded-lg text-sm hover:bg-[#222] transition-colors">
                  View Full Profile
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === "rfqs" && (
        <div className="bg-[#111] rounded-2xl border border-[#222] overflow-hidden">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-[#222] text-xs uppercase text-gray-400">
              <tr>
                <th className="px-6 py-4">RFQ Number</th>
                <th className="px-6 py-4">Product Name</th>
                <th className="px-6 py-4">Quantity</th>
                <th className="px-6 py-4">Target Price</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222]">
              {rfqs.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    No RFQs found. Click 'Create RFQ' to initiate a request.
                  </td>
                </tr>
              ) : (
                rfqs.map((rfq) => (
                  <tr key={rfq.id} className="hover:bg-[#1a1a1a] transition-colors">
                    <td className="px-6 py-4 font-mono text-[#00e676]">{rfq.rfq_number}</td>
                    <td className="px-6 py-4 font-bold text-white">{rfq.product_name}</td>
                    <td className="px-6 py-4">{rfq.target_quantity} pcs</td>
                    <td className="px-6 py-4">${rfq.target_price}</td>
                    <td className="px-6 py-4">
                      <span className="bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 px-2 py-1 rounded text-xs">
                        {rfq.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-[#00e676] hover:underline">View Quotes</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
