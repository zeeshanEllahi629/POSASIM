"use client";

import { useState } from "react";

export default function UsersClient({ initialUsers, roles = [], error }) {
  const [users, setUsers] = useState(initialUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("customers");
  
  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Form inputs
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [roleId, setRoleId] = useState("");
  const [userType, setUserType] = useState(2); // 2 = customer, 1 = staff
  
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");

  const handleOpenAddModal = () => {
    setName("");
    setEmail("");
    setMobile("");
    setPassword("");
    setRoleId("");
    setUserType(activeTab === "staff" ? 1 : 2);
    setFormError("");
    setShowAddModal(true);
  };

  const handleOpenEditModal = (user) => {
    setSelectedUser(user);
    setName(user.name);
    setEmail(user.email);
    setMobile(user.mobile || "");
    setRoleId(user.role_id || "");
    setFormError("");
    setShowEditModal(true);
  };

  // Add User Handler
  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !mobile.trim() || !password.trim()) return;
    setLoading(true);
    setFormError("");

    try {
      const res = await fetch("/api/admin2/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name, 
          email, 
          mobile, 
          password, 
          type: userType, 
          role_id: userType === 1 ? roleId : null 
        }),
      });

      const data = await res.json();
      if (data.status === 1) {
        setUsers([data.user, ...users]);
        setShowAddModal(false);
      } else {
        setFormError(data.error || "Failed to add user");
      }
    } catch (err) {
      setFormError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Edit User Handler
  const handleEditUser = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !mobile.trim() || !selectedUser) return;
    setLoading(true);
    setFormError("");

    try {
      const payload = { name, email, mobile };
      if (selectedUser.type === 1) payload.role_id = roleId;

      const res = await fetch(`/api/admin2/users/${selectedUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.status === 1) {
        setUsers(
          users.map((u) => (u.id === selectedUser.id ? data.user : u))
        );
        setShowEditModal(false);
      } else {
        setFormError(data.error || "Failed to update user");
      }
    } catch (err) {
      setFormError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Delete User Handler
  const handleDeleteUser = async (id) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      const res = await fetch(`/api/admin2/users/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (data.status === 1) {
        setUsers(users.filter((u) => u.id !== id));
      } else {
        alert(data.error || "Failed to delete user");
      }
    } catch (err) {
      alert("Failed to connect to server");
    }
  };

  // Toggle User Availability Status
  const handleToggleStatus = async (id, currentStatus) => {
    const nextStatus = currentStatus === 1 ? 2 : 1;
    try {
      const res = await fetch(`/api/admin2/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_available: nextStatus }),
      });

      const data = await res.json();
      if (data.status === 1) {
        setUsers(
          users.map((u) => (u.id === id ? { ...u, is_available: nextStatus } : u))
        );
      } else {
        alert(data.error || "Failed to update status");
      }
    } catch (err) {
      alert("Failed to connect to server");
    }
  };

  // Approve Staff User
  const handleApproveStaff = async (id) => {
    if (!confirm("Approve this staff account?")) return;
    try {
      // Typically verified is 1, unverified is 0/2 depending on DB schema
      const res = await fetch(`/api/admin2/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_verified: 1 }), // Or whatever indicates approved
      });
      const data = await res.json();
      if (data.status === 1) {
        setUsers(users.map(u => u.id === id ? { ...u, is_verified: 1 } : u));
      } else {
        alert("Failed to approve");
      }
    } catch (err) {
      alert("Connection error");
    }
  };

  // Filter lists
  const filtered = users.filter((u) => {
    const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (u.mobile && u.mobile.includes(searchQuery));
    
    // type: 2 = customer, 1 = staff
    // is_verified is commonly used for approval
    const isApproved = u.is_verified === 1 || u.is_verified === true;
    
    if (activeTab === "customers") return matchesSearch && u.type === 2;
    if (activeTab === "staff") return matchesSearch && u.type === 1 && isApproved;
    if (activeTab === "pending") return matchesSearch && u.type === 1 && !isApproved;
    
    return matchesSearch;
  });

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
          className={`px-6 py-4 font-semibold text-sm transition-colors ${activeTab === 'customers' ? 'text-[#00e676] border-b-2 border-[#00e676]' : 'text-gray-400 hover:text-white'}`}
          onClick={() => setActiveTab('customers')}
        >
          Customers
        </button>
        <button 
          className={`px-6 py-4 font-semibold text-sm transition-colors ${activeTab === 'staff' ? 'text-[#00e676] border-b-2 border-[#00e676]' : 'text-gray-400 hover:text-white'}`}
          onClick={() => setActiveTab('staff')}
        >
          Active Staff
        </button>
        <button 
          className={`px-6 py-4 font-semibold text-sm transition-colors ${activeTab === 'pending' ? 'text-[#00e676] border-b-2 border-[#00e676]' : 'text-gray-400 hover:text-white'}`}
          onClick={() => setActiveTab('pending')}
        >
          Pending Approvals
        </button>
      </div>

      {/* ========== HEADER CONTROL BAR ========== */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-[#111111]/60 border border-[#222222] p-4 rounded-2xl">
        <div className="relative flex-1 max-w-md">
          <i className="fas fa-search absolute left-4.5 top-1/2 -translate-y-1/2 text-gray-500"></i>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search users..."
            className="w-full pl-11 pr-4 py-2.5 bg-[#080808] border border-[#222222] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#00e676]/50 focus:ring-1 focus:ring-[#00e676]/30 transition-all text-sm"
          />
        </div>
        {activeTab !== "pending" && (
          <button
            onClick={handleOpenAddModal}
            className="bg-[#00e676] text-[#0d0d0d] hover:bg-[#00c853] py-2.5 px-5 rounded-xl font-bold text-sm tracking-wide transition-all shadow-lg shadow-[#00e676]/10 flex items-center justify-center gap-2"
          >
            <i className="fas fa-plus"></i> Add {activeTab === "staff" ? "Staff" : "User"}
          </button>
        )}
      </div>

      {/* ========== USERS LIST TABLE ========== */}
      <div className="bg-[#111]/80 border border-[#222] rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#222] text-[10px] text-gray-500 uppercase font-bold tracking-wider bg-[#0a0a0a]">
                <th className="py-4 px-6">Name</th>
                <th className="py-4 px-6">Email</th>
                <th className="py-4 px-6">Mobile</th>
                {activeTab === "staff" && <th className="py-4 px-6">Role</th>}
                {activeTab !== "pending" && <th className="py-4 px-6">Status</th>}
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1c1c1c] text-xs">
              {filtered.map((user) => (
                <tr key={user.id} className="hover:bg-[#161616]/40 transition-colors group">
                  <td className="py-4 px-6 font-semibold text-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#222] overflow-hidden border border-[#333] flex items-center justify-center">
                        {user.profile_image && user.profile_image !== "unknown.png" ? (
                          <img
                            src={`/storage/app/public/admin-assets/images/profile/${user.profile_image}`}
                            alt={user.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <i className="fas fa-user text-gray-600 text-xs"></i>
                        )}
                      </div>
                      {user.name}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-gray-400">
                    {user.email}
                  </td>
                  <td className="py-4 px-6 font-mono text-gray-500">
                    {user.mobile || "-"}
                  </td>
                  
                  {activeTab === "staff" && (
                    <td className="py-4 px-6 text-blue-400 font-semibold">
                      {roles.find(r => r.id === user.role_id)?.name || "No Role"}
                    </td>
                  )}

                  {activeTab !== "pending" && (
                    <td className="py-4 px-6">
                      <button
                        onClick={() => handleToggleStatus(user.id, user.is_available)}
                        className={`px-3 py-1 rounded-full border text-[10px] font-bold transition-all ${
                          user.is_available === 1
                            ? "bg-green-950/20 border-green-500/20 text-[#00e676]"
                            : "bg-red-950/20 border-red-500/20 text-[#ff1744]"
                        }`}
                      >
                        {user.is_available === 1 ? "Active" : "Inactive"}
                      </button>
                    </td>
                  )}

                  <td className="py-4 px-6 text-right space-x-2">
                    {activeTab === "pending" ? (
                      <>
                        <button
                          onClick={() => handleApproveStaff(user.id)}
                          className="px-2.5 py-1.5 bg-[#00e676]/10 border border-[#00e676]/30 text-[#00e676] hover:bg-[#00e676]/20 rounded-lg transition-all"
                        >
                          <i className="fas fa-check"></i> Approve
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="px-2.5 py-1.5 bg-red-950/10 border border-red-950/30 text-[#ff1744] hover:bg-[#ff1744]/15 rounded-lg transition-all"
                        >
                          <i className="fas fa-times"></i> Reject
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleOpenEditModal(user)}
                          className="px-2.5 py-1.5 bg-[#1c1c1c] border border-[#333] hover:border-gray-500 rounded-lg text-gray-300 hover:text-white transition-all"
                        >
                          <i className="fas fa-edit"></i> Edit
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="px-2.5 py-1.5 bg-red-950/10 border border-red-950/30 text-[#ff1744] hover:bg-[#ff1744]/15 rounded-lg transition-all"
                        >
                          <i className="fas fa-trash-alt"></i> Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-gray-500">
                    No users found
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
                <i className="fas fa-user-plus text-[#00e676]"></i> Add New {activeTab === "staff" ? "Staff" : "User"}
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

            <form onSubmit={handleAddUser} className="p-6 space-y-4">
              <div className="form-group">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full px-4 py-2.5 bg-[#050505] border border-[#222] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#00e676]/50 text-sm"
                />
              </div>

              <div className="form-group">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. user@example.com"
                  className="w-full px-4 py-2.5 bg-[#050505] border border-[#222] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#00e676]/50 text-sm"
                />
              </div>

              <div className="form-group">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Mobile Number</label>
                <input
                  type="text"
                  required
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="e.g. +1234567890"
                  className="w-full px-4 py-2.5 bg-[#050505] border border-[#222] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#00e676]/50 text-sm"
                />
              </div>

              {activeTab === "staff" && (
                <div className="form-group">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Assign Role</label>
                  <select
                    value={roleId}
                    onChange={(e) => setRoleId(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 bg-[#050505] border border-[#222] rounded-xl text-white focus:outline-none focus:border-[#00e676]/50 text-sm"
                  >
                    <option value="">Select a Role</option>
                    {roles.map(r => (
                      <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="form-group">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 bg-[#050505] border border-[#222] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#00e676]/50 text-sm"
                />
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
                  {loading ? <i className="fas fa-spinner fa-spin"></i> : "Create User"}
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
                <i className="fas fa-edit text-[#00e676]"></i> Edit User
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

            <form onSubmit={handleEditUser} className="p-6 space-y-4">
              <div className="form-group">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#050505] border border-[#222] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#00e676]/50 text-sm"
                />
              </div>

              <div className="form-group">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#050505] border border-[#222] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#00e676]/50 text-sm"
                />
              </div>

              <div className="form-group">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Mobile Number</label>
                <input
                  type="text"
                  required
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#050505] border border-[#222] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#00e676]/50 text-sm"
                />
              </div>

              {selectedUser?.type === 1 && (
                <div className="form-group">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Assign Role</label>
                  <select
                    value={roleId}
                    onChange={(e) => setRoleId(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 bg-[#050505] border border-[#222] rounded-xl text-white focus:outline-none focus:border-[#00e676]/50 text-sm"
                  >
                    <option value="">Select a Role</option>
                    {roles.map(r => (
                      <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                  </select>
                </div>
              )}

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
