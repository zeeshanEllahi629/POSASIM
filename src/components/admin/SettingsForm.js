"use client";

import { useState, useEffect } from "react";

export default function SettingsForm() {
  const [formData, setFormData] = useState({
    title: "",
    email: "",
    mobile: "",
    address: "",
    show_product_brief: 1,
    cart_style: "sidebar",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/admin/settings");
      const data = await res.json();
      if (data.status === 1 && data.settings) {
        setFormData({
          title: data.settings.title || "",
          email: data.settings.email || "",
          mobile: data.settings.mobile || "",
          address: data.settings.address || "",
          show_product_brief: data.settings.show_product_brief !== undefined ? data.settings.show_product_brief : 1,
          cart_style: data.settings.cart_style || "sidebar",
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.type === 'checkbox' ? (e.target.checked ? 1 : 0) : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.status === 1) {
        setMessage("Settings saved successfully!");
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage("Error saving settings.");
      }
    } catch (error) {
      setMessage("Network error.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-gray-500 text-sm py-4">Loading settings...</div>;
  }

  return (
    <div className="bg-[#111111]/80 border border-[#222222] rounded-2xl p-6 shadow-xl space-y-6">
      <div>
        <h3 className="text-base font-bold flex items-center gap-2 font-display text-white">
          <i className="fas fa-sliders text-[#00e676]"></i> Business Configuration
        </h3>
        <p className="text-xs text-gray-500 mt-1">Configure your restaurant delivery and terminal billing options</p>
      </div>

      {message && (
        <div className={`p-3 text-xs font-bold rounded-lg ${message.includes("success") ? "bg-green-900/30 text-green-500 border border-green-500/50" : "bg-red-900/30 text-red-500 border border-red-500/50"}`}>
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="form-group">
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Store Name</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full px-4 py-2.5 bg-[#050505] border border-[#222] rounded-xl text-white focus:outline-none focus:border-[#00e676]/50 text-sm font-semibold"
          />
        </div>

        <div className="form-group">
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Contact Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full px-4 py-2.5 bg-[#050505] border border-[#222] rounded-xl text-white focus:outline-none focus:border-[#00e676]/50 text-sm"
          />
        </div>

        <div className="form-group">
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Store Phone</label>
          <input
            type="text"
            name="mobile"
            value={formData.mobile}
            onChange={handleInputChange}
            className="w-full px-4 py-2.5 bg-[#050505] border border-[#222] rounded-xl text-white focus:outline-none focus:border-[#00e676]/50 text-sm"
          />
        </div>

        <div className="form-group">
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Currency Symbol</label>
          <input
            type="text"
            defaultValue="USD ($)"
            disabled
            className="w-full px-4 py-2.5 bg-[#0a0a0a] border border-[#222] rounded-xl text-gray-400 focus:outline-none text-sm cursor-not-allowed"
          />
        </div>

        <div className="form-group md:col-span-2">
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Store Address</label>
          <textarea
            rows="2"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            className="w-full px-4 py-2.5 bg-[#050505] border border-[#222] rounded-xl text-white focus:outline-none focus:border-[#00e676]/50 text-sm"
          ></textarea>
        </div>

        <div className="form-group md:col-span-2 mt-4 pt-4 border-t border-[#222]">
          <h4 className="text-sm font-bold text-white mb-4">Frontend Preferences</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="flex items-center justify-between p-4 bg-[#0a0a0a] border border-[#222] rounded-xl">
              <div>
                <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1">Show Product Brief</label>
                <p className="text-[10px] text-gray-500">Display item descriptions on the menu page</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" name="show_product_brief" className="sr-only peer" checked={formData.show_product_brief === 1} onChange={handleInputChange} />
                <div className="w-11 h-6 bg-[#333] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00e676]"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-[#0a0a0a] border border-[#222] rounded-xl">
              <div>
                <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1">Cart Style</label>
                <p className="text-[10px] text-gray-500">Choose between slide-out sidebar or separate page</p>
              </div>
              <select
                name="cart_style"
                value={formData.cart_style}
                onChange={handleInputChange}
                className="bg-[#111] border border-[#333] text-white text-xs rounded-lg focus:ring-[#00e676] focus:border-[#00e676] block p-2 outline-none"
              >
                <option value="sidebar">Sidebar Drawer</option>
                <option value="page">Full Page Cart</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-[#222] flex justify-end">
        <button 
          onClick={handleSave}
          disabled={saving}
          className="bg-[#00e676] text-[#0d0d0d] hover:bg-[#00c853] py-2.5 px-6 rounded-xl font-bold text-xs tracking-wider uppercase transition-all shadow-lg shadow-[#00e676]/10 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
