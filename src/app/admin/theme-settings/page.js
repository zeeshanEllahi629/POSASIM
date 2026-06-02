"use client";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

export default function ThemeSettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [loading, setLoading] = useState(true);

  // General Settings
  const [settings, setSettings] = useState({
    logo: "",
    web_primary_color: "#e7272d",
    web_secondary_color: "#333333",
    footer_title: "",
    footer_description: "",
    footer_logo: "",
  });
  
  // Sliders
  const [sliders, setSliders] = useState([]);
  const [newSlider, setNewSlider] = useState({ title: "", description: "", image: "" });

  // Social Links
  const [socialLinks, setSocialLinks] = useState([]);
  const [newSocialLink, setNewSocialLink] = useState({ icon: "", link: "" });

  useEffect(() => {
    fetchSettings();
    fetchSliders();
    fetchSocialLinks();
  }, []);

  const fetchSettings = async () => {
    try {
      // Changed to admin2/theme
      const res = await fetch("/api/admin2/theme");
      const data = await res.json();
      if (data.success && data.settings) {
        setSettings({
          logo: data.settings.logo || "",
          web_primary_color: data.settings.web_primary_color || "#e7272d",
          web_secondary_color: data.settings.web_secondary_color || "#333333",
          footer_title: data.settings.footer_title || "",
          footer_description: data.settings.footer_description || "",
          footer_logo: data.settings.footer_logo || "",
        });
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const fetchSliders = async () => {
    try {
      const res = await fetch("/api/admin/sliders");
      const data = await res.json();
      if (data.status === 1) {
        setSliders(data.sliders || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchSocialLinks = async () => {
    try {
      const res = await fetch("/api/admin2/social-links");
      const data = await res.json();
      if (data.status === 1) {
        setSocialLinks(data.links || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const saveSettings = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin2/theme", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Theme settings updated successfully");
      } else {
        toast.error("Failed to update theme settings");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
    setLoading(false);
  };

  const addSlider = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin/sliders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSlider),
      });
      const data = await res.json();
      if (data.status === 1) {
        toast.success("Slider added successfully");
        setNewSlider({ title: "", description: "", image: "" });
        fetchSliders();
      } else {
        toast.error("Failed to add slider");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
    setLoading(false);
  };

  const deleteSlider = async (id) => {
    if (!confirm("Are you sure you want to delete this slider?")) return;
    try {
      const res = await fetch(`/api/admin/sliders?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.status === 1) {
        toast.success("Slider deleted");
        fetchSliders();
      } else {
        toast.error("Failed to delete slider");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  const addSocialLink = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin2/social-links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSocialLink),
      });
      const data = await res.json();
      if (data.status === 1) {
        toast.success("Social link added");
        setNewSocialLink({ icon: "", link: "" });
        fetchSocialLinks();
      } else {
        toast.error("Failed to add social link");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
    setLoading(false);
  };

  const deleteSocialLink = async (id) => {
    if (!confirm("Delete this social link?")) return;
    try {
      const res = await fetch(`/api/admin2/social-links/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.status === 1) {
        toast.success("Social link deleted");
        fetchSocialLinks();
      } else {
        toast.error("Failed to delete link");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  if (loading && !settings.web_primary_color) {
    return <div className="p-8 text-white">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto pb-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Theme & Display Settings</h1>
      </div>

      <div className="bg-[#111] border border-[#222] rounded-xl overflow-hidden mb-6">
        <div className="flex border-b border-[#222] overflow-x-auto">
          <button 
            className={`px-6 py-4 whitespace-nowrap font-semibold text-sm transition-colors ${activeTab === 'general' ? 'text-[#00e676] border-b-2 border-[#00e676]' : 'text-gray-400 hover:text-white'}`}
            onClick={() => setActiveTab('general')}
          >
            General Theme
          </button>
          <button 
            className={`px-6 py-4 whitespace-nowrap font-semibold text-sm transition-colors ${activeTab === 'sliders' ? 'text-[#00e676] border-b-2 border-[#00e676]' : 'text-gray-400 hover:text-white'}`}
            onClick={() => setActiveTab('sliders')}
          >
            Homepage Banners
          </button>
          <button 
            className={`px-6 py-4 whitespace-nowrap font-semibold text-sm transition-colors ${activeTab === 'footer' ? 'text-[#00e676] border-b-2 border-[#00e676]' : 'text-gray-400 hover:text-white'}`}
            onClick={() => setActiveTab('footer')}
          >
            Footer & Links
          </button>
        </div>
      </div>

      {activeTab === "general" && (
        <form onSubmit={saveSettings} className="bg-[#111] border border-[#222] rounded-xl p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-400 mb-2">Website Logo URL</label>
              <input 
                type="text" 
                value={settings.logo}
                onChange={(e) => setSettings({ ...settings, logo: e.target.value })}
                className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-2.5 text-white focus:border-[#00e676]" 
                placeholder="https://example.com/logo.png" 
              />
              {settings.logo && (
                <div className="mt-4 p-4 bg-white/5 rounded-lg inline-block">
                  <img src={settings.logo} alt="Logo Preview" className="h-12 object-contain" />
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">Primary Color (Buttons, Accents)</label>
                <div className="flex items-center gap-3">
                  <input 
                    type="color" 
                    value={settings.web_primary_color}
                    onChange={(e) => setSettings({ ...settings, web_primary_color: e.target.value })}
                    className="w-12 h-12 rounded cursor-pointer border-0 bg-transparent" 
                  />
                  <input 
                    type="text" 
                    value={settings.web_primary_color}
                    onChange={(e) => setSettings({ ...settings, web_primary_color: e.target.value })}
                    className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-2.5 text-white focus:border-[#00e676]" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">Secondary Color (Hover states, Footers)</label>
                <div className="flex items-center gap-3">
                  <input 
                    type="color" 
                    value={settings.web_secondary_color}
                    onChange={(e) => setSettings({ ...settings, web_secondary_color: e.target.value })}
                    className="w-12 h-12 rounded cursor-pointer border-0 bg-transparent" 
                  />
                  <input 
                    type="text" 
                    value={settings.web_secondary_color}
                    onChange={(e) => setSettings({ ...settings, web_secondary_color: e.target.value })}
                    className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-2.5 text-white focus:border-[#00e676]" 
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button type="submit" disabled={loading} className="px-8 py-3 rounded-lg font-bold text-[#0d0d0d] bg-[#00e676] hover:bg-[#00c853] transition-colors shadow-lg shadow-[#00e676]/20">
              {loading ? "Saving..." : "Save Theme"}
            </button>
          </div>
        </form>
      )}

      {activeTab === "sliders" && (
        <div className="space-y-6">
          <form onSubmit={addSlider} className="bg-[#111] border border-[#222] rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Add New Banner/Slider</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Banner Text (Title)</label>
                <input required type="text" value={newSlider.title} onChange={e => setNewSlider({...newSlider, title: e.target.value})} className="w-full bg-[#1a1a1a] border border-[#333] rounded px-3 py-2 text-white" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Image URL</label>
                <input required type="text" value={newSlider.image} onChange={e => setNewSlider({...newSlider, image: e.target.value})} className="w-full bg-[#1a1a1a] border border-[#333] rounded px-3 py-2 text-white" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-400 mb-1">Description</label>
                <textarea value={newSlider.description} onChange={e => setNewSlider({...newSlider, description: e.target.value})} className="w-full bg-[#1a1a1a] border border-[#333] rounded px-3 py-2 text-white" rows="2"></textarea>
              </div>
            </div>
            <button type="submit" className="px-6 py-2 rounded font-bold text-[#0d0d0d] bg-[#00e676] hover:bg-[#00c853]">Add Banner</button>
          </form>

          <div className="bg-[#111] border border-[#222] rounded-xl overflow-hidden">
            <table className="w-full text-left text-sm text-gray-300">
              <thead className="bg-[#1a1a1a] text-gray-400 uppercase">
                <tr>
                  <th className="px-4 py-3">Image</th>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#222]">
                {sliders.map(s => (
                  <tr key={s.id} className="hover:bg-[#1a1a1a]">
                    <td className="px-4 py-3"><img src={s.image} alt="Slider" className="h-12 w-24 object-cover rounded" /></td>
                    <td className="px-4 py-3 font-semibold text-white">{s.title}</td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => deleteSlider(s.id)} className="text-red-500 hover:text-red-400"><i className="fa-solid fa-trash"></i></button>
                    </td>
                  </tr>
                ))}
                {sliders.length === 0 && (
                  <tr>
                    <td colSpan="3" className="px-4 py-8 text-center text-gray-500">No banners added yet</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "footer" && (
        <div className="space-y-6">
          <form onSubmit={saveSettings} className="bg-[#111] border border-[#222] rounded-xl p-6 space-y-6">
            <h2 className="text-lg font-semibold text-white mb-4">Footer Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-400 mb-2">Footer Title</label>
                  <input 
                    type="text" 
                    value={settings.footer_title}
                    onChange={(e) => setSettings({ ...settings, footer_title: e.target.value })}
                    className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-2.5 text-white focus:border-[#00e676]" 
                    placeholder="e.g. About Us" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-400 mb-2">Footer Logo URL</label>
                  <input 
                    type="text" 
                    value={settings.footer_logo}
                    onChange={(e) => setSettings({ ...settings, footer_logo: e.target.value })}
                    className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-2.5 text-white focus:border-[#00e676]" 
                    placeholder="https://example.com/footer-logo.png" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">Footer Description</label>
                <textarea 
                  value={settings.footer_description}
                  onChange={(e) => setSettings({ ...settings, footer_description: e.target.value })}
                  className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-2.5 text-white focus:border-[#00e676]" 
                  rows="4"
                  placeholder="Enter the short description for the footer..."
                ></textarea>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button type="submit" disabled={loading} className="px-8 py-3 rounded-lg font-bold text-[#0d0d0d] bg-[#00e676] hover:bg-[#00c853] transition-colors shadow-lg shadow-[#00e676]/20">
                {loading ? "Saving..." : "Save Footer"}
              </button>
            </div>
          </form>

          {/* Social Links Section */}
          <div className="bg-[#111] border border-[#222] rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Social Media Links</h2>
            <form onSubmit={addSocialLink} className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-6">
              <div className="md:col-span-4">
                <label className="block text-sm text-gray-400 mb-1">FontAwesome Icon Class</label>
                <input 
                  required 
                  type="text" 
                  value={newSocialLink.icon} 
                  onChange={e => setNewSocialLink({...newSocialLink, icon: e.target.value})} 
                  className="w-full bg-[#1a1a1a] border border-[#333] rounded px-3 py-2 text-white" 
                  placeholder="e.g. fab fa-facebook"
                />
              </div>
              <div className="md:col-span-6">
                <label className="block text-sm text-gray-400 mb-1">Social Profile Link</label>
                <input 
                  required 
                  type="url" 
                  value={newSocialLink.link} 
                  onChange={e => setNewSocialLink({...newSocialLink, link: e.target.value})} 
                  className="w-full bg-[#1a1a1a] border border-[#333] rounded px-3 py-2 text-white" 
                  placeholder="https://facebook.com/yourpage"
                />
              </div>
              <div className="md:col-span-2 flex items-end">
                <button type="submit" className="w-full px-4 py-2 rounded font-bold text-[#0d0d0d] bg-[#00e676] hover:bg-[#00c853]">
                  Add Link
                </button>
              </div>
            </form>

            <div className="bg-[#1a1a1a] border border-[#333] rounded-lg overflow-hidden">
              <table className="w-full text-left text-sm text-gray-300">
                <thead className="bg-[#222] text-gray-400 uppercase">
                  <tr>
                    <th className="px-4 py-3 w-16 text-center">Icon</th>
                    <th className="px-4 py-3">Link</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#333]">
                  {socialLinks.map(s => (
                    <tr key={s.id} className="hover:bg-[#252525]">
                      <td className="px-4 py-3 text-center text-xl text-[#00e676]">
                        <i className={s.icon}></i>
                      </td>
                      <td className="px-4 py-3">
                        <a href={s.link} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">{s.link}</a>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button onClick={() => deleteSocialLink(s.id)} className="text-red-500 hover:text-red-400">
                          <i className="fa-solid fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                  {socialLinks.length === 0 && (
                    <tr>
                      <td colSpan="3" className="px-4 py-6 text-center text-gray-500">No social links added yet</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
