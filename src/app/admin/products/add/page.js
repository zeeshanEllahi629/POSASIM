"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function AddProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    item_name: "",
    sku: "",
    brand_id: "",
    unit_id: "",
    warranty_id: "",
    branch_id: "",
    cat_id: "",
    subcat_id: "",
    alert_quantity: "0",
    barcode_type: "C128",
    enable_description: true,
    item_description: "",
    tax_type: "inclusive",
    product_type: "single",
    label_print: true,
    price: "",
    qty: "",
    image: null
  });

  const [options, setOptions] = useState({
    brands: [],
    units: [],
    warranties: [],
    categories: [],
    locations: [],
    taxes: []
  });

  useEffect(() => {
    fetch("/api/admin/products/form-data")
      .then(res => res.json())
      .then(data => {
        setOptions({
          brands: data.brands || [],
          units: data.units || [],
          warranties: data.warranties || [],
          categories: data.categories || [],
          locations: data.locations || [],
          taxes: data.taxes || []
        });
      })
      .catch(err => console.error("Failed to load options", err));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, image: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== undefined) {
          data.append(key, formData[key]);
        }
      });

      const res = await fetch("/api/admin/products", {
        method: "POST",
        body: data,
      });

      const result = await res.json();
      if (res.ok && result.status === 1) {
        toast.success("Product created successfully!");
        router.push("/admin/products");
      } else {
        toast.error(result.error || "Failed to create product");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Add New Product</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* General Details */}
        <div className="bg-[#111] border border-[#222] rounded-xl p-6">
          <h2 className="text-lg font-semibold text-[#00e676] mb-4">General Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Product Name *</label>
              <input type="text" name="item_name" required value={formData.item_name} onChange={handleChange} className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-3 py-2 text-white text-sm" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">SKU</label>
              <input type="text" name="sku" value={formData.sku} onChange={handleChange} className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-3 py-2 text-white text-sm" placeholder="Leave blank to auto-generate" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Barcode Type</label>
              <select name="barcode_type" value={formData.barcode_type} onChange={handleChange} className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-3 py-2 text-white text-sm">
                <option value="C128">Code 128 (C128)</option>
                <option value="C39">Code 39 (C39)</option>
                <option value="EAN-13">EAN-13</option>
                <option value="UPC-A">UPC-A</option>
              </select>
            </div>
            
            <div>
              <label className="block text-xs text-gray-400 mb-1">Unit</label>
              <select name="unit_id" value={formData.unit_id} onChange={handleChange} className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-3 py-2 text-white text-sm">
                <option value="">Please Select</option>
                {options.units.map(u => <option key={u.id} value={u.id}>{u.name} ({u.short_name})</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Brand</label>
              <select name="brand_id" value={formData.brand_id} onChange={handleChange} className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-3 py-2 text-white text-sm">
                <option value="">Please Select</option>
                {options.brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Category *</label>
              <select name="cat_id" required value={formData.cat_id} onChange={handleChange} className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-3 py-2 text-white text-sm">
                <option value="">Please Select</option>
                {options.categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            
            <div>
              <label className="block text-xs text-gray-400 mb-1">Business Location</label>
              <select name="branch_id" value={formData.branch_id} onChange={handleChange} className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-3 py-2 text-white text-sm">
                <option value="">All Locations</option>
                {options.locations.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Alert Quantity</label>
              <input type="number" name="alert_quantity" value={formData.alert_quantity} onChange={handleChange} className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-3 py-2 text-white text-sm" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Product Image</label>
              <input type="file" onChange={handleFileChange} className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-3 py-[6px] text-white text-sm" />
            </div>
          </div>
        </div>

        {/* Product Type & Pricing */}
        <div className="bg-[#111] border border-[#222] rounded-xl p-6">
          <h2 className="text-lg font-semibold text-[#00e676] mb-4">Pricing & Variations</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Product Type *</label>
              <select name="product_type" value={formData.product_type} onChange={handleChange} className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-3 py-2 text-white text-sm">
                <option value="single">Single</option>
                <option value="variable">Variable</option>
                <option value="combo">Combo</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Applicable Tax</label>
              <select name="tax" onChange={handleChange} className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-3 py-2 text-white text-sm">
                {options.taxes.map(t => <option key={t.id} value={t.rate}>{t.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Selling Price Tax Type</label>
              <select name="tax_type" value={formData.tax_type} onChange={handleChange} className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-3 py-2 text-white text-sm">
                <option value="inclusive">Inclusive</option>
                <option value="exclusive">Exclusive</option>
              </select>
            </div>
          </div>

          {formData.product_type === "single" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 border-t border-[#333] pt-6">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Price *</label>
                <input type="number" step="0.01" name="price" required={formData.product_type === 'single'} value={formData.price} onChange={handleChange} className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-3 py-2 text-white text-sm" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Initial Stock (Qty)</label>
                <input type="number" name="qty" required={formData.product_type === 'single'} value={formData.qty} onChange={handleChange} className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-3 py-2 text-white text-sm" />
              </div>
            </div>
          )}

          {formData.product_type === "variable" && (
            <div className="mt-6 border-t border-[#333] pt-6">
              <p className="text-gray-400 text-sm mb-4">You can add variations (e.g. Small, Medium, Large) from the Edit Product screen after saving the base product.</p>
            </div>
          )}
        </div>

        {/* Details & Warranties */}
        <div className="bg-[#111] border border-[#222] rounded-xl p-6">
          <h2 className="text-lg font-semibold text-[#00e676] mb-4">Additional Details</h2>
          <div className="mb-4 flex items-center gap-2">
            <input type="checkbox" name="enable_description" checked={formData.enable_description} onChange={handleChange} id="desc_toggle" className="w-4 h-4 rounded bg-[#1a1a1a]" />
            <label htmlFor="desc_toggle" className="text-sm text-gray-300">Enable Product Description</label>
          </div>
          
          {formData.enable_description && (
            <div className="mb-4">
              <textarea name="item_description" value={formData.item_description} onChange={handleChange} rows="4" className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-3 py-2 text-white text-sm" placeholder="Product description..."></textarea>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Warranty</label>
              <select name="warranty_id" value={formData.warranty_id} onChange={handleChange} className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-3 py-2 text-white text-sm">
                <option value="">No Warranty</option>
                {options.warranties.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
              </select>
            </div>
            <div className="flex flex-col justify-end">
               <div className="flex items-center gap-2 mb-2">
                  <input type="checkbox" name="label_print" checked={formData.label_print} onChange={handleChange} id="print_toggle" className="w-4 h-4 rounded bg-[#1a1a1a]" />
                  <label htmlFor="print_toggle" className="text-sm text-gray-300">Enable Label/Barcode Printing</label>
               </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button type="button" onClick={() => router.push('/admin/products')} className="px-6 py-2 rounded-lg font-semibold text-gray-300 bg-[#222] hover:bg-[#333] transition-colors">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="px-6 py-2 rounded-lg font-bold text-[#0d0d0d] bg-[#00e676] hover:bg-[#00c853] transition-colors shadow-lg shadow-[#00e676]/20">
            {loading ? "Saving..." : "Save Product"}
          </button>
        </div>
      </form>
    </div>
  );
}
