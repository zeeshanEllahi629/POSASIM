"use client";

import { useState } from "react";

export default function AddonsClient({ initialGroups, initialAddons, error }) {
  const [activeTab, setActiveTab] = useState("groups"); // 'groups' | 'addons'
  
  // Data State
  const [groups, setGroups] = useState(initialGroups || []);
  const [addons, setAddons] = useState(initialAddons || []);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");

  // Group Modal State
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [groupName, setGroupName] = useState("");
  const [selectionType, setSelectionType] = useState(1); // 1 = Required, 2 = Optional
  const [selectionCount, setSelectionCount] = useState(1); // 1 = Single, 2 = Multiple
  const [minCount, setMinCount] = useState(1);
  const [maxCount, setMaxCount] = useState(1);

  // Addon Modal State
  const [showAddonModal, setShowAddonModal] = useState(false);
  const [selectedAddon, setSelectedAddon] = useState(null);
  const [addonGroupId, setAddonGroupId] = useState("");
  const [addonName, setAddonName] = useState("");
  const [addonType, setAddonType] = useState(1); // 1 = Free, 2 = Paid
  const [addonPrice, setAddonPrice] = useState("0");

  // ================= GROUP HANDLERS =================
  const handleOpenGroupModal = (group = null) => {
    setFormError("");
    setSelectedGroup(group);
    if (group) {
      setGroupName(group.name);
      setSelectionType(group.selection_type);
      setSelectionCount(group.selection_count);
      setMinCount(group.min_count);
      setMaxCount(group.max_count);
    } else {
      setGroupName("");
      setSelectionType(1);
      setSelectionCount(1);
      setMinCount(1);
      setMaxCount(1);
    }
    setShowGroupModal(true);
  };

  const handleSaveGroup = async (e) => {
    e.preventDefault();
    if (!groupName.trim()) return;
    setLoading(true);
    setFormError("");

    const url = selectedGroup 
      ? `/api/admin/addons-group/${selectedGroup.id}`
      : `/api/admin/addons-group`;
    const method = selectedGroup ? "PUT" : "POST";

    const payload = {
      name: groupName,
      selection_type: Number(selectionType),
      selection_count: Number(selectionCount),
      min_count: Number(selectionCount) === 1 ? 1 : Number(minCount),
      max_count: Number(selectionCount) === 1 ? 1 : Number(maxCount),
    };

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.status === 1) {
        if (selectedGroup) {
          setGroups(groups.map(g => g.id === selectedGroup.id ? data.group : g));
        } else {
          setGroups([...groups, data.group]);
        }
        setShowGroupModal(false);
      } else {
        setFormError(data.error || "Failed to save group");
      }
    } catch (err) {
      setFormError("Connection error.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGroup = async (id) => {
    if (!confirm("Are you sure you want to delete this addon group?")) return;
    try {
      const res = await fetch(`/api/admin/addons-group/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.status === 1) {
        setGroups(groups.filter(g => g.id !== id));
      } else {
        alert(data.error || "Failed to delete group");
      }
    } catch (err) {
      alert("Connection error.");
    }
  };

  const handleToggleGroupStatus = async (id, currentStatus) => {
    const nextStatus = currentStatus === 1 ? 2 : 1;
    try {
      const res = await fetch(`/api/admin/addons-group/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_available: nextStatus }),
      });
      const data = await res.json();
      if (data.status === 1) {
        setGroups(groups.map(g => g.id === id ? { ...g, is_available: nextStatus } : g));
      } else {
        alert(data.error || "Failed to update status");
      }
    } catch (err) {
      alert("Connection error.");
    }
  };

  // ================= ADDON HANDLERS =================
  const handleOpenAddonModal = (addon = null) => {
    setFormError("");
    setSelectedAddon(addon);
    if (addon) {
      setAddonGroupId(addon.addongroup_id);
      setAddonName(addon.name);
      setAddonType(Number(addon.price) > 0 ? 2 : 1);
      setAddonPrice(addon.price);
    } else {
      setAddonGroupId(groups[0]?.id || "");
      setAddonName("");
      setAddonType(1);
      setAddonPrice("0");
    }
    setShowAddonModal(true);
  };

  const handleSaveAddon = async (e) => {
    e.preventDefault();
    if (!addonName.trim() || !addonGroupId) return;
    setLoading(true);
    setFormError("");

    const url = selectedAddon 
      ? `/api/admin/addons/${selectedAddon.id}`
      : `/api/admin/addons`;
    const method = selectedAddon ? "PUT" : "POST";

    const payload = {
      addongroup_id: Number(addonGroupId),
      name: addonName,
      type: Number(addonType),
      price: Number(addonType) === 1 ? "0" : String(addonPrice),
    };

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.status === 1) {
        if (selectedAddon) {
          setAddons(addons.map(a => a.id === selectedAddon.id ? data.addon : a));
        } else {
          setAddons([...addons, data.addon]);
        }
        setShowAddonModal(false);
      } else {
        setFormError(data.error || "Failed to save addon");
      }
    } catch (err) {
      setFormError("Connection error.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAddon = async (id) => {
    if (!confirm("Are you sure you want to delete this addon?")) return;
    try {
      const res = await fetch(`/api/admin/addons/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.status === 1) {
        setAddons(addons.filter(a => a.id !== id));
      } else {
        alert(data.error || "Failed to delete addon");
      }
    } catch (err) {
      alert("Connection error.");
    }
  };

  const handleToggleAddonStatus = async (id, currentStatus) => {
    const nextStatus = currentStatus === 1 ? 2 : 1;
    try {
      const res = await fetch(`/api/admin/addons/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_available: nextStatus }),
      });
      const data = await res.json();
      if (data.status === 1) {
        setAddons(addons.map(a => a.id === id ? { ...a, is_available: nextStatus } : a));
      } else {
        alert(data.error || "Failed to update status");
      }
    } catch (err) {
      alert("Connection error.");
    }
  };

  // Lists
  const filteredGroups = groups.filter(g => g.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredAddons = addons.filter(a => a.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/30 text-[#ff1744] text-xs">
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-[#222]">
        <button
          onClick={() => setActiveTab("groups")}
          className={`py-3 px-6 text-sm font-bold transition-all border-b-2 ${
            activeTab === "groups"
              ? "border-[#00e676] text-[#00e676]"
              : "border-transparent text-gray-400 hover:text-gray-200"
          }`}
        >
          Addon Groups
        </button>
        <button
          onClick={() => setActiveTab("addons")}
          className={`py-3 px-6 text-sm font-bold transition-all border-b-2 ${
            activeTab === "addons"
              ? "border-[#00e676] text-[#00e676]"
              : "border-transparent text-gray-400 hover:text-gray-200"
          }`}
        >
          Addons
        </button>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-[#111111]/60 border border-[#222222] p-4 rounded-2xl">
        <div className="relative flex-1 max-w-md">
          <i className="fas fa-search absolute left-4.5 top-1/2 -translate-y-1/2 text-gray-500"></i>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${activeTab === 'groups' ? 'groups' : 'addons'}...`}
            className="w-full pl-11 pr-4 py-2.5 bg-[#080808] border border-[#222222] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#00e676]/50 focus:ring-1 focus:ring-[#00e676]/30 transition-all text-sm"
          />
        </div>
        <button
          onClick={() => activeTab === "groups" ? handleOpenGroupModal() : handleOpenAddonModal()}
          className="bg-[#00e676] text-[#0d0d0d] hover:bg-[#00c853] py-2.5 px-5 rounded-xl font-bold text-sm tracking-wide transition-all shadow-lg shadow-[#00e676]/10 flex items-center justify-center gap-2"
        >
          <i className="fas fa-plus"></i> Add {activeTab === "groups" ? "Group" : "Addon"}
        </button>
      </div>

      {/* Tables */}
      <div className="bg-[#111]/80 border border-[#222] rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          {activeTab === "groups" ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#222] text-[10px] text-gray-500 uppercase font-bold tracking-wider bg-[#0a0a0a]">
                  <th className="py-4 px-6">Name</th>
                  <th className="py-4 px-6">Selection Type</th>
                  <th className="py-4 px-6">Count Range</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1c1c1c] text-xs">
                {filteredGroups.map(g => (
                  <tr key={g.id} className="hover:bg-[#161616]/40 transition-colors">
                    <td className="py-4 px-6 font-semibold text-gray-200">{g.name}</td>
                    <td className="py-4 px-6 text-gray-400">
                      {g.selection_type === 1 ? "Required" : "Optional"}
                    </td>
                    <td className="py-4 px-6 text-gray-400">
                      {g.selection_count === 1 ? "Single" : `Multiple (${g.min_count} - ${g.max_count})`}
                    </td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => handleToggleGroupStatus(g.id, g.is_available)}
                        className={`px-3 py-1 rounded-full border text-[10px] font-bold transition-all ${
                          g.is_available === 1
                            ? "bg-green-950/20 border-green-500/20 text-[#00e676]"
                            : "bg-red-950/20 border-red-500/20 text-[#ff1744]"
                        }`}
                      >
                        {g.is_available === 1 ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <button
                        onClick={() => handleOpenGroupModal(g)}
                        className="px-2.5 py-1.5 bg-[#1c1c1c] border border-[#333] hover:border-gray-500 rounded-lg text-gray-300 hover:text-white transition-all"
                      >
                        <i className="fas fa-edit"></i> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteGroup(g.id)}
                        className="px-2.5 py-1.5 bg-red-950/10 border border-red-950/30 text-[#ff1744] hover:bg-[#ff1744]/15 rounded-lg transition-all"
                      >
                        <i className="fas fa-trash-alt"></i> Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredGroups.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center py-12 text-gray-500">No groups found</td>
                  </tr>
                )}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#222] text-[10px] text-gray-500 uppercase font-bold tracking-wider bg-[#0a0a0a]">
                  <th className="py-4 px-6">Name</th>
                  <th className="py-4 px-6">Group</th>
                  <th className="py-4 px-6">Price</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1c1c1c] text-xs">
                {filteredAddons.map(a => {
                  const groupName = groups.find(g => g.id === a.addongroup_id)?.name || "Unknown";
                  return (
                    <tr key={a.id} className="hover:bg-[#161616]/40 transition-colors">
                      <td className="py-4 px-6 font-semibold text-gray-200">{a.name}</td>
                      <td className="py-4 px-6 text-gray-400">{groupName}</td>
                      <td className="py-4 px-6 text-gray-400">
                        {Number(a.price) === 0 ? "Free" : `$${a.price}`}
                      </td>
                      <td className="py-4 px-6">
                        <button
                          onClick={() => handleToggleAddonStatus(a.id, a.is_available)}
                          className={`px-3 py-1 rounded-full border text-[10px] font-bold transition-all ${
                            a.is_available === 1
                              ? "bg-green-950/20 border-green-500/20 text-[#00e676]"
                              : "bg-red-950/20 border-red-500/20 text-[#ff1744]"
                          }`}
                        >
                          {a.is_available === 1 ? "Active" : "Inactive"}
                        </button>
                      </td>
                      <td className="py-4 px-6 text-right space-x-2">
                        <button
                          onClick={() => handleOpenAddonModal(a)}
                          className="px-2.5 py-1.5 bg-[#1c1c1c] border border-[#333] hover:border-gray-500 rounded-lg text-gray-300 hover:text-white transition-all"
                        >
                          <i className="fas fa-edit"></i> Edit
                        </button>
                        <button
                          onClick={() => handleDeleteAddon(a.id)}
                          className="px-2.5 py-1.5 bg-red-950/10 border border-red-950/30 text-[#ff1744] hover:bg-[#ff1744]/15 rounded-lg transition-all"
                        >
                          <i className="fas fa-trash-alt"></i> Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {filteredAddons.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center py-12 text-gray-500">No addons found</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* ========== GROUP MODAL ========== */}
      {showGroupModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" onClick={() => setShowGroupModal(false)}></div>
          <div className="relative bg-[#111111] border border-[#222] rounded-2xl w-full max-w-lg overflow-hidden flex flex-col z-10">
            <div className="p-5 border-b border-[#222] flex items-center justify-between">
              <h3 className="text-base font-bold flex items-center gap-2">
                <i className={`fas ${selectedGroup ? "fa-edit" : "fa-folder-plus"} text-[#00e676]`}></i> 
                {selectedGroup ? "Edit Group" : "Add New Group"}
              </h3>
              <button onClick={() => setShowGroupModal(false)} className="text-gray-400 hover:text-white">
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            {formError && (
              <div className="mx-6 mt-4 p-3 rounded-lg bg-red-950/20 border border-red-500/20 text-[#ff1744] text-[11px]">
                {formError}
              </div>
            )}

            <form onSubmit={handleSaveGroup} className="p-6 space-y-4">
              <div className="form-group">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Group Name</label>
                <input
                  type="text"
                  required
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#050505] border border-[#222] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#00e676]/50 text-sm"
                />
              </div>

              <div className="flex gap-4">
                <div className="flex-1 form-group">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Selection Type</label>
                  <div className="flex gap-4 items-center h-[42px]">
                    <label className="flex items-center gap-2 text-sm text-gray-300">
                      <input type="radio" name="selection_type" value={1} checked={Number(selectionType) === 1} onChange={(e) => setSelectionType(Number(e.target.value))} className="accent-[#00e676]" /> Required
                    </label>
                    <label className="flex items-center gap-2 text-sm text-gray-300">
                      <input type="radio" name="selection_type" value={2} checked={Number(selectionType) === 2} onChange={(e) => setSelectionType(Number(e.target.value))} className="accent-[#00e676]" /> Optional
                    </label>
                  </div>
                </div>

                <div className="flex-1 form-group">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Selection Count</label>
                  <div className="flex gap-4 items-center h-[42px]">
                    <label className="flex items-center gap-2 text-sm text-gray-300">
                      <input type="radio" name="selection_count" value={1} checked={Number(selectionCount) === 1} onChange={(e) => setSelectionCount(Number(e.target.value))} className="accent-[#00e676]" /> Single
                    </label>
                    <label className="flex items-center gap-2 text-sm text-gray-300">
                      <input type="radio" name="selection_count" value={2} checked={Number(selectionCount) === 2} onChange={(e) => setSelectionCount(Number(e.target.value))} className="accent-[#00e676]" /> Multiple
                    </label>
                  </div>
                </div>
              </div>

              {Number(selectionCount) === 2 && (
                <div className="flex gap-4">
                  <div className="flex-1 form-group">
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Min Count</label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={minCount}
                      onChange={(e) => setMinCount(e.target.value)}
                      className="w-full px-4 py-2.5 bg-[#050505] border border-[#222] rounded-xl text-white focus:outline-none focus:border-[#00e676]/50 text-sm"
                    />
                  </div>
                  <div className="flex-1 form-group">
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Max Count</label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={maxCount}
                      onChange={(e) => setMaxCount(e.target.value)}
                      className="w-full px-4 py-2.5 bg-[#050505] border border-[#222] rounded-xl text-white focus:outline-none focus:border-[#00e676]/50 text-sm"
                    />
                  </div>
                </div>
              )}

              <div className="pt-4 flex gap-3 border-t border-[#222] mt-6">
                <button
                  type="button"
                  onClick={() => setShowGroupModal(false)}
                  className="flex-1 py-2.5 bg-[#1c1c1c] hover:bg-[#222] rounded-xl border border-[#222] text-xs font-bold transition-all text-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2.5 bg-[#00e676] text-[#0d0d0d] hover:bg-[#00c853] rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
                >
                  {loading ? <i className="fas fa-spinner fa-spin"></i> : "Save Group"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========== ADDON MODAL ========== */}
      {showAddonModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" onClick={() => setShowAddonModal(false)}></div>
          <div className="relative bg-[#111111] border border-[#222] rounded-2xl w-full max-w-md overflow-hidden flex flex-col z-10">
            <div className="p-5 border-b border-[#222] flex items-center justify-between">
              <h3 className="text-base font-bold flex items-center gap-2">
                <i className={`fas ${selectedAddon ? "fa-edit" : "fa-plus-circle"} text-[#00e676]`}></i> 
                {selectedAddon ? "Edit Addon" : "Add New Addon"}
              </h3>
              <button onClick={() => setShowAddonModal(false)} className="text-gray-400 hover:text-white">
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            {formError && (
              <div className="mx-6 mt-4 p-3 rounded-lg bg-red-950/20 border border-red-500/20 text-[#ff1744] text-[11px]">
                {formError}
              </div>
            )}

            <form onSubmit={handleSaveAddon} className="p-6 space-y-4">
              <div className="form-group">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Select Group</label>
                <select
                  required
                  value={addonGroupId}
                  onChange={(e) => setAddonGroupId(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#050505] border border-[#222] rounded-xl text-white focus:outline-none focus:border-[#00e676]/50 text-sm"
                >
                  <option value="" disabled>Select a group</option>
                  {groups.map(g => (
                    <option key={g.id} value={g.id}>{g.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Addon Name</label>
                <input
                  type="text"
                  required
                  value={addonName}
                  onChange={(e) => setAddonName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#050505] border border-[#222] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#00e676]/50 text-sm"
                />
              </div>

              <div className="form-group">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Type</label>
                <div className="flex gap-4 items-center h-[42px]">
                  <label className="flex items-center gap-2 text-sm text-gray-300">
                    <input type="radio" name="addon_type" value={1} checked={Number(addonType) === 1} onChange={(e) => setAddonType(Number(e.target.value))} className="accent-[#00e676]" /> Free
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-300">
                    <input type="radio" name="addon_type" value={2} checked={Number(addonType) === 2} onChange={(e) => setAddonType(Number(e.target.value))} className="accent-[#00e676]" /> Paid
                  </label>
                </div>
              </div>

              {Number(addonType) === 2 && (
                <div className="form-group">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Price</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={addonPrice}
                    onChange={(e) => setAddonPrice(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#050505] border border-[#222] rounded-xl text-white focus:outline-none focus:border-[#00e676]/50 text-sm"
                  />
                </div>
              )}

              <div className="pt-4 flex gap-3 border-t border-[#222] mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddonModal(false)}
                  className="flex-1 py-2.5 bg-[#1c1c1c] hover:bg-[#222] rounded-xl border border-[#222] text-xs font-bold transition-all text-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2.5 bg-[#00e676] text-[#0d0d0d] hover:bg-[#00c853] rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
                >
                  {loading ? <i className="fas fa-spinner fa-spin"></i> : "Save Addon"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
