"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import FallbackImage from '@/components/front/FallbackImage';
import AddToCartButton from '@/components/front/AddToCartButton';
import { useCartStore } from '@/store/cartStore';

export default function MenuClient({ items, categories, subcategories = [], viewMode, showBrief }) {
  const [selectedCategoryId, setSelectedCategoryId] = useState("all");
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Cart Store mapping
  const cartItems = useCartStore(state => state.cartItems);
  const removeItem = useCartStore(state => state.removeItem);
  const updateQuantity = useCartStore(state => state.updateQuantity);
  const getSubtotal = useCartStore(state => state.getSubtotal);
  const isSidebarOpen = useCartStore(state => state.isSidebarOpen);
  const setSidebarOpen = useCartStore(state => state.setSidebarOpen);

  const handleCategorySelect = (id) => {
    setSelectedCategoryId(id);
    setSelectedSubcategoryId("all");
  };

  const activeSubcategories = useMemo(() => {
    if (selectedCategoryId === "all") return [];
    return subcategories.filter(sub => String(sub.cat_id) === String(selectedCategoryId));
  }, [subcategories, selectedCategoryId]);

  // Filter Items
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesCat = selectedCategoryId === "all" || String(item.cat_id) === String(selectedCategoryId);
      const matchesSubcat = selectedSubcategoryId === "all" || String(item.subcat_id) === String(selectedSubcategoryId);
      const matchesSearch = item.item_name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSubcat && matchesSearch;
    });
  }, [items, selectedCategoryId, selectedSubcategoryId, searchQuery]);

  return (
    <div className="flex min-h-screen bg-[#0a0a0a] text-white">
      {/* Left Main Content */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'lg:mr-80' : ''}`}>
        <div className="p-4 lg:p-8">
          {/* Header & Search */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <div>
              <h1 className="text-4xl font-extrabold uppercase tracking-tight">Our Menu</h1>
              <p className="text-zinc-400 mt-1">Discover our delicious offerings</p>
            </div>
            <div className="relative w-full md:w-72">
              <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
              <input 
                type="text" 
                placeholder="Search food..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-[#111] border border-[#222] rounded-full py-3 pl-12 pr-4 text-white focus:outline-none focus:border-red-600 transition-colors"
              />
            </div>
          </div>

          {/* Categories Horizontal Scroll */}
          <div className="mb-4">
            <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide snap-x">
              <button 
                onClick={() => handleCategorySelect("all")}
                className={`snap-start whitespace-nowrap px-6 py-3 rounded-full font-bold transition-all shadow-md flex-shrink-0 ${selectedCategoryId === "all" ? 'bg-red-600 text-white' : 'bg-[#1a1a1a] text-zinc-400 hover:text-white hover:bg-[#222]'}`}
              >
                All Items
              </button>
              {categories.map(cat => (
                <button 
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat.id)}
                  className={`snap-start whitespace-nowrap px-6 py-3 rounded-full font-bold transition-all shadow-md flex flex-col items-center flex-shrink-0 ${String(selectedCategoryId) === String(cat.id) ? 'bg-red-600 text-white' : 'bg-[#1a1a1a] text-zinc-400 hover:text-white hover:bg-[#222]'}`}
                >
                  {cat.category_name}
                </button>
              ))}
            </div>
          </div>

          {/* Subcategories Horizontal Scroll (if any) */}
          {activeSubcategories.length > 0 && (
            <div className="mb-8 pl-4 border-l-2 border-red-600/30">
              <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-hide snap-x">
                <button 
                  onClick={() => setSelectedSubcategoryId("all")}
                  className={`snap-start whitespace-nowrap px-4 py-2 rounded-full text-sm font-bold transition-all shadow-sm flex-shrink-0 ${selectedSubcategoryId === "all" ? 'bg-zinc-800 text-white border border-zinc-600' : 'bg-transparent text-zinc-500 hover:text-zinc-300 border border-zinc-800'}`}
                >
                  All
                </button>
                {activeSubcategories.map(sub => (
                  <button 
                    key={sub.id}
                    onClick={() => setSelectedSubcategoryId(sub.id)}
                    className={`snap-start whitespace-nowrap px-4 py-2 rounded-full text-sm font-bold transition-all shadow-sm flex-shrink-0 ${String(selectedSubcategoryId) === String(sub.id) ? 'bg-zinc-800 text-white border border-zinc-600' : 'bg-transparent text-zinc-500 hover:text-zinc-300 border border-zinc-800'}`}
                  >
                    {sub.subcategory_name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Product Grid */}
          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.map(item => (
                <div key={item.id} className="bg-[#111] rounded-2xl shadow-sm hover:shadow-[0_0_15px_rgba(220,38,38,0.2)] transition-shadow overflow-hidden group flex flex-col h-full border border-[#222]">
                  <div className="h-48 bg-[#1a1a1a] relative overflow-hidden flex-shrink-0">
                    <FallbackImage 
                      src={`/storage/app/public/admin-assets/images/item/${item.image}`}
                      alt={item.item_name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                      fallbackSrc={`https://via.placeholder.com/400x300?text=${encodeURIComponent(item.item_name)}`}
                    />
                  </div>
                  <div className="p-5 flex flex-col flex-grow">
                    <div className="flex justify-between items-start mb-2 gap-2">
                      <h3 className="font-bold text-lg text-white group-hover:text-red-500 transition-colors line-clamp-2">{item.item_name}</h3>
                      <span className="font-bold text-lg text-red-500 flex-shrink-0">${item.price}</span>
                    </div>
                    {showBrief && (
                      <p className="text-zinc-400 text-xs mb-4 line-clamp-2 flex-grow">{item.item_description || "Delicious item ready to be ordered."}</p>
                    )}
                    <div className="mt-auto pt-4">
                      <AddToCartButton item={item} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
             <div className="bg-[#111] rounded-2xl shadow-sm p-10 text-center border border-[#222]">
               <div className="text-6xl text-zinc-700 mb-4"><i className="fa-solid fa-utensils"></i></div>
               <h3 className="text-xl font-bold text-zinc-300">No Items Found</h3>
               <p className="text-zinc-500 mt-2">Try a different category or search term.</p>
             </div>
          )}
        </div>
      </div>

      {/* Right Sidebar Cart (POS Style) */}
      <div className={`fixed right-0 top-0 h-full w-80 bg-[#111] border-l border-[#222] shadow-2xl flex flex-col transition-transform duration-300 z-40 ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-4 border-b border-[#222] flex justify-between items-center bg-[#0a0a0a]">
          <h2 className="font-bold text-lg flex items-center gap-2">
            <i className="fas fa-shopping-basket text-red-600"></i> Your Order
          </h2>
          <button onClick={() => setSidebarOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-[#222] hover:bg-red-600 transition-colors">
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
          {cartItems.length === 0 ? (
            <div className="text-center py-10 text-zinc-500">
              <i className="fas fa-shopping-cart text-4xl mb-3 opacity-50"></i>
              <p>Your cart is empty</p>
            </div>
          ) : (
            cartItems.map((item, idx) => (
              <div key={idx} className="bg-[#1a1a1a] rounded-xl p-3 flex gap-3 border border-[#222] relative group">
                <button 
                  onClick={() => removeItem(item.id, item.variation_id)}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                >
                  <i className="fas fa-times"></i>
                </button>
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-black flex-shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" onError={(e) => e.target.src='https://via.placeholder.com/100'} />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-sm leading-tight line-clamp-1">{item.name}</h4>
                    {item.variation_name && <p className="text-xs text-zinc-400">{item.variation_name}</p>}
                    <p className="text-red-500 font-bold text-sm">${item.price}</p>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <button onClick={() => updateQuantity(item.id, item.variation_id, -1)} className="w-6 h-6 bg-[#222] rounded flex items-center justify-center hover:bg-[#333]">-</button>
                    <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.variation_id, 1)} className="w-6 h-6 bg-[#222] rounded flex items-center justify-center hover:bg-[#333]">+</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Cart Footer / Checkout */}
        {cartItems.length > 0 && (
          <div className="p-4 bg-[#0a0a0a] border-t border-[#222]">
            <div className="flex justify-between items-center mb-4 text-lg">
              <span className="text-zinc-400">Total</span>
              <span className="font-bold text-2xl text-white">${getSubtotal().toFixed(2)}</span>
            </div>
            <Link href="/checkout" className="w-full block text-center bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl shadow-lg transition-colors">
              Proceed to Checkout <i className="fas fa-arrow-right ml-2"></i>
            </Link>
          </div>
        )}
      </div>

      {/* Floating Cart Button (when sidebar is closed) */}
      {!isSidebarOpen && cartItems.length > 0 && (
        <button 
          onClick={() => setSidebarOpen(true)}
          className="fixed bottom-6 right-6 w-16 h-16 bg-red-600 text-white rounded-full shadow-[0_0_20px_rgba(220,38,38,0.4)] flex items-center justify-center hover:scale-105 transition-transform z-30"
        >
          <div className="relative">
            <i className="fas fa-shopping-basket text-xl"></i>
            <span className="absolute -top-3 -right-3 bg-white text-red-600 text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center border-2 border-red-600">
              {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
            </span>
          </div>
        </button>
      )}

    </div>
  );
}
