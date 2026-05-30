"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function ReceiptPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchReceiptData();
    }
  }, [id]);

  const fetchReceiptData = async () => {
    try {
      const res = await fetch(`/api/pos/receipt/${id}`);
      const json = await res.json();
      if (json.status === 1) {
        setData(json);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (data) {
      // Trigger print dialog once content is loaded
      setTimeout(() => {
        window.print();
      }, 500);
    }
  }, [data]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white text-black flex items-center justify-center font-mono text-sm">
        Loading receipt...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-white text-black flex items-center justify-center font-mono text-sm">
        Receipt not found.
      </div>
    );
  }

  const { order, details, settings } = data;

  return (
    <div className="bg-white text-black font-mono text-xs p-5 max-w-[80mm] mx-auto min-h-screen">
      {/* Header */}
      <div className="text-center mb-4 pb-4 border-b-2 border-dashed border-black">
        {/* Placeholder Logo */}
        <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-2 font-bold text-lg">
          <i className="fas fa-utensils"></i>
        </div>
        <h2 className="text-lg font-bold mb-1 uppercase tracking-wider">{settings?.website_title || "POS System"}</h2>
        {settings?.address && <p className="leading-tight text-[11px] mb-1">{settings.address}</p>}
        {settings?.contact && <p className="leading-tight text-[11px] font-bold">Tel: {settings.contact}</p>}
      </div>

      {/* Info */}
      <div className="mb-3 pb-2 border-b border-dashed border-black space-y-0.5">
        <div className="flex justify-between">
          <span>Order #:</span>
          <span>{order.order_number}</span>
        </div>
        <div className="flex justify-between">
          <span>Date:</span>
          <span>
            {order.created_at
              ? new Date(order.created_at).toLocaleString("en-US", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })
              : ""}
          </span>
        </div>
        {order.name && (
          <div className="flex justify-between mt-1 pt-1 border-t border-dotted border-gray-400">
            <span>Customer:</span>
            <span className="font-bold">{order.name}</span>
          </div>
        )}
        {order.mobile && (
          <div className="flex justify-between">
            <span>Phone:</span>
            <span>{order.mobile.toString()}</span>
          </div>
        )}
        
        <div className="flex justify-between mt-1 font-bold">
          <span>Type:</span>
          <span className="uppercase">{order.order_type === "1" ? "Delivery" : order.order_type === "2" ? "Collection/POS" : "Unknown"}</span>
        </div>

        {order.order_type === "1" && order.address && (
          <div className="mt-1 pt-1 border-t border-dotted border-gray-400">
            <span className="block font-bold">Delivery Address:</span>
            <span className="block text-[11px] leading-tight mt-0.5">
              {order.address}
              {order.city && `, ${order.city}`}
              {order.postal_code && ` ${order.postal_code}`}
            </span>
          </div>
        )}
        {order.order_notes && (
          <div className="pt-1 mt-1 border-t border-dotted border-gray-400">
            <span className="font-bold block mb-0.5">Special Brief/Notes:</span>
            <p className="text-[10px] uppercase italic">{order.order_notes}</p>
          </div>
        )}
      </div>

      {/* Items */}
      <div className="mb-3 pb-2 border-b border-dashed border-black space-y-1">
        <div className="flex justify-between font-bold border-b border-black pb-1 mb-1.5">
          <span className="flex-1">Item</span>
          <span className="w-8 text-center">Qty</span>
          <span className="w-16 text-right">Total</span>
        </div>
        {details.map((detail) => (
          <div key={detail.id} className="space-y-0.5">
            <div className="flex justify-between">
              <span className="flex-1">{detail.item_name}</span>
              <span className="w-8 text-center">{detail.qty}</span>
              <span className="w-16 text-right">
                ${(detail.item_price * detail.qty).toFixed(2)}
              </span>
            </div>
            {detail.addons_name && (
              <div className="pl-2 text-[10px] text-gray-600">
                + Addons: {detail.addons_name}
              </div>
            )}
            {detail.extras_name && (
              <div className="pl-2 text-[10px] text-gray-600">
                + Extras: {detail.extras_name}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="mb-3 pb-2 border-b border-dashed border-black space-y-1">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>${(order.grand_total - order.tax_amount + order.discount_amount).toFixed(2)}</span>
        </div>
        {order.tax_amount > 0 && (
          <div className="flex justify-between">
            <span>Tax:</span>
            <span>${order.tax_amount.toFixed(2)}</span>
          </div>
        )}
        {order.discount_amount > 0 && (
          <div className="flex justify-between">
            <span>Discount:</span>
            <span>-${order.discount_amount.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between font-bold text-sm border-t border-black pt-1.5 mt-1.5">
          <span>Total:</span>
          <span>${parseFloat(order.grand_total || 0).toFixed(2)}</span>
        </div>
      </div>

      {/* Payment Method */}
      <div className="mb-4 text-center border border-black p-1.5 rounded">
        <span className="font-bold uppercase tracking-wider text-[11px]">
          {order.transaction_type === "1" || order.transaction_type === "Cash" ? "Paid via Cash" : 
           order.transaction_type === "2" || order.transaction_type === "Card" ? "Paid via Card" : 
           order.transaction_type === "5" || order.transaction_type === "Split" ? "Split Payment" : "Paid"}
        </span>
        {(order.transaction_type === "5" || order.transaction_type === "Split") && order.admin_notes && (
          <div className="text-[10px] italic mt-0.5 border-t border-dotted border-black pt-0.5">
            {order.admin_notes}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="text-center mt-5 pt-3 border-t border-dashed border-black space-y-1">
        <p className="font-bold text-[11px]">Thank you for your purchase!</p>
        <p className="text-[9px] text-gray-700">Please come again</p>
        
        {/* Mock Barcode */}
        <div className="mt-4 flex flex-col items-center justify-center overflow-hidden">
          <div className="flex gap-[1px] h-8 justify-center mb-1">
            {[...Array(40)].map((_, i) => (
              <div key={i} className={`h-full ${Math.random() > 0.5 ? 'bg-black' : 'bg-transparent'} ${Math.random() > 0.7 ? 'w-1' : 'w-0.5'}`}></div>
            ))}
          </div>
          <span className="tracking-[0.3em] font-mono text-[9px]">{order.order_number}</span>
        </div>
      </div>
    </div>
  );
}
