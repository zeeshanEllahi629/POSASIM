"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [user, setUser] = useState({ name: "Admin", email: "admin@gmail.com" });
  const [permissions, setPermissions] = useState([]);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [loadingPerms, setLoadingPerms] = useState(true);
  const [themeMode, setThemeMode] = useState("dark");

  // Load user data from token if stored in cookie/localStorage or just decode it
  useEffect(() => {
    // Attempt to read user info from cookie or fallback
    try {
      const token = document.cookie.split("; ").find(row => row.startsWith("token="));
      if (token) {
        const payloadBase64 = token.split("=")[1].split(".")[1];
        const payload = JSON.parse(atob(payloadBase64.replace(/-/g, "+").replace(/_/g, "/")));
        setUser({
          name: payload.name || "Admin User",
          email: payload.email || "admin@gmail.com",
          profile_image: payload.profile_image,
          type: payload.type
        });
      }
    } catch (e) {
      // ignore
    }

    // Fetch Permissions
    fetch(`/api/auth/my-permissions?t=${Date.now()}`, { cache: "no-store" })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setIsSuperAdmin(data.isSuperAdmin);
          setPermissions(data.permissions);
        }
        setLoadingPerms(false);
      })
      .catch(err => {
        console.error(err);
        setLoadingPerms(false);
      });

    // Load Theme Preference
    const savedTheme = localStorage.getItem("adminTheme") || "dark";
    setThemeMode(savedTheme);
    if (savedTheme === "light") {
      document.body.classList.add("light-theme");
    } else {
      document.body.classList.remove("light-theme");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = themeMode === "dark" ? "light" : "dark";
    setThemeMode(newTheme);
    localStorage.setItem("adminTheme", newTheme);
    if (newTheme === "light") {
      document.body.classList.add("light-theme");
    } else {
      document.body.classList.remove("light-theme");
    }
  };

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (res.ok) {
        router.push("/login");
      }
    } catch (e) {
      console.error("Logout failed", e);
    }
  };

  // If the path starts with /admin/pos, render children directly without the layout shell
  const isFullScreen = pathname.startsWith("/admin/pos");

  if (isFullScreen) {
    return <>{children}</>;
  }

  const allMenuItems = [
    { name: "Dashboard", path: "/admin", icon: "fa-chart-pie", reqPerm: "ALL" },
    { name: "POS Terminal", path: "/admin/pos", icon: "fa-cash-register", reqPerm: "View cash register" },
    { name: "Categories", path: "/admin/categories", icon: "fa-tags", reqPerm: "Add/Edit/View/Delete category" },
    { name: "Brands", path: "/admin/brands", icon: "fa-copyright", reqPerm: "View brand" },
    { name: "Units", path: "/admin/units", icon: "fa-balance-scale", reqPerm: "Add/Edit/View/Delete unit" },
    { name: "Warranties", path: "/admin/warranties", icon: "fa-shield-alt", reqPerm: "View product" },
    { name: "Products", path: "/admin/products", icon: "fa-utensils", reqPerm: "View product" },
    { name: "Add Product", path: "/admin/products/add", icon: "fa-plus-circle", reqPerm: "Add product" },
    { name: "Purchases", path: "/admin/purchases", icon: "fa-shopping-cart", reqPerm: "View all purchase" },
    { name: "Add Purchase", path: "/admin/purchases/add", icon: "fa-cart-plus", reqPerm: "Add purchase" },
    { name: "Orders", path: "/admin/orders", icon: "fa-receipt", reqPerm: "View all sell" },
    { name: "Add Sale", path: "/admin/sales/add", icon: "fa-file-invoice-dollar", reqPerm: "Add Sell" },
    { name: "Expenses", path: "/admin/expenses/add", icon: "fa-money-bill-wave", reqPerm: "Add expense" },
    { name: "Roles", path: "/admin/roles/add", icon: "fa-user-shield", reqPerm: "View Role" },
    { name: "Reports", path: "/admin/reports", icon: "fa-chart-bar", reqPerm: "ALL" },
    { name: "Theme Settings", path: "/admin/theme-settings", icon: "fa-paint-roller", reqPerm: "ALL" },
    { name: "Payment Gateways", path: "/admin/payment-gateways", icon: "fa-credit-card", reqPerm: "ALL" },
    { name: "AI Workflow", path: "/admin/workflow", icon: "fa-project-diagram", reqPerm: "ALL" },
    { name: "AI Agents", path: "/admin/ai-agents", icon: "fa-robot", reqPerm: "ALL" },
    { name: "Suppliers", path: "/admin/suppliers", icon: "fa-truck", reqPerm: "View all supplier" },
    { name: "Branches", path: "/admin/branches", icon: "fa-store", reqPerm: "ALL" },
    { name: "SaaS Omnichannel Sync", path: "/admin/sync-settings", icon: "fa-cloud-upload-alt", reqPerm: "ALL" },
    { name: "Print Labels", path: "/admin/print-labels", icon: "fa-barcode", reqPerm: "View product" },
    { name: "Settings", path: "/admin/settings", icon: "fa-sliders", reqPerm: "ALL" },
  ];

  // Filter items based on permissions
  const menuItems = loadingPerms ? [] : allMenuItems.filter(item => {
    if (isSuperAdmin) return true;
    if (item.reqPerm === "ALL") return true; // Some items everyone can see, or you can restrict
    return permissions.includes(item.reqPerm);
  });

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white flex font-sans">
      {/* ========== SIDEBAR ========== */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } transition-all duration-300 ease-in-out border-r border-[#222222] bg-[#050505] flex flex-col z-20 sticky top-0 h-screen`}
      >
        {/* Sidebar Header */}
        <div className="h-16 border-b border-[#222222] flex items-center justify-between px-4">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="w-9 h-9 rounded-lg bg-[#00e676] flex items-center justify-center text-[#0d0d0d] shrink-0 shadow-lg shadow-[#00e676]/20">
              <i className="fas fa-cash-register text-lg"></i>
            </div>
            {sidebarOpen && (
              <span className="font-extrabold tracking-tight font-display text-white text-lg whitespace-nowrap">
                Foodefy <span className="text-[#00e676]">POS</span>
              </span>
            )}
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-400 hover:text-white p-1.5 hover:bg-[#111] rounded-lg transition-all"
          >
            <i className={`fas ${sidebarOpen ? "fa-angle-double-left" : "fa-angle-double-right"}`}></i>
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 py-6 px-3 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.name}
                href={item.path}
                title={item.name}
                className={`flex items-center gap-3.5 px-3 py-3 rounded-xl text-sm font-semibold transition-all group relative ${
                  isActive
                    ? "bg-[#00e676]/10 text-[#00e676] border border-[#00e676]/20"
                    : "text-gray-400 hover:text-white hover:bg-[#111111] border border-transparent"
                }`}
              >
                <i
                  className={`fas ${item.icon} text-lg ${
                    isActive ? "text-[#00e676]" : "text-gray-400 group-hover:text-white"
                  } shrink-0 w-5 text-center transition-colors`}
                ></i>
                {sidebarOpen && <span>{item.name}</span>}
                {/* Active Indicator Line */}
                {isActive && (
                  <span className="absolute left-0 top-1/3 bottom-1/3 w-1 bg-[#00e676] rounded-r-md"></span>
                )}
                {/* Tooltip for collapsed sidebar */}
                {!sidebarOpen && (
                  <span className="absolute left-20 scale-0 group-hover:scale-100 bg-[#111] border border-[#333] text-white text-xs px-2 py-1.5 rounded-lg whitespace-nowrap shadow-xl transition-all z-30">
                    {item.name}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer / User Profile info */}
        <div className="p-3 border-t border-[#222222] bg-[#050505]">
          <div className="flex items-center gap-3 p-1 rounded-xl">
            {user.profile_image ? (
              <img
                src={`/storage/app/public/admin-assets/images/user/${user.profile_image}`}
                alt={user.name}
                className="w-9 h-9 rounded-lg object-cover border border-[#333]"
              />
            ) : (
              <div className="w-9 h-9 rounded-lg bg-[#222] flex items-center justify-center text-gray-400 font-bold shrink-0 border border-[#333]">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
            {sidebarOpen && (
              <div className="overflow-hidden flex-1">
                <div className="text-xs font-bold text-gray-200 truncate">{user.name}</div>
                <div className="text-[10px] text-gray-500 truncate">{user.email}</div>
              </div>
            )}
            {sidebarOpen && (
              <button
                onClick={handleLogout}
                className="text-gray-500 hover:text-[#ff1744] p-1.5 hover:bg-[#ff1744]/10 rounded-lg transition-all"
                title="Logout"
              >
                <i className="fas fa-sign-out-alt"></i>
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* ========== MAIN CONTENT CONTAINER ========== */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 border-b border-[#222222] bg-[#050505]/80 backdrop-blur-md sticky top-0 flex items-center justify-between px-6 z-10">
          <div>
            <h2 className="text-lg font-bold font-display text-white">
              {menuItems.find((item) => pathname === item.path)?.name || "Admin Panel"}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            {/* Quick Link to POS */}
            <Link
              href="/admin/pos"
              className="bg-[#00e676] text-[#0d0d0d] hover:bg-[#00c853] px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-[#00e676]/10"
            >
              <i className="fas fa-cash-register"></i> POS Terminal
            </Link>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              title={`Switch to ${themeMode === "dark" ? "Light" : "Dark"} Mode`}
              className="w-10 h-10 rounded-lg border border-[#222] hover:bg-[#111] hover:text-white flex items-center justify-center text-gray-400 relative transition-all"
            >
              <i className={`fas ${themeMode === "dark" ? "fa-sun" : "fa-moon"}`}></i>
            </button>

            {/* Notifications Dropdown (Decorative/Static for UI wow factor) */}
            <div className="relative">
              <button className="w-10 h-10 rounded-lg border border-[#222] hover:bg-[#111] hover:text-white flex items-center justify-center text-gray-400 relative transition-all">
                <i className="fas fa-bell"></i>
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#ff1744]"></span>
              </button>
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 hover:bg-[#111] p-1.5 rounded-lg border border-transparent hover:border-[#222] transition-all"
              >
                <div className="w-7 h-7 rounded bg-[#00e676]/20 border border-[#00e676]/40 flex items-center justify-center text-[#00e676] text-xs font-bold font-display">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <i className="fas fa-chevron-down text-[10px] text-gray-500"></i>
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-[#111] border border-[#222] rounded-xl shadow-2xl z-30 py-1 overflow-hidden">
                  <div className="px-4 py-2 border-b border-[#222]">
                    <div className="text-xs font-bold text-white">{user.name}</div>
                    <div className="text-[10px] text-gray-500 truncate">{user.email}</div>
                  </div>
                  <Link
                    href="/admin/settings"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-xs text-gray-300 hover:bg-[#00e676]/10 hover:text-[#00e676] transition-all"
                  >
                    <i className="fas fa-user-cog"></i> Profile Settings
                  </Link>
                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      handleLogout();
                    }}
                    className="w-full text-left flex items-center gap-2 px-4 py-2 text-xs text-[#ff1744] hover:bg-[#ff1744]/10 transition-all border-t border-[#222]"
                  >
                    <i className="fas fa-sign-out-alt"></i> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content Page Body */}
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
