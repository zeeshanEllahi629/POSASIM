"use client";

import { useState } from "react";

export default function SalesAgentsClient({ initialAgents, users, branches, error }) {
  const [agents, setAgents] = useState(initialAgents);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);

  // Form inputs
  const [userId, setUserId] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [commissionRate, setCommissionRate] = useState("");
  const [branchId, setBranchId] = useState("");
  const [status, setStatus] = useState(1);
  
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");

  const handleOpenAddModal = () => {
    setUserId("");
    setTargetAmount("");
    setCommissionRate("");
    setBranchId("");
    setStatus(1);
    setFormError("");
    setShowAddModal(true);
  };

  const handleOpenEditModal = (agent) => {
    setSelectedAgent(agent);
    setUserId(agent.user_id);
    setTargetAmount(agent.target_amount);
    setCommissionRate(agent.commission_rate);
    setBranchId(agent.branch_id || "");
    setStatus(agent.status);
    setFormError("");
    setShowEditModal(true);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!userId) {
      setFormError("User is required");
      return;
    }
    setLoading(true);
    setFormError("");

    try {
      const res = await fetch("/api/admin/sales-agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          target_amount: parseFloat(targetAmount) || 0,
          commission_rate: parseFloat(commissionRate) || 0,
          branch_id: branchId || null,
          status: parseInt(status, 10),
        }),
      });

      const data = await res.json();
      if (data.status === 1) {
        setAgents([data.agent, ...agents]);
        setShowAddModal(false);
      } else {
        setFormError(data.error || "Failed to add agent");
      }
    } catch (err) {
      setFormError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    if (!selectedAgent) return;
    setLoading(true);
    setFormError("");

    try {
      const res = await fetch(`/api/admin/sales-agents/${selectedAgent.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          target_amount: parseFloat(targetAmount) || 0,
          commission_rate: parseFloat(commissionRate) || 0,
          branch_id: branchId || null,
          status: parseInt(status, 10),
        }),
      });

      const data = await res.json();
      if (data.status === 1) {
        setAgents(
          agents.map((a) => (a.id === selectedAgent.id ? data.agent : a))
        );
        setShowEditModal(false);
      } else {
        setFormError(data.error || "Failed to update agent");
      }
    } catch (err) {
      setFormError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this agent?")) return;

    try {
      const res = await fetch(`/api/admin/sales-agents/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (data.status === 1) {
        setAgents(agents.filter((a) => a.id !== id));
      } else {
        alert(data.error || "Failed to delete agent");
      }
    } catch (err) {
      alert("Failed to connect to server");
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const nextStatus = currentStatus === 1 ? 0 : 1;
    try {
      const res = await fetch(`/api/admin/sales-agents/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });

      const data = await res.json();
      if (data.status === 1) {
        setAgents(
          agents.map((a) => (a.id === id ? { ...a, status: nextStatus } : a))
        );
      } else {
        alert(data.error || "Failed to update status");
      }
    } catch (err) {
      alert("Failed to connect to server");
    }
  };

  const filtered = agents.filter((a) =>
    a.user_name?.toLowerCase().includes(searchQuery.toLowerCase())
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
            placeholder="Search agents..."
            className="w-full pl-11 pr-4 py-2.5 bg-[#080808] border border-[#222222] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#00e676]/50 focus:ring-1 focus:ring-[#00e676]/30 transition-all text-sm"
          />
        </div>
        <button
          onClick={handleOpenAddModal}
          className="bg-[#00e676] text-[#0d0d0d] hover:bg-[#00c853] py-2.5 px-5 rounded-xl font-bold text-sm tracking-wide transition-all shadow-lg shadow-[#00e676]/10 flex items-center justify-center gap-2"
        >
          <i className="fas fa-plus"></i> Assign Agent
        </button>
      </div>

      {/* ========== LIST TABLE ========== */}
      <div className="bg-[#111]/80 border border-[#222] rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#222] text-[10px] text-gray-500 uppercase font-bold tracking-wider bg-[#0a0a0a]">
                <th className="py-4 px-6">User</th>
                <th className="py-4 px-6">Branch</th>
                <th className="py-4 px-6">Target</th>
                <th className="py-4 px-6">Commission (%)</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1c1c1c] text-xs">
              {filtered.map((agent) => (
                <tr key={agent.id} className="hover:bg-[#161616]/40 transition-colors group">
                  <td className="py-4 px-6 font-semibold text-gray-200">
                    <div className="flex flex-col">
                      <span>{agent.user_name}</span>
                      <span className="text-[10px] text-gray-500 font-normal">{agent.user_email}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-gray-400">
                    {agent.branch_name}
                  </td>
                  <td className="py-4 px-6 text-gray-300">
                    ${agent.target_amount}
                  </td>
                  <td className="py-4 px-6 text-gray-300">
                    {agent.commission_rate}%
                  </td>
                  <td className="py-4 px-6">
                    <button
                      onClick={() => handleToggleStatus(agent.id, agent.status)}
                      className={`px-3 py-1 rounded-full border text-[10px] font-bold transition-all ${
                        agent.status === 1
                          ? "bg-green-950/20 border-green-500/20 text-[#00e676]"
                          : "bg-red-950/20 border-red-500/20 text-[#ff1744]"
                      }`}
                    >
                      {agent.status === 1 ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="py-4 px-6 text-right space-x-2">
                    <button
                      onClick={() => handleOpenEditModal(agent)}
                      className="px-2.5 py-1.5 bg-[#1c1c1c] border border-[#333] hover:border-gray-500 rounded-lg text-gray-300 hover:text-white transition-all inline-flex items-center gap-1"
                    >
                      <i className="fas fa-edit"></i> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(agent.id)}
                      className="px-2.5 py-1.5 bg-red-950/10 border border-red-950/30 text-[#ff1744] hover:bg-[#ff1744]/15 rounded-lg transition-all inline-flex items-center gap-1"
                    >
                      <i className="fas fa-trash-alt"></i> Delete
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-gray-500">
                    No agents found
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
                <i className="fas fa-user-plus text-[#00e676]"></i> Assign Agent
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

            <form onSubmit={handleAdd} className="p-6 space-y-4">
              <div className="form-group">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  User
                </label>
                <select
                  required
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#050505] border border-[#222] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#00e676]/50 text-sm"
                >
                  <option value="">Select User</option>
                  {users.map(u => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Branch (Optional)
                </label>
                <select
                  value={branchId}
                  onChange={(e) => setBranchId(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#050505] border border-[#222] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#00e676]/50 text-sm"
                >
                  <option value="">No Branch</option>
                  {branches.map(b => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Target Amount
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={targetAmount}
                    onChange={(e) => setTargetAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full px-4 py-2.5 bg-[#050505] border border-[#222] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#00e676]/50 text-sm"
                  />
                </div>
                <div className="form-group">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Commission (%)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={commissionRate}
                    onChange={(e) => setCommissionRate(e.target.value)}
                    placeholder="0.00"
                    className="w-full px-4 py-2.5 bg-[#050505] border border-[#222] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#00e676]/50 text-sm"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#050505] border border-[#222] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#00e676]/50 text-sm"
                >
                  <option value={1}>Active</option>
                  <option value={0}>Inactive</option>
                </select>
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
                  {loading ? <i className="fas fa-spinner fa-spin"></i> : "Assign Agent"}
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
                <i className="fas fa-edit text-[#00e676]"></i> Edit Agent
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

            <form onSubmit={handleEdit} className="p-6 space-y-4">
              <div className="form-group">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  User
                </label>
                <input
                  type="text"
                  disabled
                  value={selectedAgent?.user_name || ""}
                  className="w-full px-4 py-2.5 bg-[#050505] border border-[#222] rounded-xl text-gray-500 focus:outline-none text-sm cursor-not-allowed"
                />
              </div>

              <div className="form-group">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Branch (Optional)
                </label>
                <select
                  value={branchId}
                  onChange={(e) => setBranchId(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#050505] border border-[#222] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#00e676]/50 text-sm"
                >
                  <option value="">No Branch</option>
                  {branches.map(b => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Target Amount
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={targetAmount}
                    onChange={(e) => setTargetAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full px-4 py-2.5 bg-[#050505] border border-[#222] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#00e676]/50 text-sm"
                  />
                </div>
                <div className="form-group">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Commission (%)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={commissionRate}
                    onChange={(e) => setCommissionRate(e.target.value)}
                    placeholder="0.00"
                    className="w-full px-4 py-2.5 bg-[#050505] border border-[#222] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#00e676]/50 text-sm"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#050505] border border-[#222] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#00e676]/50 text-sm"
                >
                  <option value={1}>Active</option>
                  <option value={0}>Inactive</option>
                </select>
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
