"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useCartStore } from "@/store/cartStore";

export default function Navbar({ cartStyle = "sidebar", logo }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState(null);
  
  const cartCount = useCartStore((state) => state.getCartCount());
  const setSidebarOpen = useCartStore((state) => state.setSidebarOpen);

  useEffect(() => {
    setMounted(true);
    // Check if user is logged in
    try {
      const token = document.cookie.split("; ").find(row => row.startsWith("token="));
      if (token) {
        const payloadBase64 = token.split("=")[1].split(".")[1];
        const payload = JSON.parse(atob(payloadBase64.replace(/-/g, "+").replace(/_/g, "/")));
        setUser({
          name: payload.name,
          type: payload.type
        });
      }
    } catch (e) {
      // Ignore
    }
  }, []);

  // Helper to check active links
  const isActive = (path) => pathname === path;

  return (
    <>
      <header className="bg-[#111] shadow-md border-b border-[#222] sticky top-0 z-50">
        <nav className="container mx-auto px-4 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden text-zinc-300 hover:text-white focus:outline-none"
            >
              <i className="fa-solid fa-bars text-2xl"></i>
            </button>
            {/* Logo */}
            <Link href="/">
              {logo ? (
                <img src={logo} alt="Logo" className="h-10 object-contain" />
              ) : (
                <span className="text-2xl font-extrabold tracking-tight" style={{ color: "var(--primary-color)" }}>
                  foodefy
                </span>
              )}
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-6">
            <Link
              href="/"
              className={`font-semibold transition-colors ${
                isActive("/") ? "text-red-600" : "text-zinc-300 hover:text-red-500"
              }`}
            >
              Home
            </Link>
            <Link
              href="/menu"
              className={`font-semibold transition-colors ${
                isActive("/menu") ? "text-red-600" : "text-zinc-300 hover:text-red-500"
              }`}
            >
              Menu
            </Link>
            <Link
              href="/faq"
              className={`font-semibold transition-colors ${
                isActive("/faq") ? "text-red-600" : "text-zinc-300 hover:text-red-500"
              }`}
            >
              FAQ
            </Link>
            <Link
              href="/contact-us"
              className={`font-semibold transition-colors ${
                isActive("/contact-us") ? "text-red-600" : "text-zinc-300 hover:text-red-500"
              }`}
            >
              Contact Us
            </Link>
          </div>

          {/* Right side Icons */}
          <div className="flex items-center gap-4">
            {/* Cart Button */}
            {cartStyle === "sidebar" ? (
              <button onClick={() => setSidebarOpen(true)} className="relative text-zinc-300 hover:text-red-500 transition">
                <i className="fa-solid fa-cart-shopping text-xl"></i>
                {mounted && cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {cartCount}
                  </span>
                )}
              </button>
            ) : (
              <Link href="/cart" className="relative text-zinc-300 hover:text-red-500 transition">
                <i className="fa-solid fa-cart-shopping text-xl"></i>
                {mounted && cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}
            {/* User Login/Profile */}
            {mounted && user ? (
              <Link href={user.type === 1 ? "/admin" : "/profile"} className="w-8 h-8 rounded-full bg-red-600/20 border border-red-500/50 flex items-center justify-center text-red-500 font-bold transition-all hover:bg-red-600 hover:text-white" title={user.name}>
                {user.name.charAt(0).toUpperCase()}
              </Link>
            ) : (
              <Link href="/login" className="text-zinc-300 hover:text-red-500 transition" title="Login">
                <i className="fa-solid fa-user text-xl"></i>
              </Link>
            )}
          </div>
        </nav>
      </header>

      {/* Mobile Offcanvas Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] flex">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50" 
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
          
          {/* Sidebar */}
          <div className="relative w-72 max-w-sm bg-[#1a1a1a] h-full shadow-xl flex flex-col animate-slide-in-left border-r border-[#222]">
            <div className="p-4 border-b border-[#333] flex items-center justify-between">
              <span className="text-2xl font-extrabold tracking-tight text-red-600">
                foodefy
              </span>
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-zinc-400 hover:text-white">
                <i className="fa-solid fa-xmark text-xl"></i>
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto py-4">
              <div className="px-4 pb-2">
                <h5 className="text-zinc-400 font-bold border-b border-[#333] pb-2 mb-2 uppercase text-sm tracking-wider">Pages</h5>
                <ul className="space-y-1">
                  <li>
                    <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-2 py-3 text-zinc-300 hover:text-red-500 hover:bg-[#2a2a2a] rounded-lg font-medium">
                      <i className="fa-solid fa-circle-dot text-[10px]"></i> Home
                    </Link>
                  </li>
                  <li>
                    <Link href="/menu" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-2 py-3 text-zinc-300 hover:text-red-500 hover:bg-[#2a2a2a] rounded-lg font-medium">
                      <i className="fa-solid fa-circle-dot text-[10px]"></i> Menu
                    </Link>
                  </li>
                  <li>
                    <Link href="/faq" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-2 py-3 text-zinc-300 hover:text-red-500 hover:bg-[#2a2a2a] rounded-lg font-medium">
                      <i className="fa-solid fa-circle-dot text-[10px]"></i> FAQ
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact-us" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-2 py-3 text-zinc-300 hover:text-red-500 hover:bg-[#2a2a2a] rounded-lg font-medium">
                      <i className="fa-solid fa-circle-dot text-[10px]"></i> Contact Us
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
