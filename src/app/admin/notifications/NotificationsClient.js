"use client";

import { useState } from "react";

export default function NotificationsClient({ initialData, categories, items, error }) {
  const [notifications, setNotifications] = useState(initialData);
  
  // Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Form fields
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [catId, setCatId] = useState("");
  const [itemId, setItemId] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");

  const handleOpenAddModal = () => {
    setTitle("");
    setMessage("");
    setCatId("");
    setItemId("");
    setFormError("");
    setShowAddModal(true);
  };

  const handleSendNotification = async (e) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;
    
    setLoading(true);
    setFormError("");

    try {
      const res = await fetch("/api/admin/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          message,
          cat_id: catId,
          item_id: itemId,
        }),
      });

      const data = await res.json();
      if (data.status === 1) {
        // Optimistically add to top
        const newNotif = {
          ...data.notification,
          category_name: catId ? categories.find(c => c.id === catId)?.category_name : null,
          item_name: itemId ? items.find(i => i.id === itemId)?.item_name : null,
        };
        setNotifications([newNotif, ...notifications]);
        setShowAddModal(false);
      } else {
        setFormError(data.error || "Failed to send notification");
      }
    } catch (err) {
      setFormError("Connection error. Please try again.");
    } finally {
      setLoading(false);
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
      <div className="flex justify-end bg-[#111111]/60 border border-[#222222] p-4 rounded-2xl">
        <button
          onClick={handleOpenAddModal}
          className="bg-[#00e676] text-[#0d0d0d] hover:bg-[#00c853] py-2.5 px-5 rounded-xl font-bold text-sm tracking-wide transition-all shadow-lg shadow-[#00e676]/10 flex items-center justify-center gap-2"
        >
          <i className="fas fa-paper-plane"></i> Send Notification
        </button>
      </div>

      {/* ========== NOTIFICATIONS LIST TABLE ========== */}
      <div className="bg-[#111]/80 border border-[#222] rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#222] text-[10px] text-gray-500 uppercase font-bold tracking-wider bg-[#0a0a0a]">
                <th className="py-4 px-6 w-16">ID</th>
                <th className="py-4 px-6">Title</th>
                <th className="py-4 px-6">Message</th>
                <th className="py-4 px-6 text-center">Linked Type</th>
                <th className="py-4 px-6 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1c1c1c] text-xs">
              {notifications.map((notif) => (
                <tr key={notif.id} className="hover:bg-[#161616]/40 transition-colors group">
                  <td className="py-4 px-6 text-gray-500 font-mono">#{notif.id}</td>
                  <td className="py-4 px-6 font-semibold text-gray-200">
                    {notif.title}
                  </td>
                  <td className="py-4 px-6 text-gray-400 max-w-md truncate">
                    {notif.message}
                  </td>
                  <td className="py-4 px-6 text-center">
                    {notif.category_name ? (
                      <span className="px-3 py-1 rounded-full border text-[10px] font-bold text-blue-400 bg-blue-950/30 border-blue-500/30">
                        Category: {notif.category_name}
                      </span>
                    ) : notif.item_name ? (
                      <span className="px-3 py-1 rounded-full border text-[10px] font-bold text-purple-400 bg-purple-950/30 border-purple-500/30">
                        Item: {notif.item_name}
                      </span>
                    ) : (
                      <span className="text-gray-500 italic">-</span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-right text-gray-500">
                    {new Date(notif.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {notifications.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-12 text-gray-500">
                    No notifications sent yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========== SEND NOTIFICATION MODAL ========== */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" onClick={() => setShowAddModal(false)}></div>
          <div className="relative bg-[#111111] border border-[#222] rounded-2xl w-full max-w-lg overflow-hidden flex flex-col z-10">
            <div className="p-5 border-b border-[#222] flex items-center justify-between">
              <h3 className="text-base font-bold flex items-center gap-2">
                <i className="fas fa-broadcast-tower text-[#00e676]"></i> New Notification
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

            <form onSubmit={handleSendNotification} className="p-6 space-y-4">
              <div className="form-group">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Flash Sale!"
                  className="w-full px-4 py-2.5 bg-[#050505] border border-[#222] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#00e676]/50 text-sm"
                />
              </div>

              <div className="form-group">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Message
                </label>
                <textarea
                  required
                  rows="3"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="e.g. Get 20% off on all items today."
                  className="w-full px-4 py-2.5 bg-[#050505] border border-[#222] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#00e676]/50 text-sm"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Link Category
                  </label>
                  <select
                    value={catId}
                    onChange={(e) => {
                      setCatId(e.target.value);
                      if (e.target.value) setItemId(""); // Mutually exclusive
                    }}
                    className="w-full px-4 py-2.5 bg-[#050505] border border-[#222] rounded-xl text-white focus:outline-none focus:border-[#00e676]/50 text-sm"
                  >
                    <option value="">-- None --</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.category_name}</option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Link Item
                  </label>
                  <select
                    value={itemId}
                    onChange={(e) => {
                      setItemId(e.target.value);
                      if (e.target.value) setCatId(""); // Mutually exclusive
                    }}
                    className="w-full px-4 py-2.5 bg-[#050505] border border-[#222] rounded-xl text-white focus:outline-none focus:border-[#00e676]/50 text-sm"
                  >
                    <option value="">-- None --</option>
                    {items.map((i) => (
                      <option key={i.id} value={i.id}>{i.item_name}</option>
                    ))}
                  </select>
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
                  {loading ? <i className="fas fa-spinner fa-spin"></i> : <><i className="fas fa-paper-plane"></i> Send Now</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
