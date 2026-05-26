"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function AddRolePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const [roleName, setRoleName] = useState("");
  const [permissionsGrouped, setPermissionsGrouped] = useState({});
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  useEffect(() => {
    fetch("/api/admin/permissions")
      .then(res => res.json())
      .then(data => {
        if (data.permissions) {
          setPermissionsGrouped(data.permissions);
        }
      })
      .catch(err => console.error("Failed to load permissions", err));
  }, []);

  const handleSelectAllGroup = (groupName, checked) => {
    const groupPerms = permissionsGrouped[groupName];
    if (checked) {
      const newPerms = new Set([...selectedPermissions, ...groupPerms]);
      setSelectedPermissions(Array.from(newPerms));
    } else {
      const newPerms = selectedPermissions.filter(p => !groupPerms.includes(p));
      setSelectedPermissions(newPerms);
    }
  };

  const handleSelectPermission = (perm, checked) => {
    if (checked) {
      setSelectedPermissions([...selectedPermissions, perm]);
    } else {
      setSelectedPermissions(selectedPermissions.filter(p => p !== perm));
    }
  };

  const isGroupFullySelected = (groupName) => {
    const groupPerms = permissionsGrouped[groupName];
    if (!groupPerms || groupPerms.length === 0) return false;
    return groupPerms.every(p => selectedPermissions.includes(p));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedPermissions.length === 0) {
      toast.error("Please select at least one permission.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/admin/roles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: roleName,
          permissions: selectedPermissions
        }),
      });

      const result = await res.json();
      if (res.ok && result.status === 1) {
        toast.success("Role created successfully!");
        router.push("/admin/settings"); // Or wherever the roles list is
      } else {
        toast.error(result.error || "Failed to save role");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto pb-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Add Role</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-[#111] border border-[#222] rounded-xl p-6">
          <label className="block text-sm font-semibold text-[#00e676] mb-2">Role Name *</label>
          <input 
            type="text" 
            required 
            value={roleName} 
            onChange={(e) => setRoleName(e.target.value)} 
            className="w-full max-w-md bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-3 text-white focus:border-[#00e676] transition-colors" 
            placeholder="e.g. Cashier, Manager, Admin" 
          />
        </div>

        <div className="bg-[#111] border border-[#222] rounded-xl p-6">
          <h2 className="text-lg font-semibold text-[#00e676] mb-6 border-b border-[#222] pb-4">Assign Permissions</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {Object.keys(permissionsGrouped).map((groupName) => (
              <div key={groupName} className="bg-[#1a1a1a] border border-[#333] rounded-xl overflow-hidden shadow-lg">
                <div className="bg-[#222] px-4 py-3 flex items-center gap-3 border-b border-[#333]">
                  <input 
                    type="checkbox" 
                    id={`group-${groupName}`}
                    checked={isGroupFullySelected(groupName)}
                    onChange={(e) => handleSelectAllGroup(groupName, e.target.checked)}
                    className="w-4 h-4 rounded bg-[#111] text-[#00e676] focus:ring-0 cursor-pointer"
                  />
                  <label htmlFor={`group-${groupName}`} className="font-bold text-white cursor-pointer select-none text-sm">
                    {groupName}
                  </label>
                </div>
                <div className="p-4 space-y-3">
                  {permissionsGrouped[groupName].map(perm => (
                    <div key={perm} className="flex items-start gap-3">
                      <input 
                        type="checkbox" 
                        id={`perm-${perm}`}
                        checked={selectedPermissions.includes(perm)}
                        onChange={(e) => handleSelectPermission(perm, e.target.checked)}
                        className="w-4 h-4 mt-0.5 rounded bg-[#111] text-[#00e676] focus:ring-0 cursor-pointer"
                      />
                      <label htmlFor={`perm-${perm}`} className="text-sm text-gray-300 cursor-pointer select-none leading-tight">
                        {perm}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button type="button" onClick={() => router.back()} className="px-6 py-2 rounded-lg font-semibold text-gray-300 bg-[#222] hover:bg-[#333] transition-colors">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="px-8 py-3 rounded-lg font-bold text-[#0d0d0d] bg-[#00e676] hover:bg-[#00c853] transition-colors shadow-lg shadow-[#00e676]/20">
            {loading ? "Saving Role..." : "Save Role"}
          </button>
        </div>
      </form>
    </div>
  );
}
