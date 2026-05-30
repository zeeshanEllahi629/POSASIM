"use client";
import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";

export default function ApprovalsPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/approvals");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAction = async (userId, action) => {
    try {
      const res = await fetch("/api/admin/approvals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, action }),
      });
      if (res.ok) {
        setUsers(users.filter(u => u.id !== userId));
      } else {
        alert("Action failed.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6 text-white">Pending Approvals</h1>
        
        {loading ? (
          <p className="text-zinc-400">Loading...</p>
        ) : users.length === 0 ? (
          <div className="bg-[#1a1a1a] p-8 text-center rounded-xl border border-[#333]">
            <p className="text-zinc-400">No pending staff registrations.</p>
          </div>
        ) : (
          <div className="overflow-x-auto bg-[#1a1a1a] rounded-xl border border-[#333]">
            <table className="min-w-full divide-y divide-[#333]">
              <thead className="bg-[#111]">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Registered At</th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-zinc-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#333]">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-[#222] transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-medium">{user.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-300">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-400">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleAction(user.id, "approve")}
                        className="text-green-500 hover:text-green-400 bg-green-500/10 px-3 py-1.5 rounded-lg mr-3 transition-colors"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleAction(user.id, "reject")}
                        className="text-red-500 hover:text-red-400 bg-red-500/10 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
