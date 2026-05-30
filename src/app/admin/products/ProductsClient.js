"use client";

import { useState } from "react";

export default function ProductsClient({ initialProducts, categories, initialViewMode = "list", error }) {
  const [products, setProducts] = useState(initialProducts);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCatFilter, setSelectedCatFilter] = useState("all");
  const [viewMode, setViewMode] = useState(initialViewMode);

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Form inputs
  const [itemName, setItemName] = useState("");
  const [catId, setCatId] = useState("");
  const [price, setPrice] = useState("");
  const [qty, setQty] = useState("");
  const [itemType, setItemType] = useState("1"); // 1 = Veg, 2 = Non-veg
  const [itemDescription, setItemDescription] = useState("");
  const [image, setImage] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");

  const handleOpenAddModal = () => {
    setItemName("");
    setCatId(categories[0]?.id || "");
    setPrice("");
    setQty("");
    setItemType("1");
    setItemDescription("");
    setImage("default.jpg");
    setFormError("");
    setShowAddModal(true);
  };

  const handleOpenEditModal = (prod) => {
    setSelectedProduct(prod);
    setItemName(prod.item_name);
    setCatId(prod.cat_id.toString());
    setPrice(prod.price.toString());
    setQty((prod.qty ?? 0).toString());
    setItemType((prod.item_type || 1).toString());
    setItemDescription(prod.item_description || "");
    setImage(prod.image || "default.jpg");
    setFormError("");
    setShowEditModal(true);
  };

  // Add Product Handler
  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!itemName.trim() || !catId || price === "" || qty === "") return;
    setLoading(true);
    setFormError("");

    try {
      const formData = new FormData();
      formData.append("item_name", itemName);
      formData.append("cat_id", catId);
      formData.append("price", price);
      formData.append("qty", qty);
      formData.append("item_type", itemType);
      formData.append("item_description", itemDescription);
      if (image instanceof File) {
        formData.append("image", image);
      } else if (typeof image === "string") {
        formData.append("image_string", image);
      }

      const res = await fetch("/api/admin/products", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.status === 1) {
        setProducts([data.product, ...products]);
        setShowAddModal(false);
      } else {
        setFormError(data.error || "Failed to add product");
      }
    } catch (err) {
      setFormError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Edit Product Handler
  const handleEditProduct = async (e) => {
    e.preventDefault();
    if (!itemName.trim() || !catId || price === "" || qty === "" || !selectedProduct) return;
    setLoading(true);
    setFormError("");

    try {
      const formData = new FormData();
      formData.append("item_name", itemName);
      formData.append("cat_id", catId);
      formData.append("price", price);
      formData.append("qty", qty);
      formData.append("item_type", itemType);
      formData.append("item_description", itemDescription);
      if (image instanceof File) {
        formData.append("image", image);
      } else if (typeof image === "string") {
        formData.append("image_string", image);
      }

      const res = await fetch(`/api/admin/products/${selectedProduct.id}`, {
        method: "PUT",
        body: formData,
      });

      const data = await res.json();
      if (data.status === 1) {
        setProducts(
          products.map((p) => (p.id === selectedProduct.id ? data.product : p))
        );
        setShowEditModal(false);
      } else {
        setFormError(data.error || "Failed to update product");
      }
    } catch (err) {
      setFormError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Delete Product Handler
  const handleDeleteProduct = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (data.status === 1) {
        setProducts(products.filter((p) => p.id !== id));
      } else {
        alert(data.error || "Failed to delete product");
      }
    } catch (err) {
      alert("Failed to connect to server");
    }
  };

  // Toggle active/inactive status
  const handleToggleStatus = async (id, currentStatus) => {
    const nextStatus = currentStatus === 1 ? 2 : 1;
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ item_status: nextStatus }),
      });

      const data = await res.json();
      if (data.status === 1) {
        setProducts(
          products.map((p) => (p.id === id ? { ...p, item_status: nextStatus } : p))
        );
      } else {
        alert(data.error || "Failed to update status");
      }
    } catch (err) {
      alert("Failed to connect to server");
    }
  };

  // Filter list
  const filtered = products.filter((prod) => {
    const matchesSearch = prod.item_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat =
      selectedCatFilter === "all" || prod.cat_id.toString() === selectedCatFilter.toString();
    return matchesSearch && matchesCat;
  });

  const handleViewModeChange = async (mode) => {
    setViewMode(mode);
    try {
      await fetch("/api/admin/settings/view-mode", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ viewMode: mode }),
      });
    } catch (error) {
      console.error("Failed to update view mode", error);
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/30 text-[#ff1744] text-xs">
          {error}
        </div>
      )}

      {/* ========== HEADER CONTROL BAR ========== */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#111111]/60 border border-[#222222] p-4 rounded-2xl">
        <div className="flex flex-col sm:flex-row flex-1 gap-3 max-w-2xl">
          <div className="relative flex-1">
            <i className="fas fa-search absolute left-4.5 top-1/2 -translate-y-1/2 text-gray-500"></i>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-11 pr-4 py-2.5 bg-[#080808] border border-[#222222] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#00e676]/50 focus:ring-1 focus:ring-[#00e676]/30 transition-all text-sm"
            />
          </div>
          <div className="sm:w-48">
            <select
              value={selectedCatFilter}
              onChange={(e) => setSelectedCatFilter(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#080808] border border-[#222222] rounded-xl text-white focus:outline-none focus:border-[#00e676]/50 text-sm"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.category_name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="flex bg-[#080808] p-1 border border-[#222] rounded-xl">
            <button
              onClick={() => handleViewModeChange("list")}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${
                viewMode === "list"
                  ? "bg-[#1c1c1c] text-[#00e676] shadow"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              <i className="fas fa-list"></i>
            </button>
            <button
              onClick={() => handleViewModeChange("grid")}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${
                viewMode === "grid"
                  ? "bg-[#1c1c1c] text-[#00e676] shadow"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              <i className="fas fa-th-large"></i>
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => window.location.href = '/admin/products/import'}
              className="bg-[#1c1c1c] text-white hover:bg-[#222222] border border-[#333] py-2.5 px-4 rounded-xl font-bold text-sm tracking-wide transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <i className="fas fa-file-import text-[#00e676]"></i> Import
            </button>
            <button
              onClick={handleOpenAddModal}
              className="bg-[#00e676] text-[#0d0d0d] hover:bg-[#00c853] py-2.5 px-5 rounded-xl font-bold text-sm tracking-wide transition-all shadow-lg shadow-[#00e676]/10 flex items-center justify-center gap-2"
            >
              <i className="fas fa-plus"></i> Add Product
            </button>
          </div>
        </div>
      </div>

      {/* ========== PRODUCTS VIEW ========== */}
      {viewMode === "list" ? (
        <div className="bg-[#111]/80 border border-[#222] rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#222] text-[10px] text-gray-500 uppercase font-bold tracking-wider bg-[#0a0a0a]">
                <th className="py-4 px-6">Image</th>
                <th className="py-4 px-6">Item Name</th>
                <th className="py-4 px-6">Category</th>
                <th className="py-4 px-6">Price</th>
                <th className="py-4 px-6">Stock</th>
                <th className="py-4 px-6">Type</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1c1c1c] text-xs">
              {filtered.map((prod) => {
                const prodCat = categories.find((c) => c.id.toString() === prod.cat_id.toString());
                const isStockLow = (prod.qty ?? 0) <= 5;
                const isOutOfStock = (prod.qty ?? 0) === 0;

                return (
                  <tr key={prod.id} className="hover:bg-[#161616]/40 transition-colors group">
                    <td className="py-4 px-6">
                      <div className="w-10 h-10 rounded-lg bg-[#222] overflow-hidden border border-[#333] flex items-center justify-center">
                        {prod.image ? (
                          <img
                            src={`/storage/app/public/admin-assets/images/item/${prod.image}`}
                            alt={prod.item_name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <i className="fas fa-utensils text-gray-600 text-lg"></i>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6 font-semibold text-gray-200">
                      <div>
                        <div>{prod.item_name}</div>
                        <div className="text-[10px] text-gray-500 font-mono mt-0.5">{prod.slug}</div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-400">
                      {prodCat ? prodCat.category_name : "General"}
                    </td>
                    <td className="py-4 px-6 font-bold text-[#00e676]">
                      ${parseFloat(prod.price || 0).toFixed(2)}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`font-bold px-2 py-0.5 rounded ${
                          isOutOfStock
                            ? "bg-red-950/30 border border-red-500/20 text-[#ff1744]"
                            : isStockLow
                            ? "bg-yellow-950/30 border border-yellow-500/20 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      >
                        {prod.qty ?? 0} units
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      {prod.item_type === 1 ? (
                        <span className="text-green-500 flex items-center gap-1 text-[10px] font-semibold bg-green-950/20 px-2 py-0.5 rounded-full border border-green-500/20 w-fit">
                          <i className="fas fa-leaf"></i> Veg
                        </span>
                      ) : (
                        <span className="text-red-400 flex items-center gap-1 text-[10px] font-semibold bg-red-950/20 px-2 py-0.5 rounded-full border border-red-500/20 w-fit">
                          <i className="fas fa-drumstick-bite"></i> Non-Veg
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => handleToggleStatus(prod.id, prod.item_status)}
                        className={`px-3 py-1 rounded-full border text-[10px] font-bold transition-all ${
                          prod.item_status === 1
                            ? "bg-green-950/20 border-green-500/20 text-[#00e676]"
                            : "bg-red-950/20 border-red-500/20 text-[#ff1744]"
                        }`}
                      >
                        {prod.item_status === 1 ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEditModal(prod)}
                        className="px-2.5 py-1.5 bg-[#1c1c1c] border border-[#333] hover:border-gray-500 rounded-lg text-gray-300 hover:text-white transition-all"
                      >
                        <i className="fas fa-edit"></i> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(prod.id)}
                        className="px-2.5 py-1.5 bg-red-950/10 border border-red-950/30 text-[#ff1744] hover:bg-[#ff1744]/15 rounded-lg transition-all"
                      >
                        <i className="fas fa-trash-alt"></i> Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="8" className="text-center py-12 text-gray-500">
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filtered.map((prod) => {
            const prodCat = categories.find((c) => c.id.toString() === prod.cat_id.toString());
            const isStockLow = (prod.qty ?? 0) <= 5;
            const isOutOfStock = (prod.qty ?? 0) === 0;

            return (
              <div key={prod.id} className="bg-[#111]/80 border border-[#222] rounded-2xl overflow-hidden shadow-xl hover:border-[#333] hover:shadow-2xl transition-all group flex flex-col">
                <div className="h-48 bg-[#0a0a0a] relative overflow-hidden flex items-center justify-center">
                  {prod.image ? (
                    <img
                      src={`/storage/app/public/admin-assets/images/item/${prod.image}`}
                      alt={prod.item_name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <i className="fas fa-utensils text-gray-700 text-5xl"></i>
                  )}
                  <div className="absolute top-3 right-3 flex flex-col gap-2">
                    <button
                      onClick={() => handleToggleStatus(prod.id, prod.item_status)}
                      className={`px-2 py-1 rounded border text-[10px] font-bold shadow-lg backdrop-blur-sm ${
                        prod.item_status === 1
                          ? "bg-green-950/80 border-green-500/50 text-[#00e676]"
                          : "bg-red-950/80 border-red-500/50 text-[#ff1744]"
                      }`}
                    >
                      {prod.item_status === 1 ? "Active" : "Inactive"}
                    </button>
                  </div>
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">
                    {prodCat ? prodCat.category_name : "General"}
                  </div>
                  <h3 className="font-bold text-gray-200 text-lg mb-1 leading-tight">{prod.item_name}</h3>
                  <div className="text-[10px] text-gray-600 font-mono mb-3">{prod.slug}</div>
                  
                  <div className="flex items-center justify-between mt-auto pt-3 border-t border-[#222]">
                    <div className="font-bold text-[#00e676] text-xl">
                      ${parseFloat(prod.price || 0).toFixed(2)}
                    </div>
                    <span
                      className={`font-bold px-2 py-1 rounded text-xs ${
                        isOutOfStock
                          ? "bg-red-950/30 border border-red-500/20 text-[#ff1744]"
                          : isStockLow
                          ? "bg-yellow-950/30 border border-yellow-500/20 text-yellow-400"
                          : "bg-[#1c1c1c] border border-[#333] text-gray-300"
                      }`}
                    >
                      {prod.qty ?? 0} in stock
                    </span>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => handleOpenEditModal(prod)}
                      className="flex-1 px-3 py-2 bg-[#1c1c1c] border border-[#333] hover:border-gray-500 rounded-lg text-gray-300 hover:text-white transition-all text-xs font-bold flex items-center justify-center gap-2"
                    >
                      <i className="fas fa-edit"></i> Edit
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(prod.id)}
                      className="px-3 py-2 bg-red-950/10 border border-red-950/30 text-[#ff1744] hover:bg-[#ff1744]/15 rounded-lg transition-all text-xs font-bold"
                    >
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="col-span-full text-center py-20 text-gray-500 bg-[#111]/50 border border-[#222] rounded-2xl border-dashed">
              <i className="fas fa-box-open text-4xl mb-4 opacity-50"></i>
              <p>No products found</p>
            </div>
          )}
        </div>
      )}

      {/* ========== ADD MODAL ========== */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" onClick={() => setShowAddModal(false)}></div>
          <div className="relative bg-[#111111] border border-[#222] rounded-2xl w-full max-w-lg overflow-hidden flex flex-col z-10">
            <div className="p-5 border-b border-[#222] flex items-center justify-between">
              <h3 className="text-base font-bold flex items-center gap-2">
                <i className="fas fa-plus-circle text-[#00e676]"></i> Add New Product
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

            <form onSubmit={handleAddProduct} className="p-6 space-y-4 overflow-y-auto max-h-[70vh]">
              <div className="grid grid-cols-2 gap-4">
                <div className="form-group col-span-2">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Product Name
                  </label>
                  <input
                    type="text"
                    required
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    placeholder="e.g. Pepperoni Feast"
                    className="w-full px-4 py-2.5 bg-[#050505] border border-[#222] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#00e676]/50 text-sm"
                  />
                </div>

                <div className="form-group">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Category
                  </label>
                  <select
                    value={catId}
                    onChange={(e) => setCatId(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#050505] border border-[#222] rounded-xl text-white focus:outline-none focus:border-[#00e676]/50 text-sm"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.category_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Item Type
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setItemType("1")}
                      className={`flex-1 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                        itemType === "1"
                          ? "bg-green-950/20 border-green-500 text-green-400"
                          : "bg-[#050505] border-[#222] text-gray-400 hover:text-white"
                      }`}
                    >
                      Veg
                    </button>
                    <button
                      type="button"
                      onClick={() => setItemType("2")}
                      className={`flex-1 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                        itemType === "2"
                          ? "bg-red-950/20 border-red-500 text-red-400"
                          : "bg-[#050505] border-[#222] text-gray-400 hover:text-white"
                      }`}
                    >
                      Non-Veg
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0.00"
                    className="w-full px-4 py-2.5 bg-[#050505] border border-[#222] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#00e676]/50 text-sm"
                  />
                </div>

                <div className="form-group">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    required
                    value={qty}
                    onChange={(e) => setQty(e.target.value)}
                    placeholder="100"
                    className="w-full px-4 py-2.5 bg-[#050505] border border-[#222] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#00e676]/50 text-sm"
                  />
                </div>

                <div className="form-group col-span-2">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Product Image (Optional)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setImage(e.target.files[0]);
                      }
                    }}
                    className="block w-full text-sm text-gray-400
                      file:mr-4 file:py-2.5 file:px-4
                      file:rounded-xl file:border-0
                      file:text-sm file:font-semibold
                      file:bg-[#1c1c1c] file:text-gray-300
                      hover:file:bg-[#222222] border border-[#222222] rounded-xl bg-[#080808]"
                  />
                </div>

                <div className="form-group col-span-2">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Description
                  </label>
                  <textarea
                    value={itemDescription}
                    onChange={(e) => setItemDescription(e.target.value)}
                    rows="3"
                    placeholder="Describe product ingredients..."
                    className="w-full px-4 py-2.5 bg-[#050505] border border-[#222] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#00e676]/50 text-sm"
                  ></textarea>
                </div>
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
                  {loading ? <i className="fas fa-spinner fa-spin"></i> : "Create Product"}
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
          <div className="relative bg-[#111111] border border-[#222] rounded-2xl w-full max-w-lg overflow-hidden flex flex-col z-10">
            <div className="p-5 border-b border-[#222] flex items-center justify-between">
              <h3 className="text-base font-bold flex items-center gap-2">
                <i className="fas fa-edit text-[#00e676]"></i> Edit Product
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

            <form onSubmit={handleEditProduct} className="p-6 space-y-4 overflow-y-auto max-h-[70vh]">
              <div className="grid grid-cols-2 gap-4">
                <div className="form-group col-span-2">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Product Name
                  </label>
                  <input
                    type="text"
                    required
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    placeholder="e.g. Pepperoni Feast"
                    className="w-full px-4 py-2.5 bg-[#050505] border border-[#222] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#00e676]/50 text-sm"
                  />
                </div>

                <div className="form-group">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Category
                  </label>
                  <select
                    value={catId}
                    onChange={(e) => setCatId(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#050505] border border-[#222] rounded-xl text-white focus:outline-none focus:border-[#00e676]/50 text-sm"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.category_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Item Type
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setItemType("1")}
                      className={`flex-1 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                        itemType === "1"
                          ? "bg-green-950/20 border-green-500 text-green-400"
                          : "bg-[#050505] border-[#222] text-gray-400 hover:text-white"
                      }`}
                    >
                      Veg
                    </button>
                    <button
                      type="button"
                      onClick={() => setItemType("2")}
                      className={`flex-1 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                        itemType === "2"
                          ? "bg-red-950/20 border-red-500 text-red-400"
                          : "bg-[#050505] border-[#222] text-gray-400 hover:text-white"
                      }`}
                    >
                      Non-Veg
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0.00"
                    className="w-full px-4 py-2.5 bg-[#050505] border border-[#222] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#00e676]/50 text-sm"
                  />
                </div>

                <div className="form-group">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    required
                    value={qty}
                    onChange={(e) => setQty(e.target.value)}
                    placeholder="100"
                    className="w-full px-4 py-2.5 bg-[#050505] border border-[#222] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#00e676]/50 text-sm"
                  />
                </div>

                <div className="form-group col-span-2">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Product Image (Optional)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setImage(e.target.files[0]);
                      }
                    }}
                    className="block w-full text-sm text-gray-400
                      file:mr-4 file:py-2.5 file:px-4
                      file:rounded-xl file:border-0
                      file:text-sm file:font-semibold
                      file:bg-[#1c1c1c] file:text-gray-300
                      hover:file:bg-[#222222] border border-[#222222] rounded-xl bg-[#080808]"
                  />
                  {typeof image === "string" && image && (
                    <div className="mt-2 text-xs text-gray-500">
                      Current image: {image}
                    </div>
                  )}
                </div>

                <div className="form-group col-span-2">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Description
                  </label>
                  <textarea
                    value={itemDescription}
                    onChange={(e) => setItemDescription(e.target.value)}
                    rows="3"
                    placeholder="Describe product ingredients..."
                    className="w-full px-4 py-2.5 bg-[#050505] border border-[#222] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#00e676]/50 text-sm"
                  ></textarea>
                </div>
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
