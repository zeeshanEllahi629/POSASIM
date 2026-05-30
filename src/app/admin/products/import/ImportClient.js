"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ImportClient() {
  const router = useRouter();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleImport = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a file to import");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/products/import", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.status === 1) {
        setSuccess(`Successfully imported ${data.count} products.`);
        setFile(null);
        e.target.reset();
        // Redirect to products list after a short delay
        setTimeout(() => {
          router.push("/admin/products");
        }, 2000);
      } else {
        setError(data.error || "Failed to import products");
      }
    } catch (err) {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadTemplate = () => {
    // Generate simple CSV template for Foodefy
    const headers = [
      "Product Name",
      "Category Name",
      "Price",
      "Stock Quantity",
      "Product Type (1=Veg, 2=Non-Veg)",
      "Description",
      "Image Filename"
    ].join(",");
    
    const sample = [
      "Deluxe Burger",
      "Burgers",
      "9.99",
      "100",
      "2",
      "Delicious beef burger with cheese",
      "burger.jpg"
    ].join(",");

    const csvContent = "data:text/csv;charset=utf-8," + headers + "\n" + sample;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "products_import_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Import Form Card */}
      <div className="bg-[#111111]/80 border border-[#222222] rounded-2xl overflow-hidden shadow-xl p-6">
        {error && (
          <div className="mb-4 p-4 rounded-xl bg-red-950/20 border border-red-500/30 text-[#ff1744] text-xs font-bold">
            <i className="fas fa-exclamation-triangle mr-2"></i> {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-4 rounded-xl bg-green-950/20 border border-green-500/30 text-[#00e676] text-xs font-bold">
            <i className="fas fa-check-circle mr-2"></i> {success}
          </div>
        )}

        <form onSubmit={handleImport} className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-end gap-6">
            <div className="flex-1">
              <label className="block text-sm font-bold text-gray-300 mb-2">
                File To Import:
              </label>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-400
                  file:mr-4 file:py-2.5 file:px-4
                  file:rounded-xl file:border-0
                  file:text-sm file:font-semibold
                  file:bg-[#1c1c1c] file:text-gray-300
                  hover:file:bg-[#222222] border border-[#222222] rounded-xl bg-[#080808]"
              />
            </div>
            <div>
              <button
                type="submit"
                disabled={loading}
                className="bg-[#0f3460] hover:bg-[#1a4a85] text-white py-2.5 px-6 rounded-xl font-bold text-sm tracking-wide transition-all shadow-lg flex items-center justify-center gap-2"
              >
                {loading ? <i className="fas fa-spinner fa-spin"></i> : "Submit"}
              </button>
            </div>
          </div>

          <div>
            <button
              type="button"
              onClick={handleDownloadTemplate}
              className="bg-[#00b894] hover:bg-[#00a382] text-white py-2.5 px-6 rounded-xl font-bold text-sm tracking-wide transition-all shadow-lg shadow-[#00b894]/20 flex items-center justify-center gap-2"
            >
              <i className="fas fa-download"></i> Download template file
            </button>
          </div>
        </form>
      </div>

      {/* Instructions Card */}
      <div className="bg-[#111111]/80 border border-[#222222] rounded-2xl overflow-hidden shadow-xl p-6">
        <h3 className="text-lg font-bold text-white mb-2">Instructions</h3>
        <p className="text-gray-400 text-sm mb-6">
          <strong className="text-gray-200">Carefully follow the instructions before importing the file.</strong><br/>
          The columns of the CSV file should be in the following order.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse border border-[#222]">
            <thead>
              <tr className="bg-[#0a0a0a] border-b border-[#222] text-xs text-gray-400 uppercase font-bold tracking-wider">
                <th className="py-3 px-4 border-r border-[#222] w-24">Column Number</th>
                <th className="py-3 px-4 border-r border-[#222] w-1/3">Column Name</th>
                <th className="py-3 px-4">Instruction</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1c1c1c] text-sm text-gray-300">
              <tr className="hover:bg-[#161616]/40 transition-colors">
                <td className="py-3 px-4 border-r border-[#222]">1</td>
                <td className="py-3 px-4 border-r border-[#222]">Product Name <span className="text-gray-500 text-xs">(Required)</span></td>
                <td className="py-3 px-4">Name of the product</td>
              </tr>
              <tr className="hover:bg-[#161616]/40 transition-colors">
                <td className="py-3 px-4 border-r border-[#222]">2</td>
                <td className="py-3 px-4 border-r border-[#222]">Category Name <span className="text-gray-500 text-xs">(Required)</span></td>
                <td className="py-3 px-4">Name of the Category.<br/><span className="text-gray-500 text-xs">(If not found, a new category with the given name will be created)</span></td>
              </tr>
              <tr className="hover:bg-[#161616]/40 transition-colors">
                <td className="py-3 px-4 border-r border-[#222]">3</td>
                <td className="py-3 px-4 border-r border-[#222]">Price <span className="text-gray-500 text-xs">(Required)</span></td>
                <td className="py-3 px-4">Selling Price (Only in numbers)</td>
              </tr>
              <tr className="hover:bg-[#161616]/40 transition-colors">
                <td className="py-3 px-4 border-r border-[#222]">4</td>
                <td className="py-3 px-4 border-r border-[#222]">Stock Quantity <span className="text-gray-500 text-xs">(Optional)</span></td>
                <td className="py-3 px-4">Current Stock Quantity (Only in numbers). Defaults to 0.</td>
              </tr>
              <tr className="hover:bg-[#161616]/40 transition-colors">
                <td className="py-3 px-4 border-r border-[#222]">5</td>
                <td className="py-3 px-4 border-r border-[#222]">Product Type <span className="text-gray-500 text-xs">(Optional)</span></td>
                <td className="py-3 px-4">Type of product.<br/><b>1 = Veg</b><br/><b>2 = Non-Veg</b><br/>Defaults to 1.</td>
              </tr>
              <tr className="hover:bg-[#161616]/40 transition-colors">
                <td className="py-3 px-4 border-r border-[#222]">6</td>
                <td className="py-3 px-4 border-r border-[#222]">Description <span className="text-gray-500 text-xs">(Optional)</span></td>
                <td className="py-3 px-4">Product description/ingredients.</td>
              </tr>
              <tr className="hover:bg-[#161616]/40 transition-colors">
                <td className="py-3 px-4 border-r border-[#222]">7</td>
                <td className="py-3 px-4 border-r border-[#222]">Image Filename <span className="text-gray-500 text-xs">(Optional)</span></td>
                <td className="py-3 px-4">Image name with extension.<br/><span className="text-gray-500 text-xs">(Image must be uploaded to the server public/uploads/img)</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
