"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function AddExpensePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    category: "",
    expense_date: new Date().toISOString().split('T')[0],
    branch_id: "",
    description: "",
    attach_document: null
  });

  const categories = [
    "Utilities", "Rent", "Salaries", "Maintenance", "Marketing", "Travel", "Office Supplies", "Other"
  ];

  const locations = [
    { id: 1, name: "Main Branch" },
    { id: 2, name: "Warehouse" }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, attach_document: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== undefined) {
          data.append(key, formData[key]);
        }
      });

      const res = await fetch("/api/admin/expenses", {
        method: "POST",
        body: data,
      });

      const result = await res.json();
      if (res.ok && result.status === 1) {
        toast.success("Expense added successfully!");
        // We will just clear form or navigate back. For now, navigate to dashboard
        router.push("/admin"); 
      } else {
        toast.error(result.error || "Failed to save expense");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Add New Expense</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-[#111] border border-[#222] rounded-xl p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs text-gray-400 mb-1">Expense Title / Note *</label>
            <input type="text" name="title" required value={formData.title} onChange={handleChange} className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-3 py-2 text-white text-sm" placeholder="e.g. Electric Bill" />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Amount *</label>
            <input type="number" step="0.01" min="0.01" name="amount" required value={formData.amount} onChange={handleChange} className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-3 py-2 text-white text-sm" />
          </div>
          
          <div>
            <label className="block text-xs text-gray-400 mb-1">Expense Category *</label>
            <select name="category" required value={formData.category} onChange={handleChange} className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-3 py-2 text-white text-sm">
              <option value="">Please Select</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Expense Date *</label>
            <input type="date" name="expense_date" required value={formData.expense_date} onChange={handleChange} className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-3 py-2 text-white text-sm" />
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1">Business Location</label>
            <select name="branch_id" value={formData.branch_id} onChange={handleChange} className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-3 py-2 text-white text-sm">
              <option value="">All Locations</option>
              {locations.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Attach Receipt / Document</label>
            <input type="file" onChange={handleFileChange} className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-3 py-[6px] text-white text-sm" />
          </div>
        </div>

        <div>
          <label className="block text-xs text-gray-400 mb-1">Detailed Description (Optional)</label>
          <textarea name="description" rows="3" value={formData.description} onChange={handleChange} className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-3 py-2 text-white text-sm" placeholder="Additional details about this expense..."></textarea>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-[#333]">
          <button type="button" onClick={() => router.push('/admin')} className="px-6 py-2 rounded-lg font-semibold text-gray-300 bg-[#222] hover:bg-[#333] transition-colors">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="px-6 py-2 rounded-lg font-bold text-[#0d0d0d] bg-[#00e676] hover:bg-[#00c853] transition-colors shadow-lg shadow-[#00e676]/20">
            {loading ? "Saving..." : "Save Expense"}
          </button>
        </div>
      </form>
    </div>
  );
}
