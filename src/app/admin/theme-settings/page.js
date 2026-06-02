"use client";
import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function ThemeSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    web_primary_color: "#00e676",
    web_secondary_color: "#111111",
    footer_title: "",
    footer_description: "",
    facebook_link: "",
    instagram_link: "",
    tiktok_link: "",
  });
  const [banners, setBanners] = useState([]);
  const [newBannerUrl, setNewBannerUrl] = useState("");

  useEffect(() => {
    fetchThemeData();
  }, []);

  const fetchThemeData = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/theme");
    const data = await res.json();
    if (data.success) {
      if (data.settings && data.settings.id) {
        setSettings({
          web_primary_color: data.settings.web_primary_color || "#00e676",
          web_secondary_color: data.settings.web_secondary_color || "#111111",
          footer_title: data.settings.footer_title || "",
          footer_description: data.settings.footer_description || "",
          facebook_link: data.settings.facebook_link || "",
          instagram_link: data.settings.instagram_link || "",
          tiktok_link: data.settings.tiktok_link || "",
        });
      }
      setBanners(data.banners || []);
    }
    setLoading(false);
  };

  const handleSaveTheme = async (e) => {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/admin/theme", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings)
    });
    const data = await res.json();
    if (data.success) {
      toast.success("Theme settings updated!");
    } else {
      toast.error(data.error || "Failed to update theme");
    }
    setSaving(false);
  };

  const handleAddBanner = async () => {
    if (!newBannerUrl) return toast.error("Please enter an image URL");
    const res = await fetch("/api/admin/theme", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: 'add_banner', image: newBannerUrl, type: 'home' })
    });
    const data = await res.json();
    if (data.success) {
      toast.success("Banner added!");
      setNewBannerUrl("");
      fetchThemeData();
    }
  };

  const handleDeleteBanner = async (id) => {
    if (!confirm("Are you sure?")) return;
    const res = await fetch("/api/admin/theme", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: 'delete_banner', id })
    });
    if (res.ok) {
      toast.success("Banner deleted!");
      fetchThemeData();
    }
  };

  if (loading) return <div className="p-6">Loading theme settings...</div>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <Toaster />
      <h1 className="text-2xl font-bold font-display mb-6">Theme Settings & Customization</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Global Branding Form */}
        <div className="bg-[#111] p-6 rounded-xl border border-[#222]">
          <h2 className="text-xl font-bold mb-4">Global Branding</h2>
          <form onSubmit={handleSaveTheme} className="space-y-4">
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Primary Color</label>
                <div className="flex items-center gap-2">
                  <input type="color" value={settings.web_primary_color} onChange={(e) => setSettings({...settings, web_primary_color: e.target.value})} className="h-10 w-10 bg-transparent border-0 rounded cursor-pointer" />
                  <input type="text" value={settings.web_primary_color} onChange={(e) => setSettings({...settings, web_primary_color: e.target.value})} className="flex-1 bg-[#1a1a1a] border border-[#333] rounded px-3 py-2 text-white outline-none focus:border-[#00e676]" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Secondary Color</label>
                <div className="flex items-center gap-2">
                  <input type="color" value={settings.web_secondary_color} onChange={(e) => setSettings({...settings, web_secondary_color: e.target.value})} className="h-10 w-10 bg-transparent border-0 rounded cursor-pointer" />
                  <input type="text" value={settings.web_secondary_color} onChange={(e) => setSettings({...settings, web_secondary_color: e.target.value})} className="flex-1 bg-[#1a1a1a] border border-[#333] rounded px-3 py-2 text-white outline-none focus:border-[#00e676]" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Footer Title</label>
              <input type="text" value={settings.footer_title} onChange={(e) => setSettings({...settings, footer_title: e.target.value})} className="w-full bg-[#1a1a1a] border border-[#333] rounded px-3 py-2 text-white outline-none focus:border-[#00e676]" placeholder="Company Name Inc." />
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-1">Footer Description</label>
              <textarea value={settings.footer_description} onChange={(e) => setSettings({...settings, footer_description: e.target.value})} className="w-full bg-[#1a1a1a] border border-[#333] rounded px-3 py-2 text-white outline-none focus:border-[#00e676] h-20" placeholder="A short blurb about your company..."></textarea>
            </div>

            <div className="space-y-3 pt-4 border-t border-[#333]">
              <h3 className="font-semibold text-white">Social Media Links</h3>
              <div className="flex items-center gap-3">
                <i className="fab fa-facebook text-blue-500 text-xl w-6"></i>
                <input type="url" value={settings.facebook_link} onChange={(e) => setSettings({...settings, facebook_link: e.target.value})} className="flex-1 bg-[#1a1a1a] border border-[#333] rounded px-3 py-2 text-white outline-none focus:border-[#00e676]" placeholder="https://facebook.com/..." />
              </div>
              <div className="flex items-center gap-3">
                <i className="fab fa-instagram text-pink-500 text-xl w-6"></i>
                <input type="url" value={settings.instagram_link} onChange={(e) => setSettings({...settings, instagram_link: e.target.value})} className="flex-1 bg-[#1a1a1a] border border-[#333] rounded px-3 py-2 text-white outline-none focus:border-[#00e676]" placeholder="https://instagram.com/..." />
              </div>
              <div className="flex items-center gap-3">
                <i className="fab fa-tiktok text-white text-xl w-6"></i>
                <input type="url" value={settings.tiktok_link} onChange={(e) => setSettings({...settings, tiktok_link: e.target.value})} className="flex-1 bg-[#1a1a1a] border border-[#333] rounded px-3 py-2 text-white outline-none focus:border-[#00e676]" placeholder="https://tiktok.com/..." />
              </div>
            </div>

            <div className="pt-4">
              <button type="submit" disabled={saving} className="w-full bg-[#00e676] text-black px-6 py-3 rounded-lg font-bold hover:bg-[#00c853] transition-all disabled:opacity-50">
                {saving ? "Saving..." : "Save Global Theme"}
              </button>
            </div>
          </form>
        </div>

        {/* Banner Management */}
        <div className="bg-[#111] p-6 rounded-xl border border-[#222]">
          <h2 className="text-xl font-bold mb-4">Homepage Banners</h2>
          
          <div className="flex gap-2 mb-6">
            <input 
              type="text" 
              value={newBannerUrl} 
              onChange={e => setNewBannerUrl(e.target.value)} 
              placeholder="Paste banner image URL here..."
              className="flex-1 bg-[#1a1a1a] border border-[#333] rounded px-3 py-2 text-white outline-none focus:border-[#00e676]"
            />
            <button onClick={handleAddBanner} className="bg-blue-600 text-white px-4 py-2 rounded font-bold hover:bg-blue-700">Add</button>
          </div>

          <div className="space-y-4">
            {banners.length === 0 ? (
              <p className="text-gray-500 text-sm">No banners uploaded yet.</p>
            ) : (
              banners.map(banner => (
                <div key={banner.id} className="relative group rounded-lg overflow-hidden border border-[#333]">
                  <img src={banner.image} alt="Banner" className="w-full h-32 object-cover" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button onClick={() => handleDeleteBanner(banner.id)} className="bg-red-600 text-white px-4 py-2 rounded font-bold shadow-lg">
                      <i className="fas fa-trash mr-2"></i> Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
