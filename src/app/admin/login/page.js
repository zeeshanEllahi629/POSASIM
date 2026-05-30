"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong. Please check your credentials.");
      }

      // Successful login
      window.location.href = callbackUrl;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Decorative Neon Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-[#00e676]/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-[#ff1744]/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo/App Info */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-[#00e676] flex items-center justify-center text-[#0d0d0d] mb-4 shadow-lg shadow-[#00e676]/20">
            <i className="fas fa-cash-register text-3xl"></i>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight font-display text-white">
            Foodefy <span className="text-[#00e676]">POS</span>
          </h1>
          <p className="text-gray-400 text-sm mt-1">Enterprise Restaurant Delivery & POS System</p>
        </div>

        {/* Login Box */}
        <div className="bg-[#111111]/80 border border-[#222222] backdrop-blur-md rounded-2xl p-8 shadow-2xl">
          <h2 className="text-xl font-bold font-display mb-6">Sign In</h2>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-950/20 border border-red-500/30 text-[#ff1744] text-xs flex items-center gap-3 animate-pulse">
              <i className="fas fa-exclamation-triangle text-sm"></i>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                  <i className="fas fa-envelope"></i>
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@gmail.com"
                  className="w-full pl-10 pr-4 py-3 bg-[#080808] border border-[#222222] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#00e676]/50 focus:ring-1 focus:ring-[#00e676]/30 transition-all text-sm"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Password
                </label>
                <a href="#" className="text-xs text-[#00e676] hover:underline">
                  Forgot Password?
                </a>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                  <i className="fas fa-lock"></i>
                </span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-[#080808] border border-[#222222] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#00e676]/50 focus:ring-1 focus:ring-[#00e676]/30 transition-all text-sm"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#00e676] text-[#0d0d0d] hover:bg-[#00c853] disabled:opacity-50 disabled:cursor-not-allowed py-3.5 rounded-xl font-bold text-sm tracking-wider uppercase transition-all shadow-lg shadow-[#00e676]/10 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i> Signing in...
                  </>
                ) : (
                  <>
                    <i className="fas fa-sign-in-alt"></i> Sign In
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Test Account Helper */}
          <div className="mt-8 pt-6 border-t border-[#1c1c1c] text-center">
            <span className="text-xs text-gray-500">
              For testing, use <code className="text-[#00e676] bg-[#1a1a1a] px-1.5 py-0.5 rounded border border-[#333]">admin@gmail.com</code> / <code className="text-[#00e676] bg-[#1a1a1a] px-1.5 py-0.5 rounded border border-[#333]">123456</code>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0d0d0d] text-white flex flex-col items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-3">
          <i className="fas fa-spinner fa-spin text-3xl text-[#00e676]"></i>
          <span className="text-xs text-gray-400">Loading POS Terminal...</span>
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
