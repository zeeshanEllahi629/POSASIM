import prisma from "@/lib/prisma";
import GlobalExtrasClient from "./GlobalExtrasClient";


export default async function GlobalExtrasPage() {
  let globalExtras = [];
  let error = null;

  try {
    globalExtras = await prisma.global_extras.findMany({
      orderBy: {
        reorder_id: "asc",
      },
    });
  } catch (err) {
    console.error("Failed to load global extras:", err);
    error = "Failed to load global extras from the database.";
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center gap-4 border-b border-[#222] pb-6">
        <div className="w-12 h-12 rounded-2xl bg-[#00e676]/10 flex items-center justify-center border border-[#00e676]/20 shadow-lg shadow-[#00e676]/5">
          <i className="fas fa-puzzle-piece text-xl text-[#00e676]"></i>
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Global Extras
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage global extras available across multiple items
          </p>
        </div>
      </div>

      <GlobalExtrasClient initialExtras={globalExtras} error={error} />
    </div>
  );
}

