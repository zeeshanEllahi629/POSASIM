"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function ReceiptPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/pos/receipt/${id}`)
      .then((res) => res.json())
      .then((resData) => {
        if (resData.status === 1) {
          setData(resData);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (data && !loading) {
      setTimeout(() => {
        window.print();
      }, 500);
    }
  }, [data, loading]);

  if (loading) return <div className="p-10 text-center font-bold">Loading Receipt...</div>;
  if (!data) return <div className="p-10 text-center font-bold text-red-500">Receipt not found</div>;

  const { order, details, settings } = data;

  return (
    <div className="bg-white text-black p-4 max-w-sm mx-auto font-sans text-sm" style={{ width: "300px" }}>
      <div className="text-center mb-4">
        <h1 className="font-extrabold text-xl mb-1">{settings?.website_title || "POS SYSTEM"}</h1>
        <p className="text-xs">{settings?.address || ""}</p>
        <p className="text-xs">{settings?.contact || ""}</p>
      </div>

      <div className="border-t border-b border-dashed border-black py-2 mb-4">
        <p className="flex justify-between"><span>Order #:</span> <strong>{order.order_number}</strong></p>
        <p className="flex justify-between"><span>Date:</span> <span>{new Date(order.created_at).toLocaleString()}</span></p>
        <p className="flex justify-between"><span>Type:</span> <span>{order.order_type === "1" ? "Delivery" : "Walk-in"}</span></p>
      </div>

      {(order.name || order.mobile || order.address) && (
        <div className="border-b border-dashed border-black pb-2 mb-4">
          <p className="font-bold mb-1">Customer Details:</p>
          {order.name && <p>{order.name}</p>}
          {order.mobile && <p>{order.mobile}</p>}
          {order.address && <p>{order.address}</p>}
        </div>
      )}

      <table className="w-full mb-4 text-xs">
        <thead>
          <tr className="border-b border-black">
            <th className="text-left pb-1">Item</th>
            <th className="text-center pb-1">Qty</th>
            <th className="text-right pb-1">Price</th>
          </tr>
        </thead>
        <tbody>
          {details.map((item) => (
            <tr key={item.id}>
              <td className="py-1">
                {item.item_name}
                {item.addons_name && <div className="text-[10px] text-gray-600">+ {item.addons_name}</div>}
              </td>
              <td className="py-1 text-center">{item.qty}</td>
              <td className="py-1 text-right">${((item.item_price + item.addons_total_price) * item.qty).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="border-t border-dashed border-black pt-2 mb-4 text-xs space-y-1">
        <p className="flex justify-between"><span>Subtotal:</span> <span>${(order.grand_total - order.tax_amount + order.discount_amount).toFixed(2)}</span></p>
        <p className="flex justify-between"><span>Tax:</span> <span>${order.tax_amount.toFixed(2)}</span></p>
        <p className="flex justify-between"><span>Discount:</span> <span>${order.discount_amount.toFixed(2)}</span></p>
        {order.delivery_charge > 0 && <p className="flex justify-between"><span>Delivery:</span> <span>${order.delivery_charge.toFixed(2)}</span></p>}
        <p className="flex justify-between font-bold text-sm mt-1 border-t border-black pt-1"><span>Grand Total:</span> <span>${order.grand_total.toFixed(2)}</span></p>
      </div>

      <div className="text-center text-xs mt-6">
        <p>Thank you for your business!</p>
        <p>Please come again.</p>
      </div>
    </div>
  );
}
