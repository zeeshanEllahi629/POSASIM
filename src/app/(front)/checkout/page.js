"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useCartStore } from "@/store/cartStore";
import Autocomplete from "react-google-autocomplete";

export default function CheckoutPage() {
  const [mounted, setMounted] = useState(false);
  const cartItems = useCartStore((state) => state.cartItems);
  const subtotal = useCartStore((state) => state.getSubtotal());
  const clearCart = useCartStore((state) => state.clearCart);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
    orderNotes: "",
    orderType: 1, // 1 = Delivery, 2 = Collection
    paymentMethod: "",
    branchId: ""
  });
  const [paymentGateways, setPaymentGateways] = useState([]);
  const [branches, setBranches] = useState([]);

  const [promoCodeInput, setPromoCodeInput] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [promoError, setPromoError] = useState("");
  const [promoSuccess, setPromoSuccess] = useState("");
  const [validatingPromo, setValidatingPromo] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const token = document.cookie.split("; ").find(row => row.startsWith("token="));
      if (token) {
        const payloadBase64 = token.split("=")[1].split(".")[1];
        const payload = JSON.parse(atob(payloadBase64.replace(/-/g, "+").replace(/_/g, "/")));
        
        // Optionally fetch full profile to get mobile/address, but we can at least fill name/email from payload
        const names = payload.name ? payload.name.split(" ") : ["", ""];
        setFormData(prev => ({
          ...prev,
          firstName: names[0] || "",
          lastName: names.slice(1).join(" ") || "",
          email: payload.email || "",
        }));
      }
    } catch (e) {
      // Ignore
    }

    // Fetch active payment gateways and branches
    fetch("/api/checkout")
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          if (data.payments) {
            setPaymentGateways(data.payments);
            if (data.payments.length > 0) {
              setFormData(prev => ({ ...prev, paymentMethod: data.payments[0].payment_name }));
            }
          }
          if (data.branches) {
            setBranches(data.branches);
            if (data.branches.length > 0) {
              setFormData(prev => ({ ...prev, branchId: data.branches[0].id.toString() }));
            }
          }
        }
      })
      .catch(err => console.error("Failed to load checkout data", err));
  }, []);

  const handleApplyPromo = async () => {
    if (!promoCodeInput.trim()) return;
    setValidatingPromo(true);
    setPromoError("");
    setPromoSuccess("");
    
    try {
      const res = await fetch("/api/checkout/promo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: promoCodeInput, subtotal })
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
        setPromoSuccess(data.message);
        setPromoCode(data.promoCode);
        setDiscountAmount(parseFloat(data.discountAmount));
      } else {
        setPromoError(data.error || "Invalid promo code");
        setPromoCode("");
        setDiscountAmount(0);
      }
    } catch (err) {
      setPromoError("Failed to validate promo code");
    } finally {
      setValidatingPromo(false);
    }
  };

  if (!mounted) return null;

  const tax = (subtotal - discountAmount) * 0.08;
  const deliveryFee = formData.orderType === 1 ? 5.00 : 0;
  const total = (subtotal - discountAmount) + tax + deliveryFee;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      alert("Your cart is empty.");
      return;
    }
    
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formData,
          cartItems,
          subtotal,
          tax,
          deliveryFee,
          discountAmount,
          promoCode,
          total
        })
      });

      const result = await response.json();

      if (response.ok) {
        alert(`Order Placed Successfully! Your Order Number is: ${result.orderNumber}`);
        clearCart();
        window.location.href = "/";
      } else {
        alert(`Checkout failed: ${result.error}`);
      }
    } catch (error) {
      console.error("Checkout Error:", error);
      alert("An error occurred during checkout.");
    }
  };

  return (
    <div className="bg-[#0a0a0a] min-h-screen py-10">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-4xl font-extrabold text-white uppercase tracking-tight">Checkout</h1>
          <p className="text-zinc-400 mt-2">Complete your order details below</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8">
          
          {/* Billing & Shipping Info */}
          <div className="w-full lg:w-2/3 space-y-8">
            
            {/* Order Type Toggle */}
            <div className="bg-[#111] border border-[#222] rounded-2xl shadow-sm p-6 md:p-8">
              <h3 className="font-bold text-xl mb-6 text-white border-b border-[#333] pb-4">Order Type</h3>
              <div className="flex gap-4 mb-6">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, orderType: 1 }))}
                  className={`flex-1 py-4 rounded-xl font-bold border-2 transition-all ${
                    formData.orderType === 1 
                      ? "bg-red-600/10 border-red-600 text-red-500" 
                      : "bg-[#222] border-[#333] text-zinc-400 hover:border-gray-500"
                  }`}
                >
                  <i className="fa-solid fa-motorcycle text-xl mb-2 block"></i>
                  Delivery
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, orderType: 2 }))}
                  className={`flex-1 py-4 rounded-xl font-bold border-2 transition-all ${
                    formData.orderType === 2 
                      ? "bg-red-600/10 border-red-600 text-red-500" 
                      : "bg-[#222] border-[#333] text-zinc-400 hover:border-gray-500"
                  }`}
                >
                  <i className="fa-solid fa-bag-shopping text-xl mb-2 block"></i>
                  Collection
                </button>
              </div>

              {formData.orderType === 2 && (
                <div>
                  <label className="block text-sm font-bold text-zinc-400 mb-2">Select Pickup Branch *</label>
                  <select
                    name="branchId"
                    value={formData.branchId}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-[#222] text-white border border-[#333] focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-shadow"
                  >
                    {branches.length > 0 ? (
                      branches.map(br => (
                        <option key={br.id} value={br.id}>{br.name} - {br.address || br.phone}</option>
                      ))
                    ) : (
                      <option value="">No branches available</option>
                    )}
                  </select>
                </div>
              )}
            </div>

            {/* Contact Details */}
            <div className="bg-[#111] border border-[#222] rounded-2xl shadow-sm p-6 md:p-8">
              <h3 className="font-bold text-xl mb-6 text-white border-b border-[#333] pb-4">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-zinc-400 mb-2">First Name *</label>
                  <input 
                    type="text" 
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg bg-[#222] text-white border border-[#333] focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-shadow placeholder-zinc-500" 
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-zinc-400 mb-2">Last Name *</label>
                  <input 
                    type="text" 
                    name="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg bg-[#222] text-white border border-[#333] focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-shadow placeholder-zinc-500" 
                    placeholder="Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-zinc-400 mb-2">Email Address *</label>
                  <input 
                    type="email" 
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg bg-[#222] text-white border border-[#333] focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-shadow placeholder-zinc-500" 
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-zinc-400 mb-2">Phone Number *</label>
                  <input 
                    type="tel" 
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg bg-[#222] text-white border border-[#333] focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-shadow placeholder-zinc-500" 
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>
            </div>

            {/* Delivery Address - Only show if Delivery is selected */}
            {formData.orderType === 1 && (
              <div className="bg-[#111] border border-[#222] rounded-2xl shadow-sm p-6 md:p-8">
                <h3 className="font-bold text-xl mb-6 text-white border-b border-[#333] pb-4">Delivery Address</h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-zinc-400 mb-2">Street Address *</label>
                    <Autocomplete
                      apiKey="YOUR_GOOGLE_MAPS_API_KEY_HERE"
                      onPlaceSelected={(place) => {
                        let zipCode = formData.zipCode;
                        let city = formData.city;
                        if (place.address_components) {
                          const zipComponent = place.address_components.find(c => c.types.includes("postal_code"));
                          if (zipComponent) zipCode = zipComponent.long_name;
                          const cityComponent = place.address_components.find(c => c.types.includes("locality"));
                          if (cityComponent) city = cityComponent.long_name;
                        }
                        setFormData(prev => ({
                          ...prev,
                          address: place.formatted_address || place.name,
                          zipCode,
                          city
                        }));
                      }}
                      options={{
                        types: ["geocode", "establishment"],
                      }}
                      defaultValue={formData.address}
                      onChange={(e) => handleInputChange({ target: { name: 'address', value: e.target.value } })}
                      className="w-full px-4 py-3 rounded-lg bg-[#222] text-white border border-[#333] focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-shadow placeholder-zinc-500"
                      placeholder="Start typing to search address..."
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-zinc-400 mb-2">City *</label>
                      <input 
                        type="text" 
                        name="city"
                        required
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg bg-[#222] text-white border border-[#333] focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-shadow placeholder-zinc-500" 
                        placeholder="New York"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-zinc-400 mb-2">ZIP / Postal Code *</label>
                      <input 
                        type="text" 
                        name="zipCode"
                        required
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg bg-[#222] text-white border border-[#333] focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-shadow placeholder-zinc-500" 
                        placeholder="10001"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Special Instructions */}
            <div className="bg-[#111] border border-[#222] rounded-2xl shadow-sm p-6 md:p-8">
              <h3 className="font-bold text-xl mb-6 text-white border-b border-[#333] pb-4">Special Instructions</h3>
              <div>
                  <label className="block text-sm font-bold text-zinc-400 mb-2">Special Instructions / Brief (Optional)</label>
                  <textarea 
                    name="orderNotes"
                    rows="3"
                    value={formData.orderNotes}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg bg-[#222] text-white border border-[#333] focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-shadow resize-none placeholder-zinc-500" 
                    placeholder="E.g. Less spicy, extra sauce, or any special delivery brief."
                  ></textarea>
                </div>
              </div>

            {/* Payment Method */}
            <div className="bg-[#111] border border-[#222] rounded-2xl shadow-sm p-6 md:p-8">
              <h3 className="font-bold text-xl mb-6 text-white border-b border-[#333] pb-4">Payment Method</h3>
              <div>
                <label className="block text-sm font-bold text-zinc-400 mb-2">Select Payment Method *</label>
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-[#222] text-white border border-[#333] focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-shadow appearance-none"
                >
                  {paymentGateways.length > 0 ? (
                    paymentGateways.map(gateway => (
                      <option key={gateway.id} value={gateway.payment_name}>
                        {gateway.payment_name}
                      </option>
                    ))
                  ) : (
                    <option value="">No payment methods available</option>
                  )}
                </select>
                {/* Visual indicators for selected method */}
                {formData.paymentMethod && (
                  <div className="mt-4 p-4 border border-[#333] rounded-xl flex items-center justify-between bg-[#1a1a1a]">
                    <span className="font-bold text-white">{formData.paymentMethod}</span>
                    <div className="flex gap-2">
                      {formData.paymentMethod === 'Stripe' && (
                        <>
                          <i className="fa-brands fa-cc-visa text-3xl text-blue-800"></i>
                          <i className="fa-brands fa-cc-mastercard text-3xl text-orange-600"></i>
                        </>
                      )}
                      {formData.paymentMethod === 'Paypal' && <i className="fa-brands fa-paypal text-3xl text-blue-400"></i>}
                      {formData.paymentMethod.toLowerCase().includes('cash') && <i className="fa-solid fa-money-bill-wave text-3xl text-green-600"></i>}
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Order Summary Sidebar */}
          <div className="w-full lg:w-1/3">
            <div className="bg-[#111] border border-[#222] rounded-2xl shadow-sm p-6 sticky top-24 border-t-4 border-t-red-600">
              <h3 className="font-bold text-xl mb-6 text-white border-b border-[#333] pb-4">Your Order</h3>
              
              {/* Items List */}
              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <div className="flex gap-2">
                      <span className="font-bold text-white">{item.quantity}x</span>
                      <span className="text-zinc-400">{item.name}</span>
                    </div>
                    <span className="font-medium text-white">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {/* Promo Code Input */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-zinc-400 mb-2">Promo Code</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={promoCodeInput}
                    onChange={(e) => setPromoCodeInput(e.target.value)}
                    disabled={discountAmount > 0}
                    className="flex-1 px-4 py-3 rounded-lg bg-[#222] text-white border border-[#333] focus:outline-none focus:ring-2 focus:ring-red-500 uppercase placeholder-zinc-500 disabled:opacity-50"
                    placeholder="Enter code"
                  />
                  {discountAmount > 0 ? (
                    <button 
                      type="button"
                      onClick={() => {
                        setPromoCodeInput("");
                        setPromoCode("");
                        setDiscountAmount(0);
                        setPromoSuccess("");
                      }}
                      className="bg-red-900/50 hover:bg-red-800 text-red-500 font-bold px-4 rounded-lg transition-colors"
                    >
                      Remove
                    </button>
                  ) : (
                    <button 
                      type="button"
                      onClick={handleApplyPromo}
                      disabled={validatingPromo || !promoCodeInput.trim() || cartItems.length === 0}
                      className="bg-[#222] hover:bg-[#333] text-white font-bold px-6 rounded-lg transition-colors border border-[#333] disabled:opacity-50"
                    >
                      {validatingPromo ? <i className="fas fa-spinner fa-spin"></i> : "Apply"}
                    </button>
                  )}
                </div>
                {promoError && <p className="text-red-500 text-xs mt-2">{promoError}</p>}
                {promoSuccess && <p className="text-green-500 text-xs mt-2">{promoSuccess} (Applied: ${discountAmount.toFixed(2)})</p>}
              </div>

              {/* Totals */}
              <div className="space-y-3 mb-6 pt-4 border-t border-[#333] text-sm text-zinc-400">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-white">${subtotal.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-green-500">
                    <span>Discount ({promoCode})</span>
                    <span className="font-bold">-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Tax (8%)</span>
                  <span className="font-medium text-white">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span className="font-medium text-white">${deliveryFee.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="border-t border-[#333] pt-4 mb-8">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-lg text-white">Total</span>
                  <span className="font-bold text-2xl text-red-500">${total.toFixed(2)}</span>
                </div>
              </div>

              <button 
                type="submit"
                className="w-full block text-center bg-[#2a2a2a] text-white font-bold py-4 rounded-lg hover:bg-red-600 transition-colors shadow-lg"
              >
                Place Order <i className="fa-solid fa-check ml-2"></i>
              </button>
              
              <p className="text-xs text-center text-zinc-400 mt-4">
                By placing your order, you agree to our <Link href="/terms-conditions" className="underline hover:text-red-600">Terms & Conditions</Link> and <Link href="/privacy-policy" className="underline hover:text-red-600">Privacy Policy</Link>.
              </p>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}
