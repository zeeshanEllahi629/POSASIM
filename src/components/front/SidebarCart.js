"use client";

import { useCartStore } from "@/store/cartStore";
import Image from "next/image";
import Link from "next/link";
import FallbackImage from "./FallbackImage";

export default function SidebarCart() {
  const { cartItems, isSidebarOpen, setSidebarOpen, updateQuantity, removeItem, getSubtotal } = useCartStore();

  if (!isSidebarOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm transition-opacity"
        onClick={() => setSidebarOpen(false)}
      ></div>

      {/* Sidebar */}
      <div className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-[#111] z-50 shadow-2xl flex flex-col border-l border-[#333] transform transition-transform duration-300">
        <div className="flex justify-between items-center p-5 border-b border-[#333]">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <i className="fa-solid fa-shopping-cart text-[#00e676]"></i> Your Cart
          </h2>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <i className="fa-solid fa-times text-2xl"></i>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-zinc-500">
              <i className="fa-solid fa-basket-shopping text-6xl mb-4 opacity-20"></i>
              <p>Your cart is empty.</p>
            </div>
          ) : (
            cartItems.map((item, idx) => (
              <div key={`${item.id}-${item.variation_id}-${idx}`} className="flex gap-4 bg-[#1a1a1a] p-3 rounded-xl border border-[#333]">
                <div className="w-20 h-20 bg-[#222] rounded-lg overflow-hidden relative flex-shrink-0">
                  <FallbackImage 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-white font-bold text-sm line-clamp-1">{item.name}</h4>
                    {item.variation_name && (
                      <p className="text-[#00e676] text-xs font-semibold">{item.variation_name}</p>
                    )}
                    <p className="text-red-500 font-bold text-sm mt-1">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <div className="flex bg-[#222] border border-[#333] rounded-md items-center">
                      <button onClick={() => updateQuantity(item.id, item.variation_id, -1)} className="px-2 py-1 text-zinc-400 hover:text-white">-</button>
                      <span className="px-2 text-white text-xs">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.variation_id, 1)} className="px-2 py-1 text-zinc-400 hover:text-white">+</button>
                    </div>
                    <button 
                      onClick={() => removeItem(item.id, item.variation_id)}
                      className="text-red-500 hover:text-red-400 p-1"
                    >
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="p-5 border-t border-[#333] bg-[#1a1a1a]">
            <div className="flex justify-between text-white font-bold text-lg mb-4">
              <span>Subtotal</span>
              <span className="text-[#00e676]">${getSubtotal().toFixed(2)}</span>
            </div>
            <Link 
              href="/checkout"
              onClick={() => setSidebarOpen(false)}
              className="w-full block text-center bg-[#00e676] hover:bg-[#00c853] text-[#111] font-extrabold py-4 rounded-xl transition-colors"
            >
              Checkout Now
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
