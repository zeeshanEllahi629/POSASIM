import re

with open('src/app/admin/layout.js', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    'const [loadingPerms, setLoadingPerms] = useState(true);',
    'const [loadingPerms, setLoadingPerms] = useState(true);\n  const [openSubmenus, setOpenSubmenus] = useState({});\n\n  const toggleSubmenu = (menuName) => {\n    setOpenSubmenus(prev => ({\n      ...prev,\n      [menuName]: !prev[menuName]\n    }));\n  };'
)

old_menus = """  const allMenuItems = [
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
    { name: "Settings", path: "/admin/settings", icon: "fa-sliders", reqPerm: "ALL" },
  ];"""

new_menus = """  const allMenuItems = [
    { name: "Dashboard", path: "/admin", icon: "fa-chart-pie", reqPerm: "ALL" },
    { name: "POS Terminal", path: "/admin/pos", icon: "fa-cash-register", reqPerm: "View cash register" },
    {
      name: "Products",
      icon: "fa-box",
      reqPerm: "ALL",
      subMenus: [
        { name: "Categories", path: "/admin/categories", reqPerm: "Add/Edit/View/Delete category" },
        { name: "Brands", path: "/admin/brands", reqPerm: "View brand" },
        { name: "Units", path: "/admin/units", reqPerm: "Add/Edit/View/Delete unit" },
        { name: "Warranties", path: "/admin/warranties", reqPerm: "View product" },
        { name: "All Products", path: "/admin/products", reqPerm: "View product" },
        { name: "Add Product", path: "/admin/products/add", reqPerm: "Add product" },
      ]
    },
    {
      name: "Purchases",
      icon: "fa-shopping-cart",
      reqPerm: "ALL",
      subMenus: [
        { name: "All Purchases", path: "/admin/purchases", reqPerm: "View all purchase" },
        { name: "Add Purchase", path: "/admin/purchases/add", reqPerm: "Add purchase" },
        { name: "Suppliers", path: "/admin/suppliers", reqPerm: "View all supplier" },
      ]
    },
    {
      name: "Users",
      icon: "fa-users",
      reqPerm: "ALL",
      subMenus: [
        { name: "Users List", path: "/admin/users", reqPerm: "ALL" },
        { name: "Roles", path: "/admin/roles/add", reqPerm: "View Role" },
      ]
    },
    { name: "Orders", path: "/admin/orders", icon: "fa-receipt", reqPerm: "View all sell" },
    { name: "Add Sale", path: "/admin/sales/add", icon: "fa-file-invoice-dollar", reqPerm: "Add Sell" },
    { name: "Expenses", path: "/admin/expenses/add", icon: "fa-money-bill-wave", reqPerm: "Add expense" },
    { name: "Reports", path: "/admin/reports", icon: "fa-chart-bar", reqPerm: "ALL" },
    { name: "Theme Settings", path: "/admin/theme-settings", icon: "fa-paint-roller", reqPerm: "ALL" },
    { name: "Payment Gateways", path: "/admin/payment-gateways", icon: "fa-credit-card", reqPerm: "ALL" },
    { name: "AI Workflow", path: "/admin/workflow", icon: "fa-project-diagram", reqPerm: "ALL" },
    { name: "AI Agents", path: "/admin/ai-agents", icon: "fa-robot", reqPerm: "ALL" },
    { name: "Branches", path: "/admin/branches", icon: "fa-store", reqPerm: "ALL" },
    { name: "Settings", path: "/admin/settings", icon: "fa-sliders", reqPerm: "ALL" },
  ];"""

content = content.replace(old_menus, new_menus)

old_nav = """        {/* Navigation Items */}
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
        </nav>"""

new_nav = """        {/* Navigation Items */}
        <nav className="flex-1 py-6 px-3 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            const hasSub = item.subMenus && item.subMenus.length > 0;
            const isSubActive = hasSub && item.subMenus.some(sub => pathname === sub.path);
            const isActive = pathname === item.path || isSubActive;
            const isOpen = openSubmenus[item.name] || isSubActive;
            
            return (
              <div key={item.name}>
                {hasSub ? (
                  <button
                    onClick={() => {
                      if (!sidebarOpen) setSidebarOpen(true);
                      toggleSubmenu(item.name);
                    }}
                    title={item.name}
                    className={`w-full flex items-center justify-between px-3 py-3 rounded-xl text-sm font-semibold transition-all group relative ${
                      isActive
                        ? "bg-[#00e676]/10 text-[#00e676] border border-[#00e676]/20"
                        : "text-gray-400 hover:text-white hover:bg-[#111111] border border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <i
                        className={`fas ${item.icon} text-lg ${
                          isActive ? "text-[#00e676]" : "text-gray-400 group-hover:text-white"
                        } shrink-0 w-5 text-center transition-colors`}
                      ></i>
                      {sidebarOpen && <span>{item.name}</span>}
                    </div>
                    {sidebarOpen && (
                      <i className={`fas fa-chevron-down text-xs transition-transform ${isOpen ? 'rotate-180' : ''}`}></i>
                    )}
                    {/* Tooltip for collapsed sidebar */}
                    {!sidebarOpen && (
                      <span className="absolute left-20 scale-0 group-hover:scale-100 bg-[#111] border border-[#333] text-white text-xs px-2 py-1.5 rounded-lg whitespace-nowrap shadow-xl transition-all z-30">
                        {item.name}
                      </span>
                    )}
                  </button>
                ) : (
                  <Link
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
                )}
                
                {/* Render Submenus */}
                {hasSub && isOpen && sidebarOpen && (
                  <div className="mt-1 ml-4 pl-4 border-l border-[#333] space-y-1">
                    {item.subMenus.map((subItem) => {
                      const isSubItemActive = pathname === subItem.path;
                      // Also filter subitems by permission if needed
                      if (!isSuperAdmin && subItem.reqPerm !== 'ALL' && !permissions.includes(subItem.reqPerm)) {
                        return null;
                      }
                      return (
                        <Link
                          key={subItem.name}
                          href={subItem.path}
                          className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                            isSubItemActive
                              ? "text-[#00e676] bg-[#00e676]/5"
                              : "text-gray-400 hover:text-white hover:bg-[#111]"
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${isSubItemActive ? 'bg-[#00e676]' : 'bg-gray-600'}`}></span>
                          {subItem.name}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>"""

content = content.replace(old_nav, new_nav)

with open('src/app/admin/layout.js', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated successfully")
