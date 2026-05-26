"use client";

import { useState } from "react";

export default function DriversClient({ initialDrivers, error }) {
  const [drivers, setDrivers] = useState(initialDrivers || []);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);

  // Form inputs
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [identityType, setIdentityType] = useState("");
  const [identityNumber, setIdentityNumber] = useState("");
  const [password, setPassword] = useState("");
  const [profileImage, setProfileImage] = useState(""); // text input for demo
  
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");

  const handleOpenAddModal = () => {
    setName("");
    setEmail("");
    setMobile("");
    setIdentityType("");
    setIdentityNumber("");
    setPassword("");
    setProfileImage("default.png");
    setFormError("");
    setShowAddModal(true);
  };

  const handleOpenEditModal = (driver) => {
    setSelectedDriver(driver);
    setName(driver.name || "");
    setEmail(driver.email || "");
    setMobile(driver.mobile || "");
    setIdentityType(driver.identity_type || "");
    setIdentityNumber(driver.identity_number || "");
    setProfileImage(driver.profile_image || "default.png");
    setFormError("");
    setShowEditModal(true);
  };

  // Add Driver
  const handleAddDriver = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !mobile.trim() || !password.trim()) return;
    setLoading(true);
    setFormError("");

    try {
      const res = await fetch("/api/admin/drivers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          mobile,
          identity_type: identityType,
          identity_number: identityNumber,
          password,
          profile_image: profileImage || "default.png",
        }),
      });

      const data = await res.json();
      if (data.status === 1) {
        setDrivers([data.driver, ...drivers]);
        setShowAddModal(false);
      } else {
        setFormError(data.error || "Failed to add driver");
      }
    } catch (err) {
      setFormError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Edit Driver
  const handleEditDriver = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !mobile.trim() || !selectedDriver) return;
    setLoading(true);
    setFormError("");

    try {
      const res = await fetch(`/api/admin/drivers/${selectedDriver.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          mobile,
          identity_type: identityType,
          identity_number: identityNumber,
          profile_image: profileImage,
        }),
      });

      const data = await res.json();
      if (data.status === 1) {
        setDrivers(
          drivers.map((d) => (d.id === selectedDriver.id ? data.driver : d))
        );
        setShowEditModal(false);
      } else {
        setFormError(data.error || "Failed to update driver");
      }
    } catch (err) {
      setFormError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Delete Driver
  const handleDeleteDriver = async (id) => {
    if (!confirm("Are you sure you want to delete this driver?")) return;

    try {
      const res = await fetch(`/api/admin/drivers/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (data.status === 1) {
        setDrivers(drivers.filter((d) => d.id !== id));
      } else {
        alert(data.error || "Failed to delete driver");
      }
    } catch (err) {
      alert("Failed to connect to server");
    }
  };

  // Toggle Driver Status
  const handleToggleStatus = async (id, currentStatus) => {
    const nextStatus = currentStatus === 1 ? 2 : 1;
    try {
      const res = await fetch(`/api/admin/drivers/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_available: nextStatus }),
      });

      const data = await res.json();
      if (data.status === 1) {
        setDrivers(
          drivers.map((d) => (d.id === id ? { ...d, is_available: nextStatus } : d))
        );
      } else {
        alert(data.error || "Failed to update status");
      }
    } catch (err) {
      alert("Failed to connect to server");
    }
  };

  // Filter list
  const filtered = drivers.filter((d) =>
    (d.name && d.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (d.email && d.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (d.mobile && d.mobile.includes(searchQuery))
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
            placeholder="Search drivers by name, email, or mobile..."
            className="w-full pl-11 pr-4 py-2.5 bg-[#080808] border border-[#222222] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#00e676]/50 focus:ring-1 focus:ring-[#00e676]/30 transition-all text-sm"
          />
        </div>
        <button
          onClick={handleOpenAddModal}
          className="bg-[#00e676] text-[#0d0d0d] hover:bg-[#00c853] py-2.5 px-5 rounded-xl font-bold text-sm tracking-wide transition-all shadow-lg shadow-[#00e676]/10 flex items-center justify-center gap-2"
        >
          <i className="fas fa-plus"></i> Add Driver
        </button>
      </div>

      {/* ========== DRIVERS LIST TABLE ========== */}
      <div className="bg-[#111]/80 border border-[#222] rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#222] text-[10px] text-gray-500 uppercase font-bold tracking-wider bg-[#0a0a0a]">
                <th className="py-4 px-6">Image</th>
                <th className="py-4 px-6">Name</th>
                <th className="py-4 px-6">Contact Info</th>
                <th className="py-4 px-6">Identity</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1c1c1c] text-xs">
              {filtered.map((driver) => (
                <tr key={driver.id} className="hover:bg-[#161616]/40 transition-colors group">
                  <td className="py-4 px-6">
                    <div className="w-10 h-10 rounded-lg bg-[#222] overflow-hidden border border-[#333] flex items-center justify-center">
                      {driver.profile_image && driver.profile_image !== "default.png" ? (
                        <img
                          src={`/storage/app/public/admin-assets/images/profile/${driver.profile_image}`}
                          alt={driver.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <i className="fas fa-user text-gray-600 text-lg"></i>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6 font-semibold text-gray-200">
                    {driver.name}
                  </td>
                  <td className="py-4 px-6 text-gray-400 space-y-1">
                    <div><i className="fas fa-envelope text-gray-600 mr-2"></i>{driver.email}</div>
                    <div><i className="fas fa-phone text-gray-600 mr-2"></i>{driver.mobile}</div>
                  </td>
                  <td className="py-4 px-6 text-gray-400">
                    {driver.identity_type ? (
                      <div>
                        <span className="text-gray-500 uppercase text-[10px]">{driver.identity_type}</span>
                        <br />
                        {driver.identity_number}
                      </div>
                    ) : (
                      <span className="text-gray-600 italic">N/A</span>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <button
                      onClick={() => handleToggleStatus(driver.id, driver.is_available)}
                      className={`px-3 py-1 rounded-full border text-[10px] font-bold transition-all ${
                        driver.is_available === 1
                          ? "bg-green-950/20 border-green-500/20 text-[#00e676]"
                          : "bg-red-950/20 border-red-500/20 text-[#ff1744]"
                      }`}
                    >
                      {driver.is_available === 1 ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="py-4 px-6 text-right space-x-2 whitespace-nowrap">
                    <button
                      onClick={() => handleOpenEditModal(driver)}
                      className="px-2.5 py-1.5 bg-[#1c1c1c] border border-[#333] hover:border-gray-500 rounded-lg text-gray-300 hover:text-white transition-all"
                    >
                      <i className="fas fa-edit"></i> Edit
                    </button>
                    <button
                      onClick={() => handleDeleteDriver(driver.id)}
                      className="px-2.5 py-1.5 bg-red-950/10 border border-red-950/30 text-[#ff1744] hover:bg-[#ff1744]/15 rounded-lg transition-all"
                    >
                      <i className="fas fa-trash-alt"></i> Delete
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-gray-500">
                    No drivers found
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
          <div className="relative bg-[#111111] border border-[#222] rounded-2xl w-full max-w-lg overflow-hidden flex flex-col z-10 max-h-[90vh]">
            <div className="p-5 border-b border-[#222] flex items-center justify-between shrink-0">
              <h3 className="text-base font-bold flex items-center gap-2">
                <i className="fas fa-user-plus text-[#00e676]"></i> Add New Driver
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-white">
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-[#333] scrollbar-track-transparent">
              {formError && (
                <div className="mb-4 p-3 rounded-lg bg-red-950/20 border border-red-500/20 text-[#ff1744] text-[11px]">
                  {formError}
                </div>
              )}

              <form id="add-driver-form" onSubmit={handleAddDriver} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full px-4 py-2.5 bg-[#050505] border border-[#222] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#00e676]/50 text-sm"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="driver@example.com"
                      className="w-full px-4 py-2.5 bg-[#050505] border border-[#222] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#00e676]/50 text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                      Mobile Number
                    </label>
                    <input
                      type="text"
                      required
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      placeholder="+1234567890"
                      className="w-full px-4 py-2.5 bg-[#050505] border border-[#222] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#00e676]/50 text-sm"
                    />
                  </div>

                  <div className="form-group">
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                      Password
                    </label>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password"
                      className="w-full px-4 py-2.5 bg-[#050505] border border-[#222] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#00e676]/50 text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                      Identity Type
                    </label>
                    <select
                      value={identityType}
                      onChange={(e) => setIdentityType(e.target.value)}
                      className="w-full px-4 py-2.5 bg-[#050505] border border-[#222] rounded-xl text-white focus:outline-none focus:border-[#00e676]/50 text-sm appearance-none"
                    >
                      <option value="">Select Type</option>
                      <option value="Passport">Passport</option>
                      <option value="Driving License">Driving License</option>
                      <option value="National ID">National ID</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                      Identity Number
                    </label>
                    <input
                      type="text"
                      value={identityNumber}
                      onChange={(e) => setIdentityNumber(e.target.value)}
                      placeholder="ID Number"
                      className="w-full px-4 py-2.5 bg-[#050505] border border-[#222] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#00e676]/50 text-sm"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Profile Image Filename
                  </label>
                  <input
                    type="text"
                    value={profileImage}
                    onChange={(e) => setProfileImage(e.target.value)}
                    placeholder="e.g. driver-avatar.jpg"
                    className="w-full px-4 py-2.5 bg-[#050505] border border-[#222] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#00e676]/50 text-sm"
                  />
                  <span className="text-[10px] text-gray-500 mt-1 block">
                    Leave blank to use a default image.
                  </span>
                </div>
              </form>
            </div>

            <div className="p-5 border-t border-[#222] flex gap-3 shrink-0 bg-[#0a0a0a]">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-2.5 bg-[#1c1c1c] hover:bg-[#222] rounded-xl border border-[#222] text-xs font-bold transition-all text-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="add-driver-form"
                disabled={loading}
                className="flex-1 py-2.5 bg-[#00e676] text-[#0d0d0d] hover:bg-[#00c853] rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
              >
                {loading ? <i className="fas fa-spinner fa-spin"></i> : "Create Driver"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========== EDIT MODAL ========== */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" onClick={() => setShowEditModal(false)}></div>
          <div className="relative bg-[#111111] border border-[#222] rounded-2xl w-full max-w-lg overflow-hidden flex flex-col z-10 max-h-[90vh]">
            <div className="p-5 border-b border-[#222] flex items-center justify-between shrink-0">
              <h3 className="text-base font-bold flex items-center gap-2">
                <i className="fas fa-edit text-[#00e676]"></i> Edit Driver
              </h3>
              <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-white">
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-[#333] scrollbar-track-transparent">
              {formError && (
                <div className="mb-4 p-3 rounded-lg bg-red-950/20 border border-red-500/20 text-[#ff1744] text-[11px]">
                  {formError}
                </div>
              )}

              <form id="edit-driver-form" onSubmit={handleEditDriver} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full px-4 py-2.5 bg-[#050505] border border-[#222] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#00e676]/50 text-sm"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="driver@example.com"
                      className="w-full px-4 py-2.5 bg-[#050505] border border-[#222] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#00e676]/50 text-sm"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Mobile Number
                  </label>
                  <input
                    type="text"
                    required
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="+1234567890"
                    className="w-full px-4 py-2.5 bg-[#050505] border border-[#222] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#00e676]/50 text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                      Identity Type
                    </label>
                    <select
                      value={identityType}
                      onChange={(e) => setIdentityType(e.target.value)}
                      className="w-full px-4 py-2.5 bg-[#050505] border border-[#222] rounded-xl text-white focus:outline-none focus:border-[#00e676]/50 text-sm appearance-none"
                    >
                      <option value="">Select Type</option>
                      <option value="Passport">Passport</option>
                      <option value="Driving License">Driving License</option>
                      <option value="National ID">National ID</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                      Identity Number
                    </label>
                    <input
                      type="text"
                      value={identityNumber}
                      onChange={(e) => setIdentityNumber(e.target.value)}
                      placeholder="ID Number"
                      className="w-full px-4 py-2.5 bg-[#050505] border border-[#222] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#00e676]/50 text-sm"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Profile Image Filename
                  </label>
                  <input
                    type="text"
                    value={profileImage}
                    onChange={(e) => setProfileImage(e.target.value)}
                    placeholder="e.g. driver-avatar.jpg"
                    className="w-full px-4 py-2.5 bg-[#050505] border border-[#222] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#00e676]/50 text-sm"
                  />
                </div>
              </form>
            </div>

            <div className="p-5 border-t border-[#222] flex gap-3 shrink-0 bg-[#0a0a0a]">
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="flex-1 py-2.5 bg-[#1c1c1c] hover:bg-[#222] rounded-xl border border-[#222] text-xs font-bold transition-all text-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="edit-driver-form"
                disabled={loading}
                className="flex-1 py-2.5 bg-[#00e676] text-[#0d0d0d] hover:bg-[#00c853] rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
              >
                {loading ? <i className="fas fa-spinner fa-spin"></i> : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
