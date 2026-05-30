import prisma from "@/lib/prisma";
import SettingsForm from "@/components/admin/SettingsForm";
import TemplateSettingsForm from "@/components/admin/TemplateSettingsForm";

// Server action or direct query
export default async function AdminSettingsPage() {
  let stats = { categories: 0, items: 0, users: 0, orders: 0 };
  let dbStatus = "Connected";

  try {
    stats.categories = await prisma.categories.count();
    stats.items = await prisma.item.count();
    stats.users = await prisma.users.count();
    stats.orders = await prisma.order.count();
  } catch (error) {
    dbStatus = "Database Connection Error";
    console.error("Settings page DB query failed:", error);
  }

  const maskDbUrl = (url) => {
    if (!url) return "N/A";
    try {
      const parsed = new URL(url);
      return `${parsed.protocol}//${parsed.username}:****@${parsed.host}${parsed.pathname}`;
    } catch (e) {
      return "mysql://root:****@127.0.0.1:3306/foodefy_code";
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* ========== GENERAL SETTINGS PANEL ========== */}
      <SettingsForm />
      
      {/* ========== TEMPLATE CUSTOMIZATION PANEL ========== */}
      <TemplateSettingsForm />

      {/* ========== SYSTEM STATUS PANEL ========== */}
      <div className="bg-[#111111]/80 border border-[#222222] rounded-2xl p-6 shadow-xl space-y-6">
        <div>
          <h3 className="text-base font-bold flex items-center gap-2 font-display text-white">
            <i className="fas fa-server text-[#ff1744]"></i> System & Server Status
          </h3>
          <p className="text-xs text-gray-500 mt-1">Information about your migrated Next.js database and local services</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-[#0a0a0a] border border-[#222] rounded-xl flex items-center justify-between">
            <span className="text-gray-400">Database Connection URL</span>
            <span className="font-mono text-gray-500 text-[10px] break-all select-all">
              {maskDbUrl(process.env.DATABASE_URL)}
            </span>
          </div>

          <div className="p-4 bg-[#0a0a0a] border border-[#222] rounded-xl flex items-center justify-between">
            <span className="text-gray-400">Prisma Connection Status</span>
            <span className={`font-bold ${dbStatus === "Connected" ? "text-[#00e676]" : "text-[#ff1744]"} flex items-center gap-1.5`}>
              <span className={`w-2 h-2 rounded-full ${dbStatus === "Connected" ? "bg-[#00e676]" : "bg-[#ff1744]"} inline-block`}></span>
              {dbStatus}
            </span>
          </div>

          <div className="p-4 bg-[#0a0a0a] border border-[#222] rounded-xl flex items-center justify-between">
            <span className="text-gray-400">Node / Framework Runtime</span>
            <span className="font-mono text-white">Next.js App Router v16</span>
          </div>

          <div className="p-4 bg-[#0a0a0a] border border-[#222] rounded-xl flex items-center justify-between">
            <span className="text-gray-400">JWT Authentication Mode</span>
            <span className="font-bold text-[#00e676]">HS256 (Protected Cookie)</span>
          </div>
        </div>

        {/* Database statistics details */}
        <div className="pt-4 border-t border-[#222] space-y-3">
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Database Entity Counters</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-[#050505] border border-[#1e1e1e] p-3 rounded-lg text-center">
              <div className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Categories</div>
              <div className="text-base font-bold text-white mt-0.5">{stats.categories}</div>
            </div>
            <div className="bg-[#050505] border border-[#1e1e1e] p-3 rounded-lg text-center">
              <div className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Items</div>
              <div className="text-base font-bold text-white mt-0.5">{stats.items}</div>
            </div>
            <div className="bg-[#050505] border border-[#1e1e1e] p-3 rounded-lg text-center">
              <div className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Customers</div>
              <div className="text-base font-bold text-white mt-0.5">{stats.users}</div>
            </div>
            <div className="bg-[#050505] border border-[#1e1e1e] p-3 rounded-lg text-center">
              <div className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Total Orders</div>
              <div className="text-base font-bold text-white mt-0.5">{stats.orders}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
