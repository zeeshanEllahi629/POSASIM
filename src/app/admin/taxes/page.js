import prisma from "@/lib/prisma";
import TaxesClient from "./TaxesClient";


export const dynamic = "force-dynamic";

export default async function TaxesPage() {
  let initialTaxes = [];
  let error = null;

  try {
    const data = await prisma.tax.findMany({
      orderBy: { reorder_id: 'asc' },
    });

    initialTaxes = data.map(t => ({
      ...t,
      created_at: t.created_at ? t.created_at.toISOString() : null,
      updated_at: t.updated_at ? t.updated_at.toISOString() : null,
    }));
  } catch (err) {
    console.error("Error fetching taxes:", err);
    error = "Failed to load taxes.";
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <i className="fas fa-file-invoice-dollar text-[#00e676]"></i>
          Taxes Management
        </h1>
        <p className="text-gray-400 mt-2 text-sm">
          Manage system tax rules and rates.
        </p>
      </div>

      <TaxesClient initialTaxes={initialTaxes} error={error} />
    </div>
  );
}

