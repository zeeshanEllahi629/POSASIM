"use client";

import { useState, useEffect } from "react";

export default function TemplateSettingsForm() {
  const [formData, setFormData] = useState({
    theme_color_primary: "#ff1744",
    theme_color_secondary: "#00e676",
    hero_title: "Delicious Food Delivered to You",
    hero_subtitle: "Order from your favorite local restaurants with fast delivery.",
    about_us_text: "We are committed to bringing the best culinary experiences directly to your door.",
    footer_text: "© 2026 Foodefy. All rights reserved.",
    support_email: "support@foodefy.com",
    facebook_url: "https://facebook.com",
    instagram_url: "https://instagram.com"
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/admin/site-settings");
      const data = await res.json();
      if (data.status === 1 && data.settings) {
        // Merge fetched settings with default formData keys
        setFormData(prev => ({
          ...prev,
          ...data.settings
        }));
      }
    } catch (error) {
      console.error("Failed to fetch template settings", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/admin/site-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.status === 1) {
        setMessage("Template customized successfully!");
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage("Error saving customization.");
      }
    } catch (error) {
      setMessage("Network error.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-gray-500 text-sm py-4">Loading template settings...</div>;
  }

  return (
    <div className="bg-[#111111]/80 border border-[#222222] rounded-2xl p-6 shadow-xl space-y-6 mt-6">
      <div>
        <h3 className="text-base font-bold flex items-center gap-2 font-display text-white">
          <i className="fas fa-paint-brush text-[#ff1744]"></i> Global Template Customization
        </h3>
        <p className="text-xs text-gray-500 mt-1">Change front-end text, branding, and colors to use this as a white-label template for different clients.</p>
      </div>

      {message && (
        <div className={`p-3 text-xs font-bold rounded-lg ${message.includes("success") ? "bg-green-900/30 text-green-500 border border-green-500/50" : "bg-red-900/30 text-red-500 border border-red-500/50"}`}>
          {message}
        </div>
      )}

      {/* Theme Colors */}
      <div className="pt-2 border-t border-[#222]">
        <h4 className="text-sm font-bold text-white mb-4">Branding Colors</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="form-group">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Primary Color</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                name="theme_color_primary"
                value={formData.theme_color_primary}
                onChange={handleInputChange}
                className="w-10 h-10 rounded border-none bg-transparent cursor-pointer"
              />
              <input
                type="text"
                name="theme_color_primary"
                value={formData.theme_color_primary}
                onChange={handleInputChange}
                className="flex-1 px-4 py-2 bg-[#050505] border border-[#222] rounded-xl text-white font-mono text-xs focus:border-[#ff1744]"
              />
            </div>
          </div>
          <div className="form-group">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Secondary Color</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                name="theme_color_secondary"
                value={formData.theme_color_secondary}
                onChange={handleInputChange}
                className="w-10 h-10 rounded border-none bg-transparent cursor-pointer"
              />
              <input
                type="text"
                name="theme_color_secondary"
                value={formData.theme_color_secondary}
                onChange={handleInputChange}
                className="flex-1 px-4 py-2 bg-[#050505] border border-[#222] rounded-xl text-white font-mono text-xs focus:border-[#ff1744]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Front-End Text */}
      <div className="pt-4 border-t border-[#222]">
        <h4 className="text-sm font-bold text-white mb-4">Front-End Content</h4>
        <div className="grid grid-cols-1 gap-5">
          <div className="form-group">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Hero Section Title</label>
            <input
              type="text"
              name="hero_title"
              value={formData.hero_title}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 bg-[#050505] border border-[#222] rounded-xl text-white focus:outline-none focus:border-[#ff1744] text-sm"
            />
          </div>
          <div className="form-group">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Hero Section Subtitle</label>
            <input
              type="text"
              name="hero_subtitle"
              value={formData.hero_subtitle}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 bg-[#050505] border border-[#222] rounded-xl text-white focus:outline-none focus:border-[#ff1744] text-sm"
            />
          </div>
          <div className="form-group">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">About Us / Mission Statement</label>
            <textarea
              rows="3"
              name="about_us_text"
              value={formData.about_us_text}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 bg-[#050505] border border-[#222] rounded-xl text-white focus:outline-none focus:border-[#ff1744] text-sm"
            ></textarea>
          </div>
          <div className="form-group">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Footer Copyright Text</label>
            <input
              type="text"
              name="footer_text"
              value={formData.footer_text}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 bg-[#050505] border border-[#222] rounded-xl text-white focus:outline-none focus:border-[#ff1744] text-sm"
            />
          </div>
        </div>
      </div>

      {/* Socials & Links */}
      <div className="pt-4 border-t border-[#222]">
        <h4 className="text-sm font-bold text-white mb-4">Social & Links</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="form-group">
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Support Email</label>
            <input type="text" name="support_email" value={formData.support_email} onChange={handleInputChange} className="w-full px-3 py-2 bg-[#050505] border border-[#222] rounded-lg text-white focus:outline-none focus:border-[#ff1744] text-xs" />
          </div>
          <div className="form-group">
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Facebook URL</label>
            <input type="text" name="facebook_url" value={formData.facebook_url} onChange={handleInputChange} className="w-full px-3 py-2 bg-[#050505] border border-[#222] rounded-lg text-white focus:outline-none focus:border-[#ff1744] text-xs" />
          </div>
          <div className="form-group">
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Instagram URL</label>
            <input type="text" name="instagram_url" value={formData.instagram_url} onChange={handleInputChange} className="w-full px-3 py-2 bg-[#050505] border border-[#222] rounded-lg text-white focus:outline-none focus:border-[#ff1744] text-xs" />
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-[#222] flex justify-end">
        <button 
          onClick={handleSave}
          disabled={saving}
          className="bg-[#ff1744] text-white hover:bg-[#d50000] py-2.5 px-6 rounded-xl font-bold text-xs tracking-wider uppercase transition-all shadow-lg shadow-[#ff1744]/20 disabled:opacity-50 flex items-center gap-2"
        >
          {saving ? <><i className="fas fa-spinner fa-spin"></i> Saving...</> : <><i className="fas fa-save"></i> Save Customizations</>}
        </button>
      </div>
    </div>
  );
}
