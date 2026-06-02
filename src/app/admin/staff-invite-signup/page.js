"use client";
import { useState } from "react";

export default function StaffSignup() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true });

    try {
      const res = await fetch("/api/auth/staff-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Registration failed");

      setStatus({ success: true, message: data.message });
      setFormData({ name: "", email: "", password: "" });
    } catch (err) {
      setStatus({ error: true, message: err.message });
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 text-white">
      <div className="max-w-md w-full space-y-8 bg-[#111] p-10 rounded-2xl border border-[#222]">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-white">
            Staff / Admin Invite
          </h2>
          <p className="mt-2 text-center text-sm text-zinc-400">
            Sign up below. A Super User must approve your account before you can log in.
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {status?.error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 rounded-lg p-4 text-sm text-center">
              {status.message}
            </div>
          )}
          {status?.success && (
            <div className="bg-green-500/10 border border-green-500 text-green-500 rounded-lg p-4 text-sm text-center">
              {status.message}
            </div>
          )}

          <div className="rounded-md shadow-sm -space-y-px flex flex-col gap-4">
            <div>
              <label className="sr-only">Full Name</label>
              <input
                type="text"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-[#333] bg-[#1a1a1a] placeholder-zinc-500 text-white focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <label className="sr-only">Email address</label>
              <input
                type="email"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-[#333] bg-[#1a1a1a] placeholder-zinc-500 text-white focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div>
              <label className="sr-only">Password</label>
              <input
                type="password"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-[#333] bg-[#1a1a1a] placeholder-zinc-500 text-white focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={status?.loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
            >
              {status?.loading ? "Registering..." : "Sign Up"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
