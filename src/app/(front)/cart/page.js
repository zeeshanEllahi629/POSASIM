"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useCartStore } from "@/store/cartStore";

export default function CartPage() {
  const [mounted, setMounted] = useState(false);
  const cartItems = useCartStore((state) => state.cartItems);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const subtotal = useCartStore((state) => state.getSubtotal());

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // Avoid hydration mismatch on initial render

  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + tax;

  return (
    <div className="bg-[#0a0a0a] min-h-screen py-10">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-4xl font-extrabold text-white uppercase tracking-tight">Your Cart</h1>
          <p className="text-zinc-400 mt-2">Review your items before checkout</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Cart Items */}
          <div className="w-full lg:w-2/3">
            <div className="bg-[#111] border border-[#222] rounded-2xl shadow-sm p-6">
              {cartItems.length > 0 ? (
                <div className="space-y-6">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-[#333] last:border-0 last:pb-0">
                      <div className="w-24 h-24 rounded-xl overflow-hidden bg-[#222] flex-shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      
                      <div className="flex-1 text-center sm:text-left">
                        <h3 className="font-bold text-lg text-white">{item.name}</h3>
                        <p className="text-red-500 font-bold">${item.price.toFixed(2)}</p>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="flex items-center bg-[#222] rounded-lg p-1">
                          <button 
                            onClick={() => updateQuantity(item.id, -1)}
                            className="w-8 h-8 flex items-center justify-center bg-[#111] rounded shadow-sm text-zinc-400 hover:text-red-500 transition"
                          >
                            <i className="fa-solid fa-minus text-xs"></i>
                          </button>
                          <span className="w-10 text-center font-bold text-white">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, 1)}
                            className="w-8 h-8 flex items-center justify-center bg-[#111] rounded shadow-sm text-zinc-400 hover:text-red-500 transition"
                          >
                            <i className="fa-solid fa-plus text-xs"></i>
                          </button>
                        </div>
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="w-10 h-10 flex items-center justify-center bg-red-900/20 text-red-500 rounded-lg hover:bg-red-600 hover:text-white transition"
                        >
                          <i className="fa-solid fa-trash"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl text-zinc-700 mb-4"><i className="fa-solid fa-cart-arrow-down"></i></div>
                  <h3 className="text-xl font-bold text-zinc-300">Your cart is empty</h3>
                  <p className="text-zinc-500 mt-2 mb-6">Looks like you haven't added anything to your cart yet.</p>
                  <Link href="/menu" className="inline-block bg-red-600 text-white font-bold px-8 py-3 rounded-lg shadow-md hover:bg-red-700 transition">
                    Browse Menu
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          {cartItems.length > 0 && (
            <div className="w-full lg:w-1/3">
              <div className="bg-[#111] border border-[#222] rounded-2xl shadow-sm p-6 sticky top-24">
                <h3 className="font-bold text-xl mb-6 text-white border-b border-[#333] pb-4">Order Summary</h3>
                
                <div className="space-y-4 mb-6 text-zinc-400">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-medium text-white">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (8%)</span>
                    <span className="font-medium text-white">${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span className="font-medium text-white">Calculated at checkout</span>
                  </div>
                </div>
                
                <div className="border-t border-[#333] pt-4 mb-8">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-lg text-white">Total</span>
                    <span className="font-bold text-2xl text-red-500">${total.toFixed(2)}</span>
                  </div>
                </div>

                <Link 
                  href="/checkout" 
                  className="w-full block text-center bg-[#2a2a2a] text-white font-bold py-4 rounded-lg hover:bg-red-600 transition-colors shadow-lg"
                >
                  Proceed to Checkout <i className="fa-solid fa-arrow-right ml-2"></i>
                </Link>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
