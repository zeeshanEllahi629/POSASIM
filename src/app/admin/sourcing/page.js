"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function SourcingDashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/sourcing/products")
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setProducts(data.products || []);
        }
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold font-display">China Sourcing Dashboard</h1>
        <Link href="/admin/sourcing/import" className="bg-[#00e676] text-black px-4 py-2 rounded-lg font-semibold hover:bg-[#00c853]">
          <i className="fas fa-plus mr-2"></i> Import Product
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#111] p-6 rounded-xl border border-[#222]">
          <h3 className="text-gray-400 font-semibold mb-2">Total Sourced Products</h3>
          <div className="text-3xl font-bold text-[#00e676]">{products.length}</div>
        </div>
        <div className="bg-[#111] p-6 rounded-xl border border-[#222]">
          <h3 className="text-gray-400 font-semibold mb-2">Active Products</h3>
          <div className="text-3xl font-bold text-white">
            {products.filter(p => p.status === 'active').length}
          </div>
        </div>
        <div className="bg-[#111] p-6 rounded-xl border border-[#222]">
          <h3 className="text-gray-400 font-semibold mb-2">Pending Orders</h3>
          <div className="text-3xl font-bold text-yellow-500">-</div>
        </div>
      </div>

      <div className="bg-[#111] rounded-xl border border-[#222] overflow-hidden">
        <div className="p-4 border-b border-[#222] bg-[#1a1a1a]">
          <h2 className="font-semibold text-white">Recent Sourced Products</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#0d0d0d] text-gray-400 text-sm">
              <tr>
                <th className="p-4">Product Name</th>
                <th className="p-4">Source</th>
                <th className="p-4">Agent</th>
                <th className="p-4">Cost (RMB)</th>
                <th className="p-4">Selling Price ($)</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222]">
              {loading ? (
                <tr><td colSpan="7" className="p-4 text-center">Loading...</td></tr>
              ) : products.length === 0 ? (
                <tr><td colSpan="7" className="p-4 text-center text-gray-500">No products imported yet.</td></tr>
              ) : (
                products.map(p => (
                  <tr key={p.id} className="hover:bg-[#1a1a1a]">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {p.sourceImages && p.sourceImages.length > 0 && (
                          <img src={p.sourceImages[0]} alt="" className="w-10 h-10 rounded object-cover" />
                        )}
                        <span className="font-semibold text-sm truncate max-w-[200px]" title={p.sourceName}>
                          {p.sourceName}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-sm">{p.sourceType}</td>
                    <td className="p-4 text-sm capitalize">{p.preferredAgent || 'N/A'}</td>
                    <td className="p-4 text-sm">¥{p.sourcePriceRmb}</td>
                    <td className="p-4 text-sm text-[#00e676]">${p.sellingPrice}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${p.status === 'active' ? 'bg-green-500/10 text-green-500' : 'bg-gray-500/10 text-gray-400'}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <Link href={`/admin/sourcing/orders?productId=${p.id}`} className="text-blue-400 hover:text-blue-300 text-sm">
                        <i className="fas fa-shopping-cart mr-1"></i> Order
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
