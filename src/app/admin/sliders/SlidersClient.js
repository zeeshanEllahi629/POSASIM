"use client";

import { useState } from "react";

export default function SlidersClient({ initialSliders, categories, items, error }) {
  const [sliders, setSliders] = useState(initialSliders);
  
  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedSlider, setSelectedSlider] = useState(null);

  // Form inputs
  const [image, setImage] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState(1); // 1 for category, 2 for item
  const [catId, setCatId] = useState("");
  const [itemId, setItemId] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");

  const handleOpenAddModal = () => {
    setImage("");
    setTitle("");
    setDescription("");
    setType(1);
    setCatId(categories.length > 0 ? categories[0].id : "");
    setItemId(items.length > 0 ? items[0].id : "");
    setFormError("");
    setShowAddModal(true);
  };

  const handleOpenEditModal = (slider) => {
    setSelectedSlider(slider);
    setImage(slider.image || "");
    setTitle(slider.title || "");
    setDescription(slider.description || "");
    setType(slider.type || 1);
    setCatId(slider.cat_id ? slider.cat_id.toString() : "");
    setItemId(slider.item_id ? slider.item_id.toString() : "");
    setFormError("");
    setShowEditModal(true);
  };

  const handleAddSlider = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFormError("");

    try {
      const res = await fetch("/api/admin/sliders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: image || "default-slider.png",
          title,
          description,
          type: parseInt(type),
          cat_id: parseInt(type) === 1 ? parseInt(catId) : 0,
          item_id: parseInt(type) === 2 ? parseInt(itemId) : 0,
        }),
      });

      const data = await res.json();
      if (data.status === 1) {
        setSliders([...sliders, data.slider]);
        setShowAddModal(false);
      } else {
        setFormError(data.error || "Failed to add slider");
      }
    } catch (err) {
      setFormError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditSlider = async (e) => {
    e.preventDefault();
    if (!selectedSlider) return;
    setLoading(true);
    setFormError("");

    try {
      const res = await fetch(`/api/admin/sliders/${selectedSlider.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image,
          title,
          description,
          type: parseInt(type),
          cat_id: parseInt(type) === 1 ? parseInt(catId) : 0,
          item_id: parseInt(type) === 2 ? parseInt(itemId) : 0,
        }),
      });

      const data = await res.json();
      if (data.status === 1) {
        setSliders(
          sliders.map((s) => (s.id === selectedSlider.id ? data.slider : s))
        );
        setShowEditModal(false);
      } else {
        setFormError(data.error || "Failed to update slider");
      }
    } catch (err) {
      setFormError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSlider = async (id) => {
    if (!confirm("Are you sure you want to delete this slider?")) return;

    try {
      const res = await fetch(`/api/admin/sliders/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (data.status === 1) {
        setSliders(sliders.filter((s) => s.id !== id));
      } else {
        alert(data.error || "Failed to delete slider");
      }
    } catch (err) {
      alert("Failed to connect to server");
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const nextStatus = currentStatus === 1 ? 2 : 1;
    try {
      const res = await fetch(`/api/admin/sliders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_available: nextStatus }),
      });

      const data = await res.json();
      if (data.status === 1) {
        setSliders(
          sliders.map((s) => (s.id === id ? { ...s, is_available: nextStatus } : s))
        );
      } else {
        alert(data.error || "Failed to update status");
      }
    } catch (err) {
      alert("Failed to connect to server");
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-[#111111]/60 border border-[#222222] p-4 rounded-2xl">
        <div className="text-gray-400 text-sm">
          Total Sliders: <span className="font-bold text-white">{sliders.length}</span>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="bg-[#00e676] text-[#0d0d0d] hover:bg-[#00c853] py-2.5 px-5 rounded-xl font-bold text-sm tracking-wide transition-all shadow-lg shadow-[#00e676]/10 flex items-center justify-center gap-2"
        >
          <i className="fas fa-plus"></i> Add Slider
        </button>
      </div>

      {/* ========== LIST TABLE ========== */}
      <div className="bg-[#111]/80 border border-[#222] rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#222] text-[10px] text-gray-500 uppercase font-bold tracking-wider bg-[#0a0a0a]">
                <th className="py-4 px-6">Image</th>
                <th className="py-4 px-6">Title & Desc</th>
                <th className="py-4 px-6">Type & Reference</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1c1c1c] text-xs">
              {sliders.map((slider) => (
                <tr key={slider.id} className="hover:bg-[#161616]/40 transition-colors group">
                  <td className="py-4 px-6">
                    <div className="w-24 h-12 rounded-lg bg-[#222] overflow-hidden border border-[#333] flex items-center justify-center">
                      {slider.image ? (
                        <img
                          src={`/storage/app/public/admin-assets/images/slider/${slider.image}`}
                          alt="Slider"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <i className="fas fa-image text-gray-600"></i>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-semibold text-gray-200">{slider.title}</div>
                    <div className="text-[10px] text-gray-500 max-w-xs truncate">{slider.description}</div>
                  </td>
                  <td className="py-4 px-6 font-mono text-gray-500">
                    <div className="flex flex-col gap-1">
                      <span className="text-gray-300">
                        {slider.type === 1 ? "Category" : slider.type === 2 ? "Item" : "None"}
                      </span>
                      <span className="text-[10px]">
                        {slider.type === 1 && slider.cat_id ? `ID: ${slider.cat_id}` : ""}
                        {slider.type === 2 && slider.item_id ? `ID: ${slider.item_id}` : ""}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <button
                      onClick={() => handleToggleStatus(slider.id, slider.is_available)}
                      className={`px-3 py-1 rounded-full border text-[10px] font-bold transition-all ${
                        slider.is_available === 1
                          ? "bg-green-950/20 border-green-500/20 text-[#00e676]"
                          : "bg-red-950/20 border-red-500/20 text-[#ff1744]"
                      }`}
                    >
                      {slider.is_available === 1 ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="py-4 px-6 text-right space-x-2">
                    <button
                      onClick={() => handleOpenEditModal(slider)}
                      className="px-2.5 py-1.5 bg-[#1c1c1c] border border-[#333] hover:border-gray-500 rounded-lg text-gray-300 hover:text-white transition-all"
                    >
                      <i className="fas fa-edit"></i> Edit
                    </button>
                    <button
                      onClick={() => handleDeleteSlider(slider.id)}
                      className="px-2.5 py-1.5 bg-red-950/10 border border-red-950/30 text-[#ff1744] hover:bg-[#ff1744]/15 rounded-lg transition-all"
                    >
                      <i className="fas fa-trash-alt"></i> Delete
                    </button>
                  </td>
                </tr>
              ))}
              {sliders.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-12 text-gray-500">
                    No sliders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========== MODALS ========== */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" onClick={() => { setShowAddModal(false); setShowEditModal(false); }}></div>
          <div className="relative bg-[#111111] border border-[#222] rounded-2xl w-full max-w-md overflow-hidden flex flex-col z-10">
            <div className="p-5 border-b border-[#222] flex items-center justify-between">
              <h3 className="text-base font-bold flex items-center gap-2">
                <i className={`fas ${showAddModal ? 'fa-plus' : 'fa-edit'} text-[#00e676]`}></i> 
                {showAddModal ? "Add New Slider" : "Edit Slider"}
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

            <form onSubmit={showAddModal ? handleAddSlider : handleEditSlider} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              
              <div className="form-group">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Image Filename
                </label>
                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="e.g. slider1.jpg"
                  className="w-full px-4 py-2.5 bg-[#050505] border border-[#222] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#00e676]/50 text-sm"
                />
              </div>

              <div className="form-group">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="Slider Title"
                  className="w-full px-4 py-2.5 bg-[#050505] border border-[#222] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#00e676]/50 text-sm"
                />
              </div>

              <div className="form-group">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Short description"
                  rows={3}
                  className="w-full px-4 py-2.5 bg-[#050505] border border-[#222] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#00e676]/50 text-sm"
                />
              </div>

              <div className="form-group">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Type
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#050505] border border-[#222] rounded-xl text-white focus:outline-none focus:border-[#00e676]/50 text-sm"
                >
                  <option value={1}>Category</option>
                  <option value={2}>Item</option>
                </select>
              </div>

              {parseInt(type) === 1 && (
                <div className="form-group">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Category
                  </label>
                  <select
                    value={catId}
                    onChange={(e) => setCatId(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#050505] border border-[#222] rounded-xl text-white focus:outline-none focus:border-[#00e676]/50 text-sm"
                  >
                    <option value="">Select Category</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.category_name}</option>
                    ))}
                  </select>
                </div>
              )}

              {parseInt(type) === 2 && (
                <div className="form-group">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Item
                  </label>
                  <select
                    value={itemId}
                    onChange={(e) => setItemId(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#050505] border border-[#222] rounded-xl text-white focus:outline-none focus:border-[#00e676]/50 text-sm"
                  >
                    <option value="">Select Item</option>
                    {items.map(i => (
                      <option key={i.id} value={i.id}>{i.item_name}</option>
                    ))}
                  </select>
                </div>
              )}

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
                  {loading ? <i className="fas fa-spinner fa-spin"></i> : showAddModal ? "Create Slider" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
