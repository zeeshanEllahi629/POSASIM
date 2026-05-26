"use client";

import { useState } from "react";
import { useCartStore } from "@/store/cartStore";

export default function AddToCartButton({ item }) {
  const addToCart = useCartStore((state) => state.addToCart);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariationId, setSelectedVariationId] = useState(
    item.variations?.length > 0 ? item.variations[0].id : null
  );

  const selectedVariation = item.variations?.find(v => v.id === Number(selectedVariationId));
  const finalPrice = selectedVariation ? Number(selectedVariation.price) : Number(item.price);

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart({
      id: Number(item.id),
      name: item.item_name,
      price: finalPrice,
      image: `/storage/app/public/admin-assets/images/item/${item.image}`,
      quantity: quantity,
      variation_id: selectedVariationId,
      variation_name: selectedVariation ? selectedVariation.name : null,
    });
  };

  const handleIncrement = (e) => {
    e.preventDefault();
    setQuantity(q => q + 1);
  };

  const handleDecrement = (e) => {
    e.preventDefault();
    if (quantity > 1) setQuantity(q => q - 1);
  };

  return (
    <div className="w-full flex flex-col gap-3 mt-auto">
      {item.variations && item.variations.length > 0 && (
        <select 
          value={selectedVariationId} 
          onChange={(e) => setSelectedVariationId(Number(e.target.value))}
          className="w-full bg-[#222] border border-[#333] text-white text-sm rounded-lg focus:ring-[#00e676] focus:border-[#00e676] block p-2 outline-none"
        >
          {item.variations.map(v => (
            <option key={v.id} value={v.id}>{v.name} - ${v.price}</option>
          ))}
        </select>
      )}

      <div className="flex gap-2">
        <div className="flex bg-[#222] border border-[#333] rounded-lg items-center overflow-hidden">
          <button onClick={handleDecrement} className="px-3 py-2 text-zinc-400 hover:text-white hover:bg-[#333] transition-colors">-</button>
          <span className="px-2 text-white font-bold w-8 text-center">{quantity}</span>
          <button onClick={handleIncrement} className="px-3 py-2 text-zinc-400 hover:text-white hover:bg-[#333] transition-colors">+</button>
        </div>
        
        <button 
          onClick={handleAddToCart}
          className="flex-1 bg-[#2a2a2a] text-white font-bold py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
        >
          <i className="fa-solid fa-cart-plus"></i> Add
        </button>
      </div>
    </div>
  );
}
