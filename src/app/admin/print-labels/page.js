"use client";
import React, { useState, useEffect, useRef } from "react";
import Script from "next/script";

export default function PrintLabelsPage() {
  const [items, setItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await fetch("/api/admin/products");
      const data = await res.json();
      if (data.status === 1) {
        setItems(data.items || []);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleSelectItem = (item) => {
    const existing = selectedItems.find((i) => i.id === item.id);
    if (existing) {
      setSelectedItems(selectedItems.map(i => i.id === item.id ? { ...i, printQty: i.printQty + 1 } : i));
    } else {
      setSelectedItems([...selectedItems, { ...item, printQty: 1 }]);
    }
  };

  const updatePrintQty = (id, qty) => {
    if (qty <= 0) {
      setSelectedItems(selectedItems.filter((i) => i.id !== id));
    } else {
      setSelectedItems(selectedItems.map((i) => i.id === id ? { ...i, printQty: qty } : i));
    }
  };

  const generateBarcodes = () => {
    if (typeof window !== "undefined" && window.JsBarcode) {
      document.querySelectorAll(".barcode-target").forEach((element) => {
        const sku = element.getAttribute("data-sku");
        if (sku) {
          window.JsBarcode(element, sku, {
            format: "CODE128",
            width: 2,
            height: 40,
            displayValue: true,
            margin: 0
          });
        }
      });
    }
  };

  useEffect(() => {
    generateBarcodes();
  }, [selectedItems]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto pb-10">
      <Script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js" strategy="lazyOnload" onLoad={generateBarcodes} />

      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body * { visibility: hidden; }
          #print-area, #print-area * { visibility: visible; }
          #print-area { position: absolute; left: 0; top: 0; width: 100%; }
          .no-print { display: none !important; }
          .label-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
          .label-sticker { border: 1px solid #ccc; padding: 10px; text-align: center; page-break-inside: avoid; }
        }
      `}} />

      <div className="flex items-center justify-between mb-6 no-print">
        <h1 className="text-2xl font-bold text-white">Barcode & Label Generator</h1>
        <button onClick={handlePrint} disabled={selectedItems.length === 0} className="px-6 py-2 bg-[#00e676] text-black font-bold rounded hover:bg-[#00c853] disabled:opacity-50">
          Print Labels
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 no-print">
        {/* Product Selector */}
        <div className="bg-[#111] border border-[#222] rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Select Products</h2>
          <div className="h-96 overflow-y-auto pr-2 space-y-2">
            {loading ? <p className="text-gray-400">Loading products...</p> : items.map((item) => (
              <div key={item.id} className="flex justify-between items-center p-3 bg-[#1a1a1a] border border-[#333] rounded hover:border-[#00e676] cursor-pointer" onClick={() => handleSelectItem(item)}>
                <div>
                  <p className="font-semibold text-white">{item.item_name}</p>
                  <p className="text-xs text-gray-400">SKU: {item.sku || item.id} | Price: ${item.price}</p>
                </div>
                <div className="text-[#00e676]"><i className="fa-solid fa-plus"></i></div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Items for Print */}
        <div className="bg-[#111] border border-[#222] rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Labels to Print ({selectedItems.reduce((acc, curr) => acc + curr.printQty, 0)})</h2>
          <div className="h-96 overflow-y-auto pr-2 space-y-3">
            {selectedItems.length === 0 ? <p className="text-gray-500 text-sm">No items selected.</p> : selectedItems.map((item) => (
              <div key={item.id} className="flex justify-between items-center p-3 bg-[#1a1a1a] border border-[#333] rounded">
                <div>
                  <p className="font-semibold text-white text-sm">{item.item_name}</p>
                  <p className="text-xs text-gray-400">SKU: {item.sku || item.id}</p>
                </div>
                <div className="flex items-center gap-3">
                  <label className="text-xs text-gray-400">Qty:</label>
                  <input 
                    type="number" 
                    min="0" 
                    value={item.printQty} 
                    onChange={(e) => updatePrintQty(item.id, parseInt(e.target.value) || 0)} 
                    className="w-16 bg-[#222] border border-[#444] rounded px-2 py-1 text-white text-center"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Hidden Print Area (Only visible when printing) */}
      <div id="print-area" className="mt-10 p-4 bg-white hidden print:block">
        <div className="label-grid">
          {selectedItems.flatMap((item) => 
            Array.from({ length: item.printQty }).map((_, i) => (
              <div key={`${item.id}-${i}`} className="label-sticker flex flex-col items-center justify-center">
                <p className="text-sm font-bold text-black truncate w-full mb-1">{item.item_name}</p>
                <p className="text-xs text-gray-600 mb-1">Price: ${item.price}</p>
                <svg className="barcode-target" data-sku={item.sku || item.id}></svg>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}
