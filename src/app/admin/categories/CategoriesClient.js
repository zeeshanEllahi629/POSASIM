"use client";

import { useState } from "react";

export default function CategoriesClient({ initialCategories, error }) {
  const [categories, setCategories] = useState(initialCategories);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Form inputs
  const [categoryName, setCategoryName] = useState("");
  const [categoryImage, setCategoryImage] = useState(""); // text input for demo/simplicity
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");

  const handleOpenAddModal = () => {
    setCategoryName("");
    setCategoryImage("default.png");
    setFormError("");
    setShowAddModal(true);
  };

  const handleOpenEditModal = (cat) => {
    setSelectedCategory(cat);
    setCategoryName(cat.category_name);
    setCategoryImage(cat.image);
    setFormError("");
    setShowEditModal(true);
  };

  // Add Category Handler
  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!categoryName.trim()) return;
    setLoading(true);
    setFormError("");

    try {
      const res = await fetch("/api/admin2/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category_name: categoryName,
          image: categoryImage || "default.png",
        }),
      });

      const data = await res.json();
      if (data.status === 1) {
        setCategories([...categories, data.category]);
        setShowAddModal(false);
      } else {
        setFormError(data.error || "Failed to add category");
      }
    } catch (err) {
      setFormError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Edit Category Handler
  const handleEditCategory = async (e) => {
    e.preventDefault();
    if (!categoryName.trim() || !selectedCategory) return;
    setLoading(true);
    setFormError("");

    try {
      const res = await fetch(`/api/admin2/categories/${selectedCategory.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category_name: categoryName,
          image: categoryImage,
        }),
      });

      const data = await res.json();
      if (data.status === 1) {
        setCategories(
          categories.map((c) => (c.id === selectedCategory.id ? data.category : c))
        );
        setShowEditModal(false);
      } else {
        setFormError(data.error || "Failed to update category");
      }
    } catch (err) {
      setFormError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Delete Category Handler
  const handleDeleteCategory = async (id) => {
    if (!confirm("Are you sure you want to delete this category? All products under it will be disabled.")) return;

    try {
      const res = await fetch(`/api/admin2/categories/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (data.status === 1) {
        setCategories(categories.filter((c) => c.id !== id));
      } else {
        alert(data.error || "Failed to delete category");
      }
    } catch (err) {
      alert("Failed to connect to server");
    }
  };

  // Toggle Category Availability Status
  const handleToggleStatus = async (id, currentStatus) => {
    const nextStatus = currentStatus === 1 ? 2 : 1;
    try {
      const res = await fetch(`/api/admin2/categories/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_available: nextStatus }),
      });

      const data = await res.json();
      if (data.status === 1) {
        setCategories(
          categories.map((c) => (c.id === id ? { ...c, is_available: nextStatus } : c))
        );
      } else {
        alert(data.error || "Failed to update status");
      }
    } catch (err) {
      alert("Failed to connect to server");
    }
  };

  // Filter list
  const filtered = categories.filter((c) =>
    c.category_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/30 text-[#ff1744] text-xs">
          {error}
        </div>
      )}

      {/* ========== HEADER CONTROL BAR ========== */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-[#111111]/60 border border-[#222222] p-4 rounded-2xl">
        <div className="relative flex-1 max-w-md">
          <i className="fas fa-search absolute left-4.5 top-1/2 -translate-y-1/2 text-gray-500"></i>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search categories..."
            className="w-full pl-11 pr-4 py-2.5 bg-[#080808] border border-[#222222] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#00e676]/50 focus:ring-1 focus:ring-[#00e676]/30 transition-all text-sm"
          />
        </div>
        <button
          onClick={handleOpenAddModal}
          className="bg-[#00e676] text-[#0d0d0d] hover:bg-[#00c853] py-2.5 px-5 rounded-xl font-bold text-sm tracking-wide transition-all shadow-lg shadow-[#00e676]/10 flex items-center justify-center gap-2"
        >
          <i className="fas fa-plus"></i> Add Category
        </button>
      </div>

      {/* ========== CATEGORIES LIST TABLE ========== */}
      <div className="bg-[#111]/80 border border-[#222] rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#222] text-[10px] text-gray-500 uppercase font-bold tracking-wider bg-[#0a0a0a]">
                <th className="py-4 px-6">Image</th>
                <th className="py-4 px-6">Category Name</th>
                <th className="py-4 px-6">Slug URL</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1c1c1c] text-xs">
              {filtered.map((cat) => (
                <tr key={cat.id} className="hover:bg-[#161616]/40 transition-colors group">
                  <td className="py-4 px-6">
                    <div className="w-10 h-10 rounded-lg bg-[#222] overflow-hidden border border-[#333] flex items-center justify-center">
                      {cat.image && cat.image !== "default.png" ? (
                        <img
                          src={`/storage/app/public/admin-assets/images/category/${cat.image}`}
                          alt={cat.category_name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <i className="fas fa-folder text-gray-600 text-lg"></i>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6 font-semibold text-gray-200">
                    {cat.category_name}
                  </td>
                  <td className="py-4 px-6 font-mono text-gray-500">
                    {cat.slug}
                  </td>
                  <td className="py-4 px-6">
                    <button
                      onClick={() => handleToggleStatus(cat.id, cat.is_available)}
                      className={`px-3 py-1 rounded-full border text-[10px] font-bold transition-all ${
                        cat.is_available === 1
                          ? "bg-green-950/20 border-green-500/20 text-[#00e676]"
                          : "bg-red-950/20 border-red-500/20 text-[#ff1744]"
                      }`}
                    >
                      {cat.is_available === 1 ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="py-4 px-6 text-right space-x-2">
                    <button
                      onClick={() => handleOpenEditModal(cat)}
                      className="px-2.5 py-1.5 bg-[#1c1c1c] border border-[#333] hover:border-gray-500 rounded-lg text-gray-300 hover:text-white transition-all"
                    >
                      <i className="fas fa-edit"></i> Edit
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(cat.id)}
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
                    No categories found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========== ADD MODAL ========== */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" onClick={() => setShowAddModal(false)}></div>
          <div className="relative bg-[#111111] border border-[#222] rounded-2xl w-full max-w-md overflow-hidden flex flex-col z-10">
            <div className="p-5 border-b border-[#222] flex items-center justify-between">
              <h3 className="text-base font-bold flex items-center gap-2">
                <i className="fas fa-folder-plus text-[#00e676]"></i> Add New Category
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-white">
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            {formError && (
              <div className="mx-6 mt-4 p-3 rounded-lg bg-red-950/20 border border-red-500/20 text-[#ff1744] text-[11px]">
                {formError}
              </div>
            )}

            <form onSubmit={handleAddCategory} className="p-6 space-y-4">
              <div className="form-group">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Category Name
                </label>
                <input
                  type="text"
                  required
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  placeholder="e.g. Desserts, Beverages"
                  className="w-full px-4 py-2.5 bg-[#050505] border border-[#222] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#00e676]/50 text-sm"
                />
              </div>

              <div className="form-group">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Category Image Filename
                </label>
                <input
                  type="text"
                  value={categoryImage}
                  onChange={(e) => setCategoryImage(e.target.value)}
                  placeholder="e.g. category-pizza.jpg"
                  className="w-full px-4 py-2.5 bg-[#050505] border border-[#222] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#00e676]/50 text-sm"
                />
                <span className="text-[10px] text-gray-500 mt-1 block">
                  Leave blank to use a default icon indicator.
                </span>
              </div>

              <div className="pt-4 flex gap-3 border-t border-[#222] mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 bg-[#1c1c1c] hover:bg-[#222] rounded-xl border border-[#222] text-xs font-bold transition-all text-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2.5 bg-[#00e676] text-[#0d0d0d] hover:bg-[#00c853] rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
                >
                  {loading ? <i className="fas fa-spinner fa-spin"></i> : "Create Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========== EDIT MODAL ========== */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" onClick={() => setShowEditModal(false)}></div>
          <div className="relative bg-[#111111] border border-[#222] rounded-2xl w-full max-w-md overflow-hidden flex flex-col z-10">
            <div className="p-5 border-b border-[#222] flex items-center justify-between">
              <h3 className="text-base font-bold flex items-center gap-2">
                <i className="fas fa-edit text-[#00e676]"></i> Edit Category
              </h3>
              <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-white">
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            {formError && (
              <div className="mx-6 mt-4 p-3 rounded-lg bg-red-950/20 border border-red-500/20 text-[#ff1744] text-[11px]">
                {formError}
              </div>
            )}

            <form onSubmit={handleEditCategory} className="p-6 space-y-4">
              <div className="form-group">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Category Name
                </label>
                <input
                  type="text"
                  required
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  placeholder="e.g. Desserts, Beverages"
                  className="w-full px-4 py-2.5 bg-[#050505] border border-[#222] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#00e676]/50 text-sm"
                />
              </div>

              <div className="form-group">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Category Image Filename
                </label>
                <input
                  type="text"
                  value={categoryImage}
                  onChange={(e) => setCategoryImage(e.target.value)}
                  placeholder="e.g. category-pizza.jpg"
                  className="w-full px-4 py-2.5 bg-[#050505] border border-[#222] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#00e676]/50 text-sm"
                />
              </div>

              <div className="pt-4 flex gap-3 border-t border-[#222] mt-6">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 py-2.5 bg-[#1c1c1c] hover:bg-[#222] rounded-xl border border-[#222] text-xs font-bold transition-all text-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2.5 bg-[#00e676] text-[#0d0d0d] hover:bg-[#00c853] rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
                >
                  {loading ? <i className="fas fa-spinner fa-spin"></i> : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
