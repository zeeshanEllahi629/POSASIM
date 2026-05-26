import ImportClient from "./ImportClient";

export const metadata = {
  title: "Import Products | Foodefy Admin",
};

export default function ImportProductsPage() {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Import Products
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            Import products via CSV file
          </p>
        </div>
      </div>

      <ImportClient />
    </div>
  );
}
