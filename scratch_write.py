import os
import sys

def create_file(path, content):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content.strip())
    print(f"Created: {path}")

base_dir = r"r:\complete-website-plus-pos-code\foodefy-code\src\app\admin"

# ==== BRANDS ====

brands_page = """
import prisma from "@/lib/prisma";
import BrandsClient from "./BrandsClient";

function serializeData(data) {
  return JSON.parse(
    JSON.stringify(data, (key, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );
}

export default async function AdminBrandsPage() {
  try {
    const data = await prisma.brands.findMany({
      orderBy: { id: "desc" },
    });
    const serialized = serializeData(data);
    return <BrandsClient initialData={serialized} />;
  } catch (error) {
    console.error("Brands Page Server Error:", error);
    return <BrandsClient initialData={[]} error="Failed to load brands from database." />;
  }
}
"""

brands_client = """
"use client";

import { useState } from "react";

export default function BrandsClient({ initialData, error }) {
  const [data, setData] = useState(initialData);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");

  const handleOpenAddModal = () => {
    setName("");
    setDescription("");
    setStatus(1);
    setFormError("");
    setShowAddModal(true);
  };

  const handleOpenEditModal = (item) => {
    setSelectedItem(item);
    setName(item.name);
    setDescription(item.description || "");
    setStatus(item.status);
    setFormError("");
    setShowEditModal(true);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    setFormError("");
    try {
      const res = await fetch("/api/admin/brands", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description, status }),
      });
      const resData = await res.json();
      if (res.ok) {
        setData([resData, ...data]);
        setShowAddModal(false);
      } else {
        setFormError(resData.error || "Failed to add brand");
      }
    } catch (err) {
      setFormError("Connection error.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !selectedItem) return;
    setLoading(true);
    setFormError("");
    try {
      const res = await fetch(`/api/admin/brands/${selectedItem.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description, status }),
      });
      const resData = await res.json();
      if (res.ok) {
        setData(data.map((c) => (c.id === selectedItem.id ? resData : c)));
        setShowEditModal(false);
      } else {
        setFormError(resData.error || "Failed to update brand");
      }
    } catch (err) {
      setFormError("Connection error.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this brand?")) return;
    try {
      const res = await fetch(`/api/admin/brands/${id}`, { method: "DELETE" });
      if (res.ok) {
        setData(data.filter((c) => c.id !== id));
      } else {
        alert("Failed to delete brand");
      }
    } catch (err) {
      alert("Failed to connect to server");
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const nextStatus = currentStatus === 1 ? 2 : 1;
    try {
      const res = await fetch(`/api/admin/brands/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      const resData = await res.json();
      if (res.ok) {
        setData(data.map((c) => (c.id === id ? resData : c)));
      } else {
        alert("Failed to update status");
      }
    } catch (err) {
      alert("Failed to connect to server");
    }
  };

  const filtered = data.filter((c) =>
    c.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/30 text-[#ff1744] text-xs">
          {error}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-[#111111]/60 border border-[#222222] p-4 rounded-2xl">
        <div className="relative flex-1 max-w-md">
          <i className="fas fa-search absolute left-4.5 top-1/2 -translate-y-1/2 text-gray-500"></i>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search brands..."
            className="w-full pl-11 pr-4 py-2.5 bg-[#080808] border border-[#222222] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#00e676]/50 focus:ring-1 focus:ring-[#00e676]/30 transition-all text-sm"
          />
        </div>
        <button
          onClick={handleOpenAddModal}
          className="bg-[#00e676] text-[#0d0d0d] hover:bg-[#00c853] py-2.5 px-5 rounded-xl font-bold text-sm tracking-wide transition-all shadow-lg shadow-[#00e676]/10 flex items-center justify-center gap-2"
        >
          <i className="fas fa-plus"></i> Add Brand
        </button>
      </div>

      <div className="bg-[#111]/80 border border-[#222] rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#222] text-[10px] text-gray-500 uppercase font-bold tracking-wider bg-[#0a0a0a]">
                <th className="py-4 px-6">ID</th>
                <th className="py-4 px-6">Brand Name</th>
                <th className="py-4 px-6">Description</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1c1c1c] text-xs">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-[#161616]/40 transition-colors group">
                  <td className="py-4 px-6 text-gray-500 font-mono">{item.id}</td>
                  <td className="py-4 px-6 font-semibold text-gray-200">{item.name}</td>
                  <td className="py-4 px-6 text-gray-400">{item.description || "-"}</td>
                  <td className="py-4 px-6">
                    <button
                      onClick={() => handleToggleStatus(item.id, item.status)}
                      className={`px-3 py-1 rounded-full border text-[10px] font-bold transition-all ${
                        item.status === 1
                          ? "bg-green-950/20 border-green-500/20 text-[#00e676]"
                          : "bg-red-950/20 border-red-500/20 text-[#ff1744]"
                      }`}
                    >
                      {item.status === 1 ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="py-4 px-6 text-right space-x-2">
                    <button
                      onClick={() => handleOpenEditModal(item)}
                      className="px-2.5 py-1.5 bg-[#1c1c1c] border border-[#333] hover:border-gray-500 rounded-lg text-gray-300 hover:text-white transition-all"
                    >
                      <i className="fas fa-edit"></i> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="px-2.5 py-1.5 bg-red-950/10 border border-red-950/30 text-[#ff1744] hover:bg-[#ff1744]/15 rounded-lg transition-all"
                    >
                      <i className="fas fa-trash-alt"></i> Delete
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-12 text-gray-500">
                    No brands found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODALS */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" onClick={() => { setShowAddModal(false); setShowEditModal(false); }}></div>
          <div className="relative bg-[#111111] border border-[#222] rounded-2xl w-full max-w-md overflow-hidden flex flex-col z-10">
            <div className="p-5 border-b border-[#222] flex items-center justify-between">
              <h3 className="text-base font-bold flex items-center gap-2">
                <i className={`fas ${showAddModal ? "fa-plus-circle" : "fa-edit"} text-[#00e676]`}></i>
                {showAddModal ? "Add Brand" : "Edit Brand"}
              </h3>
              <button onClick={() => { setShowAddModal(false); setShowEditModal(false); }} className="text-gray-400 hover:text-white">
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            {formError && (
              <div className="mx-6 mt-4 p-3 rounded-lg bg-red-950/20 border border-red-500/20 text-[#ff1744] text-[11px]">
                {formError}
              </div>
            )}

            <form onSubmit={showAddModal ? handleAdd : handleEdit} className="p-6 space-y-4">
              <div className="form-group">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#050505] border border-[#222] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#00e676]/50 text-sm"
                />
              </div>
              <div className="form-group">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#050505] border border-[#222] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#00e676]/50 text-sm h-24"
                ></textarea>
              </div>
              <div className="form-group">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(parseInt(e.target.value))}
                  className="w-full px-4 py-2.5 bg-[#050505] border border-[#222] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#00e676]/50 text-sm"
                >
                  <option value={1}>Active</option>
                  <option value={2}>Inactive</option>
                </select>
              </div>

              <div className="pt-4 flex gap-3 border-t border-[#222] mt-6">
                <button
                  type="button"
                  onClick={() => { setShowAddModal(false); setShowEditModal(false); }}
                  className="flex-1 py-2.5 bg-[#1c1c1c] hover:bg-[#222] rounded-xl border border-[#222] text-xs font-bold transition-all text-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2.5 bg-[#00e676] text-[#0d0d0d] hover:bg-[#00c853] rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
                >
                  {loading ? <i className="fas fa-spinner fa-spin"></i> : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
"""


# ==== UNITS ====

units_page = """
import prisma from "@/lib/prisma";
import UnitsClient from "./UnitsClient";

function serializeData(data) {
  return JSON.parse(
    JSON.stringify(data, (key, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );
}

export default async function AdminUnitsPage() {
  try {
    const data = await prisma.units.findMany({
      orderBy: { id: "desc" },
    });
    const serialized = serializeData(data);
    return <UnitsClient initialData={serialized} />;
  } catch (error) {
    console.error("Units Page Server Error:", error);
    return <UnitsClient initialData={[]} error="Failed to load units from database." />;
  }
}
"""

units_client = """
"use client";

import { useState } from "react";

export default function UnitsClient({ initialData, error }) {
  const [data, setData] = useState(initialData);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [name, setName] = useState("");
  const [shortName, setShortName] = useState("");
  const [allowDecimal, setAllowDecimal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");

  const handleOpenAddModal = () => {
    setName("");
    setShortName("");
    setAllowDecimal(0);
    setFormError("");
    setShowAddModal(true);
  };

  const handleOpenEditModal = (item) => {
    setSelectedItem(item);
    setName(item.name);
    setShortName(item.short_name || "");
    setAllowDecimal(item.allow_decimal);
    setFormError("");
    setShowEditModal(true);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    setFormError("");
    try {
      const res = await fetch("/api/admin/units", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, short_name: shortName, allow_decimal: allowDecimal }),
      });
      const resData = await res.json();
      if (res.ok) {
        setData([resData, ...data]);
        setShowAddModal(false);
      } else {
        setFormError(resData.error || "Failed to add unit");
      }
    } catch (err) {
      setFormError("Connection error.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !selectedItem) return;
    setLoading(true);
    setFormError("");
    try {
      const res = await fetch(`/api/admin/units/${selectedItem.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, short_name: shortName, allow_decimal: allowDecimal }),
      });
      const resData = await res.json();
      if (res.ok) {
        setData(data.map((c) => (c.id === selectedItem.id ? resData : c)));
        setShowEditModal(false);
      } else {
        setFormError(resData.error || "Failed to update unit");
      }
    } catch (err) {
      setFormError("Connection error.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this unit?")) return;
    try {
      const res = await fetch(`/api/admin/units/${id}`, { method: "DELETE" });
      if (res.ok) {
        setData(data.filter((c) => c.id !== id));
      } else {
        alert("Failed to delete unit");
      }
    } catch (err) {
      alert("Failed to connect to server");
    }
  };

  const handleToggleDecimal = async (id, currentDecimal) => {
    const nextDecimal = currentDecimal === 1 ? 0 : 1;
    try {
      const res = await fetch(`/api/admin/units/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ allow_decimal: nextDecimal }),
      });
      const resData = await res.json();
      if (res.ok) {
        setData(data.map((c) => (c.id === id ? resData : c)));
      } else {
        alert("Failed to update unit");
      }
    } catch (err) {
      alert("Failed to connect to server");
    }
  };

  const filtered = data.filter((c) =>
    c.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/30 text-[#ff1744] text-xs">
          {error}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-[#111111]/60 border border-[#222222] p-4 rounded-2xl">
        <div className="relative flex-1 max-w-md">
          <i className="fas fa-search absolute left-4.5 top-1/2 -translate-y-1/2 text-gray-500"></i>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search units..."
            className="w-full pl-11 pr-4 py-2.5 bg-[#080808] border border-[#222222] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#00e676]/50 focus:ring-1 focus:ring-[#00e676]/30 transition-all text-sm"
          />
        </div>
        <button
          onClick={handleOpenAddModal}
          className="bg-[#00e676] text-[#0d0d0d] hover:bg-[#00c853] py-2.5 px-5 rounded-xl font-bold text-sm tracking-wide transition-all shadow-lg shadow-[#00e676]/10 flex items-center justify-center gap-2"
        >
          <i className="fas fa-plus"></i> Add Unit
        </button>
      </div>

      <div className="bg-[#111]/80 border border-[#222] rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#222] text-[10px] text-gray-500 uppercase font-bold tracking-wider bg-[#0a0a0a]">
                <th className="py-4 px-6">ID</th>
                <th className="py-4 px-6">Unit Name</th>
                <th className="py-4 px-6">Short Name</th>
                <th className="py-4 px-6">Allow Decimal</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1c1c1c] text-xs">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-[#161616]/40 transition-colors group">
                  <td className="py-4 px-6 text-gray-500 font-mono">{item.id}</td>
                  <td className="py-4 px-6 font-semibold text-gray-200">{item.name}</td>
                  <td className="py-4 px-6 text-gray-400">{item.short_name || "-"}</td>
                  <td className="py-4 px-6">
                    <button
                      onClick={() => handleToggleDecimal(item.id, item.allow_decimal)}
                      className={`px-3 py-1 rounded-full border text-[10px] font-bold transition-all ${
                        item.allow_decimal === 1
                          ? "bg-green-950/20 border-green-500/20 text-[#00e676]"
                          : "bg-red-950/20 border-red-500/20 text-[#ff1744]"
                      }`}
                    >
                      {item.allow_decimal === 1 ? "Yes" : "No"}
                    </button>
                  </td>
                  <td className="py-4 px-6 text-right space-x-2">
                    <button
                      onClick={() => handleOpenEditModal(item)}
                      className="px-2.5 py-1.5 bg-[#1c1c1c] border border-[#333] hover:border-gray-500 rounded-lg text-gray-300 hover:text-white transition-all"
                    >
                      <i className="fas fa-edit"></i> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="px-2.5 py-1.5 bg-red-950/10 border border-red-950/30 text-[#ff1744] hover:bg-[#ff1744]/15 rounded-lg transition-all"
                    >
                      <i className="fas fa-trash-alt"></i> Delete
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-12 text-gray-500">
                    No units found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODALS */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" onClick={() => { setShowAddModal(false); setShowEditModal(false); }}></div>
          <div className="relative bg-[#111111] border border-[#222] rounded-2xl w-full max-w-md overflow-hidden flex flex-col z-10">
            <div className="p-5 border-b border-[#222] flex items-center justify-between">
              <h3 className="text-base font-bold flex items-center gap-2">
                <i className={`fas ${showAddModal ? "fa-plus-circle" : "fa-edit"} text-[#00e676]`}></i>
                {showAddModal ? "Add Unit" : "Edit Unit"}
              </h3>
              <button onClick={() => { setShowAddModal(false); setShowEditModal(false); }} className="text-gray-400 hover:text-white">
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            {formError && (
              <div className="mx-6 mt-4 p-3 rounded-lg bg-red-950/20 border border-red-500/20 text-[#ff1744] text-[11px]">
                {formError}
              </div>
            )}

            <form onSubmit={showAddModal ? handleAdd : handleEdit} className="p-6 space-y-4">
              <div className="form-group">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Unit Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#050505] border border-[#222] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#00e676]/50 text-sm"
                />
              </div>
              <div className="form-group">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Short Name</label>
                <input
                  type="text"
                  value={shortName}
                  onChange={(e) => setShortName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#050505] border border-[#222] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#00e676]/50 text-sm"
                />
              </div>
              <div className="form-group">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Allow Decimal</label>
                <select
                  value={allowDecimal}
                  onChange={(e) => setAllowDecimal(parseInt(e.target.value))}
                  className="w-full px-4 py-2.5 bg-[#050505] border border-[#222] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#00e676]/50 text-sm"
                >
                  <option value={1}>Yes</option>
                  <option value={0}>No</option>
                </select>
              </div>

              <div className="pt-4 flex gap-3 border-t border-[#222] mt-6">
                <button
                  type="button"
                  onClick={() => { setShowAddModal(false); setShowEditModal(false); }}
                  className="flex-1 py-2.5 bg-[#1c1c1c] hover:bg-[#222] rounded-xl border border-[#222] text-xs font-bold transition-all text-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2.5 bg-[#00e676] text-[#0d0d0d] hover:bg-[#00c853] rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
                >
                  {loading ? <i className="fas fa-spinner fa-spin"></i> : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
"""

# ==== WARRANTIES ====

warranties_page = """
import prisma from "@/lib/prisma";
import WarrantiesClient from "./WarrantiesClient";

function serializeData(data) {
  return JSON.parse(
    JSON.stringify(data, (key, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );
}

export default async function AdminWarrantiesPage() {
  try {
    const data = await prisma.warranties.findMany({
      orderBy: { id: "desc" },
    });
    const serialized = serializeData(data);
    return <WarrantiesClient initialData={serialized} />;
  } catch (error) {
    console.error("Warranties Page Server Error:", error);
    return <WarrantiesClient initialData={[]} error="Failed to load warranties from database." />;
  }
}
"""

warranties_client = """
"use client";

import { useState } from "react";

export default function WarrantiesClient({ initialData, error }) {
  const [data, setData] = useState(initialData);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [durationType, setDurationType] = useState("months");
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");

  const handleOpenAddModal = () => {
    setName("");
    setDescription("");
    setDuration("");
    setDurationType("months");
    setFormError("");
    setShowAddModal(true);
  };

  const handleOpenEditModal = (item) => {
    setSelectedItem(item);
    setName(item.name);
    setDescription(item.description || "");
    setDuration(item.duration?.toString() || "");
    setDurationType(item.duration_type || "months");
    setFormError("");
    setShowEditModal(true);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    setFormError("");
    try {
      const res = await fetch("/api/admin/warranties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description, duration: duration ? parseInt(duration) : null, duration_type: durationType }),
      });
      const resData = await res.json();
      if (res.ok) {
        setData([resData, ...data]);
        setShowAddModal(false);
      } else {
        setFormError(resData.error || "Failed to add warranty");
      }
    } catch (err) {
      setFormError("Connection error.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !selectedItem) return;
    setLoading(true);
    setFormError("");
    try {
      const res = await fetch(`/api/admin/warranties/${selectedItem.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description, duration: duration ? parseInt(duration) : null, duration_type: durationType }),
      });
      const resData = await res.json();
      if (res.ok) {
        setData(data.map((c) => (c.id === selectedItem.id ? resData : c)));
        setShowEditModal(false);
      } else {
        setFormError(resData.error || "Failed to update warranty");
      }
    } catch (err) {
      setFormError("Connection error.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this warranty?")) return;
    try {
      const res = await fetch(`/api/admin/warranties/${id}`, { method: "DELETE" });
      if (res.ok) {
        setData(data.filter((c) => c.id !== id));
      } else {
        alert("Failed to delete warranty");
      }
    } catch (err) {
      alert("Failed to connect to server");
    }
  };

  const filtered = data.filter((c) =>
    c.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/30 text-[#ff1744] text-xs">
          {error}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-[#111111]/60 border border-[#222222] p-4 rounded-2xl">
        <div className="relative flex-1 max-w-md">
          <i className="fas fa-search absolute left-4.5 top-1/2 -translate-y-1/2 text-gray-500"></i>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search warranties..."
            className="w-full pl-11 pr-4 py-2.5 bg-[#080808] border border-[#222222] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#00e676]/50 focus:ring-1 focus:ring-[#00e676]/30 transition-all text-sm"
          />
        </div>
        <button
          onClick={handleOpenAddModal}
          className="bg-[#00e676] text-[#0d0d0d] hover:bg-[#00c853] py-2.5 px-5 rounded-xl font-bold text-sm tracking-wide transition-all shadow-lg shadow-[#00e676]/10 flex items-center justify-center gap-2"
        >
          <i className="fas fa-plus"></i> Add Warranty
        </button>
      </div>

      <div className="bg-[#111]/80 border border-[#222] rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#222] text-[10px] text-gray-500 uppercase font-bold tracking-wider bg-[#0a0a0a]">
                <th className="py-4 px-6">ID</th>
                <th className="py-4 px-6">Name</th>
                <th className="py-4 px-6">Description</th>
                <th className="py-4 px-6">Duration</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1c1c1c] text-xs">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-[#161616]/40 transition-colors group">
                  <td className="py-4 px-6 text-gray-500 font-mono">{item.id}</td>
                  <td className="py-4 px-6 font-semibold text-gray-200">{item.name}</td>
                  <td className="py-4 px-6 text-gray-400">{item.description || "-"}</td>
                  <td className="py-4 px-6 text-gray-300">
                    {item.duration ? `${item.duration} ${item.duration_type}` : "-"}
                  </td>
                  <td className="py-4 px-6 text-right space-x-2">
                    <button
                      onClick={() => handleOpenEditModal(item)}
                      className="px-2.5 py-1.5 bg-[#1c1c1c] border border-[#333] hover:border-gray-500 rounded-lg text-gray-300 hover:text-white transition-all"
                    >
                      <i className="fas fa-edit"></i> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="px-2.5 py-1.5 bg-red-950/10 border border-red-950/30 text-[#ff1744] hover:bg-[#ff1744]/15 rounded-lg transition-all"
                    >
                      <i className="fas fa-trash-alt"></i> Delete
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-12 text-gray-500">
                    No warranties found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODALS */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" onClick={() => { setShowAddModal(false); setShowEditModal(false); }}></div>
          <div className="relative bg-[#111111] border border-[#222] rounded-2xl w-full max-w-md overflow-hidden flex flex-col z-10">
            <div className="p-5 border-b border-[#222] flex items-center justify-between">
              <h3 className="text-base font-bold flex items-center gap-2">
                <i className={`fas ${showAddModal ? "fa-plus-circle" : "fa-edit"} text-[#00e676]`}></i>
                {showAddModal ? "Add Warranty" : "Edit Warranty"}
              </h3>
              <button onClick={() => { setShowAddModal(false); setShowEditModal(false); }} className="text-gray-400 hover:text-white">
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            {formError && (
              <div className="mx-6 mt-4 p-3 rounded-lg bg-red-950/20 border border-red-500/20 text-[#ff1744] text-[11px]">
                {formError}
              </div>
            )}

            <form onSubmit={showAddModal ? handleAdd : handleEdit} className="p-6 space-y-4">
              <div className="form-group">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#050505] border border-[#222] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#00e676]/50 text-sm"
                />
              </div>
              <div className="form-group">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#050505] border border-[#222] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#00e676]/50 text-sm h-24"
                ></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Duration</label>
                  <input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#050505] border border-[#222] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#00e676]/50 text-sm"
                  />
                </div>
                <div className="form-group">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Type</label>
                  <select
                    value={durationType}
                    onChange={(e) => setDurationType(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#050505] border border-[#222] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#00e676]/50 text-sm"
                  >
                    <option value="days">Days</option>
                    <option value="months">Months</option>
                    <option value="years">Years</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex gap-3 border-t border-[#222] mt-6">
                <button
                  type="button"
                  onClick={() => { setShowAddModal(false); setShowEditModal(false); }}
                  className="flex-1 py-2.5 bg-[#1c1c1c] hover:bg-[#222] rounded-xl border border-[#222] text-xs font-bold transition-all text-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2.5 bg-[#00e676] text-[#0d0d0d] hover:bg-[#00c853] rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
                >
                  {loading ? <i className="fas fa-spinner fa-spin"></i> : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
"""

create_file(os.path.join(base_dir, "brands", "page.js"), brands_page)
create_file(os.path.join(base_dir, "brands", "BrandsClient.js"), brands_client)

create_file(os.path.join(base_dir, "units", "page.js"), units_page)
create_file(os.path.join(base_dir, "units", "UnitsClient.js"), units_client)

create_file(os.path.join(base_dir, "warranties", "page.js"), warranties_page)
create_file(os.path.join(base_dir, "warranties", "WarrantiesClient.js"), warranties_client)
