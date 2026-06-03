"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Autocomplete from "react-google-autocomplete";

export default function PosPage() {
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState([]);
  const [customer, setCustomer] = useState(null);
  const [discount, setDiscount] = useState({ type: "fixed", value: 0 });
  const [heldCartsCount, setHeldCartsCount] = useState(0);
  const [todayStats, setTodayStats] = useState({ sales: 0, revenue: 0.0 });
  
  // Modals state
  const [activeModal, setActiveModal] = useState(null); // 'payment' | 'discount' | 'customer' | 'held-carts' | 'variation'
  const [selectedItemDetails, setSelectedItemDetails] = useState(null);
  const [selectedVariation, setSelectedVariation] = useState(null);
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [selectedExtras, setSelectedExtras] = useState([]);
  
  // Customers list
  const [customers, setCustomers] = useState([]);
  const [customerSearch, setCustomerSearch] = useState("");
  
  // Held Carts
  const [heldCarts, setHeldCarts] = useState([]);
  const [loadingHeld, setLoadingHeld] = useState(false);
  
  // Payment
  const [paymentMethod, setPaymentMethod] = useState(1); // 1 = Cash, 2 = Card, 3 = Mobile, 4 = Wallet, 5 = Split
  const [amountReceived, setAmountReceived] = useState("");
  const [splitCash, setSplitCash] = useState("");
  const [splitCard, setSplitCard] = useState("");
  const [paymentNotes, setPaymentNotes] = useState("");
  
  // Success state
  const [successOrder, setSuccessOrder] = useState(null);
  
  // Order Type state
  const [orderType, setOrderType] = useState(2); // 1 = Delivery, 2 = Takeaway/Collection, 3 = Dine-in
  const [deliveryDetails, setDeliveryDetails] = useState({ phone: "", address: "", postal_code: "", driver_id: "" });
  const [drivers, setDrivers] = useState([]);
  
  // Orders Tab State
  const [orders, setOrders] = useState([]);
  const [ordersDate, setOrdersDate] = useState(new Date().toISOString().split("T")[0]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [ordersTotal, setOrdersTotal] = useState(0);

  useEffect(() => {
    if (activeModal === "payment" && orderType === 1 && drivers.length === 0) {
      fetch("/api/admin/driver-accounts").then(r => r.json()).then(data => setDrivers(data || []));
    }
  }, [activeModal, orderType, drivers.length]);

  const handleLocationLookup = async () => {
    if (!deliveryDetails.postal_code) return;
    try {
      const res = await fetch(`/api/pos/location-lookup?postcode=${deliveryDetails.postal_code}`);
      const data = await res.json();
      if (data.success) {
        setDeliveryDetails(prev => ({ ...prev, address: data.address }));
      } else {
        alert(data.error || "Location not found");
      }
    } catch(err) { alert("Lookup failed"); }
  };

  const fetchOrders = async (date) => {
    setLoadingOrders(true);
    try {
      const res = await fetch(`/api/pos/orders?startDate=${date}&endDate=${date}`);
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders);
        setOrdersTotal(data.totalSales);
      }
    } catch(err) {}
    setLoadingOrders(false);
  };
  
  useEffect(() => {
    if (activeModal === "orders") {
      fetchOrders(ordersDate);
    }
  }, [activeModal, ordersDate]);


  // Till State
  const [till, setTill] = useState({ is_open: true, opening_balance: 0, current_cash: 0, cash_sales: 0, card_sales: 0, id: null });
  const [theme, setTheme] = useState("dark");
  const [loadingAddProduct, setLoadingAddProduct] = useState(false);
  const [loadingAddCategory, setLoadingAddCategory] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: "", image: null });
  const [newProduct, setNewProduct] = useState({ id: null, name: "", price: "", category_id: "", description: "", image: null });
  const [editingProduct, setEditingProduct] = useState(false);

  const searchInputRef = useRef(null);

  // Auth State
  const [posPin, setPosPin] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinError, setPinError] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [staffName, setStaffName] = useState("");

  useEffect(() => {
    // Check localStorage for POS PIN auth session
    const authed = localStorage.getItem("pos_authenticated");
    const name = localStorage.getItem("pos_staff_name");
    if (authed === "true") {
      setIsAuthenticated(true);
      setStaffName(name || "Staff");
    }
  }, []);

  const handlePinSubmit = async () => {
    if(posPin.length !== 4) return;
    setIsAuthenticating(true);
    setPinError("");
    try {
      const res = await fetch("/api/pos/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin: posPin })
      });
      const data = await res.json();
      if(data.status === 1) {
        setIsAuthenticated(true);
        setStaffName(data.user.name);
        localStorage.setItem("pos_authenticated", "true");
        localStorage.setItem("pos_staff_name", data.user.name);
      } else {
        setPinError(data.error || "Incorrect PIN");
        setPosPin("");
      }
    } catch(err) {
      setPinError("Connection Error");
      setPosPin("");
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPosPin("");
    localStorage.removeItem("pos_authenticated");
    localStorage.removeItem("pos_staff_name");
  };

  // Load initial data
  useEffect(() => {
    fetchCategories();
    fetchItems();
    fetchTodaySummary();
    fetchTillStatus();
    
    // Date/Time Clock
    const timer = setInterval(() => {
      updateClock();
    }, 1000);
    updateClock();

    // Hotkeys handler
    const handleKeyDown = (e) => {
      if (e.key === "F1") {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if (e.key === "F2") {
        e.preventDefault();
        handleHoldCart();
      } else if (e.key === "F3") {
        e.preventDefault();
        openHeldCartsModal();
      } else if (e.key === "F5") {
        e.preventDefault();
        openPaymentModal();
      } else if (e.key === "F8") {
        e.preventDefault();
        clearCart();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      clearInterval(timer);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Filter items when search query or category changes
  useEffect(() => {
    let result = items;
    if (selectedCategory !== "all") {
      result = result.filter((item) => item.cat_id.toString() === selectedCategory.toString());
    }
    if (searchQuery) {
      result = result.filter(
        (item) =>
          item.item_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.slug.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setFilteredItems(result);
  }, [selectedCategory, searchQuery, items]);

  const updateClock = () => {
    const now = new Date();
    const dateEl = document.getElementById("current-date");
    const timeEl = document.getElementById("current-time");
    if (dateEl) dateEl.innerText = now.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
    if (timeEl) timeEl.innerText = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  };

  // Barcode Scanner Integration
  useEffect(() => {
    let barcodeStr = "";
    let lastKeyTime = Date.now();

    const handleScanner = (e) => {
      // Don't intercept if user is typing in an input/textarea
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;

      const char = e.key;
      const currentTime = Date.now();

      // Physical barcode scanners send keystrokes extremely fast (< 30ms between strokes)
      if (currentTime - lastKeyTime > 30) {
        barcodeStr = "";
      }
      lastKeyTime = currentTime;

      if (char === "Shift" || char === "Control" || char === "Alt" || char === "Meta") return;

      if (char === "Enter" && barcodeStr.length >= 3) {
        e.preventDefault();
        const scannedItem = items.find(
          (item) => item.sku === barcodeStr || item.id.toString() === barcodeStr
        );
        if (scannedItem) {
          addToCart(scannedItem);
          toast.success(`Scanned: ${scannedItem.item_name}`);
        } else {
          toast.error(`Item not found for barcode: ${barcodeStr}`);
        }
        barcodeStr = "";
      } else if (char.length === 1) {
        barcodeStr += char;
      }
    };

    window.addEventListener("keydown", handleScanner);
    return () => window.removeEventListener("keydown", handleScanner);
  }, [items, cart]); // Re-bind when items or cart changes so addToCart gets latest state


  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/pos/categories");
      const data = await res.json();
      if (data.status === 1) setCategories(data.categories);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchItems = async () => {
    try {
      const res = await fetch("/api/pos/items");
      const data = await res.json();
      if (data.status === 1) setItems(data.items);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTodaySummary = async () => {
    try {
      const res = await fetch("/api/pos/today-summary");
      const data = await res.json();
      if (data.status === 1) {
        setTodayStats({
          sales: data.total_sales,
          revenue: parseFloat(data.total_revenue),
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTillStatus = async () => {
    try {
      const res = await fetch("/api/pos/till");
      const data = await res.json();
      if (data.status === 1) {
        if (data.is_open) {
          setTill({ is_open: true, ...data.till });
        } else {
          setTill({ is_open: false, opening_balance: 0, current_cash: 0, cash_sales: 0, card_sales: 0, id: null });
          setActiveModal("open-till");
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenTill = async () => {
    const amount = tillInputAmount === "" ? 0 : parseFloat(tillInputAmount);
    if (isNaN(amount) || amount < 0) return alert("Enter valid opening balance");
    try {
      const res = await fetch("/api/pos/till", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ opening_balance: amount })
      });
      const data = await res.json();
      if (data.status === 1) {
        setTill({ is_open: true, ...data.till, current_cash: data.till.opening_balance });
        setActiveModal(null);
        setTillInputAmount("");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCloseTill = async () => {
    try {
      const res = await fetch("/api/pos/till", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          id: till.id, 
          closing_balance: tillInputAmount ? parseFloat(tillInputAmount) : till.current_cash,
          cash_sales: till.cash_sales,
          card_sales: till.card_sales
        })
      });
      const data = await res.json();
      if (data.status === 1) {
        setTill({ is_open: false, opening_balance: 0, current_cash: 0, cash_sales: 0, card_sales: 0, id: null });
        setTillInputAmount("");
        setActiveModal("open-till"); // Force to open new till
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Cart operations
  const addToCart = async (item) => {
    // If item has variations or extras, we must open variation modal first
    try {
      const res = await fetch(`/api/pos/item-details?item_id=${item.id}`);
      const data = await res.json();
      
      if (data.status === 1) {
        if (data.variations.length > 0 || data.addons.length > 0 || data.extras.length > 0) {
          setSelectedItemDetails(data);
          setSelectedVariation(data.variations[0] || null);
          setSelectedAddons([]);
          setSelectedExtras([]);
          setActiveModal("variation");
        } else {
          // Plain item without options
          addItemToCartState(item, null, [], []);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const addItemToCartState = (item, variation, addons, extras) => {
    const cartItemId = `${item.id}-${variation ? variation.id : "none"}-${addons
      .map((a) => a.id)
      .sort()
      .join(",")}-${extras.map((e) => e.id).sort().join(",")}`;

    const existingIndex = cart.findIndex((i) => i.cartItemId === cartItemId);

    let price = variation ? parseFloat(variation.price) : parseFloat(item.price);
    const addonsTotal = addons.reduce((sum, a) => sum + parseFloat(a.price), 0);
    const extrasTotal = extras.reduce((sum, e) => sum + parseFloat(e.price), 0);
    const singleItemTotal = price + addonsTotal + extrasTotal;

    if (existingIndex > -1) {
      const updated = [...cart];
      updated[existingIndex].quantity += 1;
      updated[existingIndex].totalPrice = updated[existingIndex].quantity * singleItemTotal;
      setCart(updated);
    } else {
      setCart([
        ...cart,
        {
          cartItemId,
          id: item.id,
          name: item.item_name,
          image: item.image,
          price: price,
          quantity: 1,
          variation_id: variation ? variation.id : null,
          variation_name: variation ? variation.name : "",
          addons_name: addons.map((a) => a.name).join(", "),
          addons_price: addons.map((a) => a.price).join(", "),
          addons_total: addonsTotal,
          extras_name: extras.map((e) => e.name).join(", "),
          extras_price: extras.map((e) => e.price).join(", "),
          extras_total: extrasTotal,
          singleItemTotal,
          totalPrice: singleItemTotal,
        },
      ]);
    }
    setActiveModal(null);
  };

  const handleApplyVariationModal = () => {
    if (!selectedItemDetails) return;
    addItemToCartState(
      selectedItemDetails.item,
      selectedVariation,
      selectedAddons,
      selectedExtras
    );
  };

  const updateQuantity = (cartItemId, newQty) => {
    if (newQty <= 0) {
      setCart(cart.filter((i) => i.cartItemId !== cartItemId));
      return;
    }
    setCart(
      cart.map((item) =>
        item.cartItemId === cartItemId
          ? { ...item, quantity: newQty, totalPrice: newQty * item.singleItemTotal }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    setDiscount({ type: "fixed", value: 0 });
    setCustomer(null);
  };

  // Cart Calculations
  const subtotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);
  const tax = subtotal * 0.05; // 5% tax flat example
  
  let discountAmount = 0;
  if (discount.type === "fixed") {
    discountAmount = discount.value;
  } else {
    discountAmount = subtotal * (discount.value / 100);
  }
  const grandTotal = Math.max(0, subtotal + tax - discountAmount);

  // Hold Cart
  const handleHoldCart = async () => {
    if (cart.length === 0) return alert("Cart is empty");
    try {
      const res = await fetch("/api/pos/hold-cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart,
          customer_id: customer ? customer.id : null,
          subtotal,
          tax_amount: tax,
          discount_amount: discountAmount,
          grand_total: grandTotal,
          notes: "",
        }),
      });
      const data = await res.json();
      if (data.status === 1) {
        setHeldCartsCount(data.held_count);
        clearCart();
        alert("Cart held successfully!");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Recall Carts
  const openHeldCartsModal = async () => {
    setActiveModal("held-carts");
    setLoadingHeld(true);
    try {
      const res = await fetch("/api/pos/held-carts");
      const data = await res.json();
      if (data.status === 1) setHeldCarts(data.carts);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingHeld(false);
    }
  };

  const recallHeldCart = async (heldCart) => {
    setCart(heldCart.items);
    setCustomer(heldCart.customer_id ? { id: heldCart.customer_id, name: "Customer" } : null);
    setDiscount({ type: "fixed", value: parseFloat(heldCart.discount_amount) });
    // Remove held cart from DB
    await deleteHeldCart(heldCart.id);
    setActiveModal(null);
  };

  const deleteHeldCart = async (id) => {
    try {
      const res = await fetch(`/api/pos/held-carts/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.status === 1) {
        setHeldCartsCount(data.held_count);
        setHeldCarts(heldCarts.filter((c) => c.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Customers Search
  useEffect(() => {
    if (activeModal === "customer") {
      fetchCustomers();
    }
  }, [customerSearch, activeModal]);

  const fetchCustomers = async () => {
    try {
      const res = await fetch(`/api/pos/customers?query=${customerSearch}`);
      const data = await res.json();
      if (data.status === 1) setCustomers(data.customers);
    } catch (err) {
      console.error(err);
    }
  };

  const selectCustomer = (cust) => {
    setCustomer(cust);
    setActiveModal(null);
  };

  // Payment Modal
  const openPaymentModal = () => {
    if (cart.length === 0) return alert("Cart is empty");
    setAmountReceived(grandTotal.toFixed(2));
    setPaymentNotes("");
    setActiveModal("payment");
  };

  const handleConfirmPayment = async () => {
    if (paymentMethod === 1 && parseFloat(amountReceived || 0) < grandTotal) {
      return alert("Amount received is less than grand total!");
    }
    
    if (paymentMethod === 5) {
      const cashVal = parseFloat(splitCash || 0);
      const cardVal = parseFloat(splitCard || 0);
      if (cashVal + cardVal < grandTotal) {
        return alert("Total split amount is less than grand total!");
      }
    }

    try {
      const res = await fetch("/api/pos/process-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart,
          customer_id: customer ? customer.id : null,
          customer_name: customer ? customer.name : "Walk-in Customer",
          customer_phone: deliveryDetails.phone || null,
          customer_address: deliveryDetails.address || null,
          customer_postal_code: deliveryDetails.postal_code || null,
          driver_id: deliveryDetails.driver_id || null,
          payment_method: paymentMethod,
          split_cash: paymentMethod === 5 ? parseFloat(splitCash || 0) : 0,
          split_card: paymentMethod === 5 ? parseFloat(splitCard || 0) : 0,
          tax_amount: tax,
          discount_amount: discountAmount,
          grand_total: grandTotal,
          notes: paymentNotes,
          order_type: orderType, // Pass orderType to API
        }),
      });
      const data = await res.json();
      if (data.status === 1) {
        setSuccessOrder({
          order_id: data.order_id,
          order_number: data.order_number,
        });
        fetchTodaySummary();
        clearCart();
        setActiveModal(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center font-sans text-white select-none">
        <div className="bg-[#111] p-8 rounded-3xl border border-[#222] shadow-[0_0_50px_rgba(0,0,0,0.5)] max-w-sm w-full text-center animate-[fadeInUp_0.5s_ease-out]">
          <div className="w-16 h-16 bg-[#00e676]/10 text-[#00e676] rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
            <i className="fas fa-lock"></i>
          </div>
          <h1 className="text-3xl font-extrabold text-white mb-2">POS Terminal</h1>
          <p className="text-gray-400 text-sm mb-8">Enter your 4-digit PIN to unlock</p>
          
          <div className="flex justify-center gap-4 mb-8">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl font-bold border-2 transition-all duration-300 ${posPin.length > i ? 'border-[#00e676] bg-[#00e676]/20 text-[#00e676] shadow-[0_0_15px_rgba(0,230,118,0.3)]' : 'border-[#333] bg-[#0a0a0a]'}`}>
                {posPin.length > i ? '•' : ''}
              </div>
            ))}
          </div>

          {pinError && <p className="text-red-500 text-sm mb-4 font-bold animate-pulse">{pinError}</p>}

          <div className="grid grid-cols-3 gap-3 mb-6">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <button 
                key={num} 
                onClick={() => posPin.length < 4 && setPosPin(prev => prev + num)}
                className="bg-[#1a1a1a] hover:bg-[#2a2a2a] active:scale-95 py-5 rounded-2xl text-2xl font-bold transition-all"
              >
                {num}
              </button>
            ))}
            <button onClick={() => setPosPin("")} className="bg-red-950/20 text-red-500 hover:bg-red-950/40 active:scale-95 py-5 rounded-2xl text-xs font-bold transition-all tracking-wider">CLEAR</button>
            <button onClick={() => posPin.length < 4 && setPosPin(prev => prev + "0")} className="bg-[#1a1a1a] hover:bg-[#2a2a2a] active:scale-95 py-5 rounded-2xl text-2xl font-bold transition-all">0</button>
            <button onClick={() => setPosPin(prev => prev.slice(0, -1))} className="bg-[#1a1a1a] hover:bg-[#2a2a2a] active:scale-95 py-5 rounded-2xl text-lg font-bold transition-all text-gray-400"><i className="fas fa-backspace"></i></button>
          </div>

          <button 
            onClick={handlePinSubmit}
            disabled={posPin.length !== 4 || isAuthenticating}
            className="w-full bg-[#00e676] text-[#0d0d0d] font-extrabold py-5 rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#00c853] hover:shadow-[0_0_20px_rgba(0,230,118,0.4)] transition-all tracking-wide text-lg"
          >
            {isAuthenticating ? (
              <span className="flex items-center justify-center gap-2">
                <i className="fas fa-circle-notch fa-spin"></i> Verifying...
              </span>
            ) : "UNLOCK TERMINAL"}
          </button>
        </div>
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        `}} />
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#0d0d0d] text-white' : 'bg-[#f4f4f4] text-black'} flex flex-col font-sans select-none transition-colors duration-300`}>
      {/* ========== HEADER ========== */}
      <header className="h-16 border-b border-[#222222] bg-[#c60000] flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <i className="fas fa-bars text-white text-xl cursor-pointer"></i>
            <span className="text-2xl font-extrabold tracking-tight text-white">foodefy</span>
          </div>
          
          <div className="hidden lg:flex items-center gap-2 pl-4">
            <button 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="bg-black/20 hover:bg-black/40 text-white px-3 py-1.5 rounded text-sm font-bold flex items-center gap-2"
            >
              <i className={`fas ${theme === 'dark' ? 'fa-sun' : 'fa-moon'}`}></i>
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </button>
          </div>
            <Link href="/admin/pos/tables" className="bg-[#1e293b] text-white hover:bg-blue-600 px-4 py-2 rounded font-bold text-xs transition-all shadow-md flex items-center gap-2">
              <i className="fa-solid fa-chair"></i> Tables
            </Link>
            <button 
              onClick={() => { setOrderType(3); setCustomer(null); }} 
              className={`text-white px-4 py-2 rounded font-bold text-xs transition-all shadow-md ${orderType === 3 ? "bg-[#00a33a]" : "bg-gray-600 hover:bg-gray-500"}`}
            >
              Walk In (Dine-in)
            </button>
            <button 
              onClick={() => setOrderType(2)} 
              className={`text-white px-4 py-2 rounded font-bold text-xs transition-all shadow-md ${orderType === 2 ? "bg-[#00a33a]" : "bg-gray-600 hover:bg-gray-500"}`}
            >
              Takeaway
            </button>
            <button 
              onClick={() => setOrderType(1)} 
              className={`text-white px-4 py-2 rounded font-bold text-xs transition-all shadow-md ${orderType === 1 ? "bg-[#00a33a]" : "bg-gray-600 hover:bg-gray-500"}`}
            >
              Delivery
            </button>
            <Link href="/admin/orders" className="bg-white text-black hover:bg-gray-100 px-4 py-2 rounded font-bold text-xs transition-all shadow-md">
              Today Sales: ${todayStats.revenue.toFixed(2)}
            </Link>
            <button 
              onClick={() => {
                if (till.is_open) {
                  fetchTillStatus().then(() => setActiveModal("close-till"));
                } else {
                  setActiveModal("open-till");
                }
              }} 
              className={`text-white px-4 py-2 rounded font-bold text-xs transition-all shadow-md flex items-center gap-2 ${till.is_open ? 'bg-red-600 hover:bg-red-700' : 'bg-emerald-600 hover:bg-emerald-700'}`}
            >
              <i className="fas fa-cash-register"></i> {till.is_open ? "Close Till" : "Open Till"}
            </button>
          </div>

        <div className="flex items-center gap-3">
          <Link href="/admin/orders" className="w-8 h-8 rounded-full bg-[#756f14] text-white flex items-center justify-center font-bold hover:bg-[#857d17]">
            <i className="fas fa-shopping-bag text-sm"></i>
          </Link>
          <button onClick={() => setActiveModal("customer")} className="w-8 h-8 rounded-full bg-[#117a3a] text-white flex items-center justify-center font-bold hover:bg-[#148e43]" title="Select Customer">
            <i className="fas fa-phone text-sm"></i>
          </button>
          <Link href="/admin/print-labels" className="w-8 h-8 rounded-full bg-[#3b82f6] text-white flex items-center justify-center font-bold hover:bg-[#2563eb]" title="Print Labels">
            <i className="fas fa-tags text-sm"></i>
          </Link>
          <button onClick={() => window.print()} className="w-8 h-8 rounded-full bg-[#756f14] text-white flex items-center justify-center font-bold hover:bg-[#857d17]" title="Print Screen">
            <i className="fas fa-print text-sm"></i>
          </button>
          <Link href="/admin/kds" target="_blank" className="bg-[#ff9100] text-black px-4 py-1.5 rounded-full font-bold text-xs flex items-center gap-2 hover:bg-[#e68200] transition-colors shadow-md" title="Open Kitchen Display System">
            <i className="fas fa-fire-burner"></i> KDS
          </Link>
          <button onClick={() => window.location.reload()} className="bg-white text-black px-4 py-1.5 rounded-full font-bold text-xs flex items-center gap-2 hover:bg-gray-100">
            <i className="fas fa-sync-alt"></i> Refresh
          </button>
          
          <div className="h-8 border-l border-white/20 mx-1"></div>
          
          <div className="flex items-center gap-2 mr-2 bg-black/30 px-3 py-1.5 rounded-full">
            <i className="fas fa-user-circle text-gray-300"></i>
            <span className="text-xs font-bold">{staffName}</span>
          </div>

          <button onClick={handleLogout} className="w-8 h-8 flex items-center justify-center text-red-400 hover:text-red-300 bg-red-950/40 hover:bg-red-900/60 rounded-full transition-all" title="Lock POS">
            <i className="fas fa-lock text-sm"></i>
          </button>
          <Link href="/admin/home" className="w-8 h-8 flex items-center justify-center text-white hover:text-gray-200" title="Exit POS">
            <i className="fas fa-power-off text-lg"></i>
          </Link>
        </div>
      </header>

      {/* ========== MAIN POS BODY ========== */}
      <main className="flex-1 flex overflow-hidden bg-[#2a2a2c]">
        {/* CATEGORIES SIDEBAR (LEFT) */}
        <aside className="w-64 flex flex-col bg-[#2e2e30] overflow-y-auto scrollbar-thin border-r border-black/20 p-2">
          {/* Search bar */}
          <div className="relative mb-2">
            <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs"></i>
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="w-full pl-8 pr-3 py-2.5 bg-white rounded text-black placeholder-gray-500 focus:outline-none text-sm font-bold"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-1.5 pb-2">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`py-6 px-1 rounded font-bold text-xs transition-all uppercase text-center shadow-md ${
                selectedCategory === "all" ? "bg-white text-black ring-4 ring-black/10" : "bg-gray-800 text-white hover:bg-gray-700"
              }`}
            >
              All Items
            </button>
            <button
              onClick={() => setActiveModal("add-category")}
              className="py-6 px-1 rounded font-bold text-[11px] transition-all uppercase text-center shadow-md bg-transparent border-2 border-dashed border-gray-500 text-gray-400 hover:text-white hover:border-white flex flex-col items-center justify-center gap-1"
            >
              <i className="fas fa-plus text-lg"></i>
              Add Category
            </button>
            {categories.map((cat, index) => {
              // Exact color sequence from user's image
              const colors = [
                "bg-[#ff1b11] text-white hover:bg-[#d5130b]", // Red
                "bg-[#e52814] text-white hover:bg-[#cc220f]", // Dark Red
                "bg-[#d91f1b] text-white hover:bg-[#c21915]", // Darker Red
                "bg-[#e31a10] text-white hover:bg-[#c2140b]", // Darker Red
                "bg-[#f9af1b] text-black hover:bg-[#e89e13]", // Orange/Yellow
                "bg-[#f0ac11] text-black hover:bg-[#d6980e]", // Orange/Yellow
                "bg-[#f6b31a] text-black hover:bg-[#e6a310]", // Orange/Yellow
                "bg-[#f2b90c] text-black hover:bg-[#d9a408]", // Orange/Yellow
                "bg-[#49cffc] text-black hover:bg-[#32bcf0]", // Light Blue
                "bg-[#46c6ed] text-black hover:bg-[#34bce6]", // Light Blue
                "bg-[#4fd5fc] text-black hover:bg-[#37c4f0]", // Light Blue
                "bg-[#ea2d38] text-white hover:bg-[#d6242e]", // Redish
                "bg-[#4eddfd] text-black hover:bg-[#37cbf0]", // Light Blue
                "bg-[#e71780] text-white hover:bg-[#c9126d]", // Pink/Magenta
                "bg-[#4035da] text-white hover:bg-[#3126c2]", // Deep Blue
              ];
              const colorClass = colors[index % colors.length];
              return (
                <div key={cat.id} className="relative group">
                  <button
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`w-full py-6 px-1 rounded font-bold text-[11px] transition-all uppercase text-center shadow-md ${colorClass} ${
                      selectedCategory === cat.id ? "ring-2 ring-white scale-[0.98]" : ""
                    }`}
                  >
                    {cat.category_name}
                  </button>
                  <button 
                    onClick={async (e) => {
                      e.stopPropagation();
                      if(!confirm("Are you sure you want to delete this category?")) return;
                      try {
                        const res = await fetch(`/api/admin2/categories/${cat.id}`, { method: 'DELETE' });
                        if(res.ok) {
                          fetchCategories();
                          if(selectedCategory === cat.id) setSelectedCategory("all");
                        }
                      } catch(err) { console.error(err); }
                    }}
                    className="absolute -top-2 -right-2 z-10 bg-black hover:bg-red-600 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                  >
                    <i className="fas fa-times text-xs"></i>
                  </button>
                </div>
              );
            })}
          </div>
        </aside>

        {/* PRODUCTS SIDE (CENTER) */}
        <section className="flex-1 flex flex-col p-4 overflow-hidden">

          {/* Grid list of products */}
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              <button
                onClick={() => setActiveModal("add-product")}
                className="bg-[#111] border-2 border-dashed border-gray-600 rounded-xl flex flex-col items-center justify-center text-gray-400 hover:text-white hover:border-white transition-all aspect-square gap-2"
              >
                <i className="fas fa-plus text-3xl"></i>
                <span className="font-bold text-sm">Add Product</span>
              </button>
              {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => addToCart(item)}
                className="bg-[#111111] border border-[#222222] hover:border-[#00e676]/50 rounded-xl p-3 flex flex-col cursor-pointer hover:shadow-lg hover:shadow-[#00e676]/5 transition-all group h-fit relative"
              >
                <div className="absolute top-2 right-2 z-20 flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                  <button 
                    onClick={async (e) => {
                      e.stopPropagation();
                      setEditingProduct(true);
                      setNewProduct({
                        id: item.id,
                        name: item.item_name,
                        price: item.price,
                        category_id: item.cat_id,
                        description: item.item_description || "",
                        image: null
                      });
                      setActiveModal("add-product");
                    }}
                    className="bg-blue-600/90 hover:bg-blue-500 text-white w-7 h-7 flex items-center justify-center rounded-full shadow-md"
                  >
                    <i className="fas fa-pencil-alt text-xs"></i>
                  </button>
                  <button 
                    onClick={async (e) => {
                      e.stopPropagation();
                      if(!confirm("Are you sure you want to delete this product?")) return;
                      try {
                        const res = await fetch(`/api/admin/products/${item.id}`, { method: 'DELETE' });
                        if(res.ok) fetchItems();
                      } catch(err) { console.error(err); }
                    }}
                    className="bg-black/70 hover:bg-red-600 text-white w-7 h-7 flex items-center justify-center rounded-full shadow-md"
                  >
                    <i className="fas fa-trash-alt text-xs"></i>
                  </button>
                </div>
                <div className="h-48 bg-[#1a1a1a] rounded-lg overflow-hidden relative mb-3">
                  {item.image ? (
                    <img
                      src={`/storage/app/public/admin-assets/images/item/${item.image}`}
                      alt={item.item_name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-600">
                      <i className="fas fa-utensils text-2xl"></i>
                    </div>
                  )}
                  {item.item_type === 1 && (
                    <span className="absolute top-2 right-2 bg-green-950/80 border border-green-500 text-green-400 w-6 h-6 rounded-full flex items-center justify-center text-[10px]" title="Veg">
                      <i className="fas fa-leaf"></i>
                    </span>
                  )}
                  {item.item_type === 2 && (
                    <span className="absolute top-2 right-2 bg-red-950/80 border border-red-500 text-red-400 w-6 h-6 rounded-full flex items-center justify-center text-[10px]" title="Non-Veg">
                      <i className="fas fa-drumstick-bite"></i>
                    </span>
                  )}
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <h4 className="font-semibold text-sm line-clamp-2 text-gray-200 group-hover:text-white transition-all">
                    {item.item_name}
                  </h4>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#1c1c1c]">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">
                        {item.category_name} 
                        {item.subcategory_name && <span className="text-[#00e676]"> • {item.subcategory_name}</span>}
                      </span>
                      <span className="text-[10px] text-gray-400 mt-0.5"><i className="fas fa-boxes"></i> Stock: {item.qty}</span>
                    </div>
                    <span className="text-lg font-bold text-[#00e676]">${item.price.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
            {filteredItems.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center text-gray-500 py-20">
                <i className="fas fa-box-open text-4xl mb-3"></i>
                <p>No products found matching filters</p>
              </div>
            )}
            </div>
          </div>
        </section>

        {/* CART / BILLING SIDE (RIGHT) */}
        <section className="w-96 border-l border-[#222222] bg-[#050505] flex flex-col">
          {/* Selected Customer */}
          <div className="p-4 border-b border-[#222222] flex gap-2">
            <button
              onClick={() => setActiveModal("customer")}
              className="flex-1 bg-[#111111] border border-[#222222] hover:border-gray-500 py-2.5 px-4 rounded-xl flex items-center justify-between text-sm transition-all"
            >
              <span className="flex items-center gap-2 font-semibold">
                <i className="fas fa-user-plus text-[#00e676]"></i>
                {customer ? customer.name : "Walk-in Customer"}
              </span>
              <i className="fas fa-chevron-down text-xs text-gray-500"></i>
            </button>
            {customer && (
              <button
                onClick={() => setCustomer(null)}
                className="w-11 h-11 rounded-xl bg-red-950/20 border border-red-950 text-[#ff1744] hover:bg-[#ff1744]/20 flex items-center justify-center transition-all"
                title="Remove Customer"
              >
                <i className="fas fa-times"></i>
              </button>
            )}
          </div>

          {/* Cart list items */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {cart.map((cartItem) => (
              <div key={cartItem.cartItemId} className="bg-[#111] border border-[#222] rounded-xl p-3 flex gap-3 relative group">
                <div className="flex-1">
                  <div className="font-semibold text-xs text-white line-clamp-1">{cartItem.name}</div>
                  {cartItem.variation_name && (
                    <div className="text-[10px] text-gray-400 mt-0.5">Size: {cartItem.variation_name}</div>
                  )}
                  {cartItem.addons_name && (
                    <div className="text-[9px] text-[#00e676] mt-0.5">Addons: {cartItem.addons_name}</div>
                  )}
                  {cartItem.extras_name && (
                    <div className="text-[9px] text-[#ff1744] mt-0.5">Extras: {cartItem.extras_name}</div>
                  )}
                  <div className="text-xs font-bold text-[#00e676] mt-1.5">${cartItem.singleItemTotal.toFixed(2)}</div>
                </div>

                {/* Counter */}
                <div className="flex flex-col justify-between items-end">
                  <span className="text-xs font-bold text-gray-300">${cartItem.totalPrice.toFixed(2)}</span>
                  <div className="flex items-center gap-1 bg-[#1a1a1a] border border-[#333] rounded-lg p-0.5 mt-2">
                    <button
                      onClick={() => updateQuantity(cartItem.cartItemId, cartItem.quantity - 1)}
                      className="w-6 h-6 rounded flex items-center justify-center text-xs hover:bg-[#222] text-gray-400 hover:text-white"
                    >
                      -
                    </button>
                    <span className="w-6 text-center text-xs font-bold">{cartItem.quantity}</span>
                    <button
                      onClick={() => updateQuantity(cartItem.cartItemId, cartItem.quantity + 1)}
                      className="w-6 h-6 rounded flex items-center justify-center text-xs hover:bg-[#222] text-gray-400 hover:text-white"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {cart.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-gray-500 py-32">
                <i className="fas fa-shopping-cart text-3xl mb-2"></i>
                <p className="text-sm font-semibold">Cart is empty</p>
                <span className="text-xs text-gray-600">Select items to build order</span>
              </div>
            )}
          </div>

          {/* Cart Totals */}
          <div className="p-4 border-t border-[#222222] bg-[#080808] space-y-2">
            <div className="flex justify-between text-xs text-gray-400">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs text-gray-400">
              <span>Tax (5%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-xs text-[#ff1744]">
                <span className="flex items-center gap-1">
                  Discount
                  <button onClick={() => setDiscount({ type: "fixed", value: 0 })} className="text-[10px] hover:text-red-400"><i className="fas fa-times-circle"></i></button>
                </span>
                <span>-${discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between items-center text-sm font-bold text-white pt-2 border-t border-[#1c1c1c]">
              <span>Grand Total</span>
              <span className="text-lg text-[#00e676] font-display">${grandTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="p-4 border-t border-[#222222] space-y-2 bg-[#050505]">
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setActiveModal("discount")}
                className="bg-[#111111] border border-[#222] hover:border-gray-500 py-2.5 rounded-lg text-xs font-semibold flex flex-col items-center gap-1 transition-all"
              >
                <i className="fas fa-percent text-gray-400"></i>
                <span>Discount</span>
              </button>
              <button
                onClick={handleHoldCart}
                className="bg-[#111111] border border-[#222] hover:border-gray-500 py-2.5 rounded-lg text-xs font-semibold flex flex-col items-center gap-1 relative transition-all"
              >
                <i className="fas fa-pause-circle text-gray-400"></i>
                <span>Hold</span>
                {heldCartsCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-[#ff1744] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full ring-2 ring-[#050505]">
                    {heldCartsCount}
                  </span>
                )}
              </button>
              <button
                onClick={openHeldCartsModal}
                className="bg-[#111111] border border-[#222] hover:border-gray-500 py-2.5 rounded-lg text-xs font-semibold flex flex-col items-center gap-1 transition-all"
              >
                <i className="fas fa-history text-gray-400"></i>
                <span>Recall</span>
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={clearCart}
                className="bg-[#1a0a0c] border border-[#301014] text-[#ff1744] hover:bg-[#ff1744]/15 py-3 rounded-xl font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2"
              >
                <i className="fas fa-trash-alt"></i> Clear (F8)
              </button>
              <button
                onClick={openPaymentModal}
                className="bg-[#00e676] text-[#0d0d0d] hover:bg-[#00c853] py-3 rounded-xl font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2"
              >
                <i className="fas fa-credit-card"></i> Pay Now (F5)
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* ========== PAYMENT MODAL ========== */}
      {activeModal === "payment" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" onClick={() => setActiveModal(null)}></div>
          <div className="relative bg-[#111111] border border-[#222] rounded-2xl w-full max-w-lg overflow-hidden flex flex-col z-10">
            <div className="p-5 border-b border-[#222] flex items-center justify-between">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <i className="fas fa-credit-card text-[#00e676]"></i> Process Payment
              </h3>
              <button onClick={() => setActiveModal(null)} className="text-gray-400 hover:text-white">
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="p-6 space-y-6 overflow-y-auto max-h-[70vh]">
              {/* Grand Total display */}
              <div className="bg-[#050505] p-5 rounded-xl border border-[#222] text-center">
                <span className="text-xs text-gray-500 uppercase tracking-wider font-bold">Total Amount to Pay</span>
                <h2 className="text-3xl font-bold font-display text-[#00e676] mt-1">${grandTotal.toFixed(2)}</h2>
              </div>

              {/* Delivery / Order Type */}
              <div className="mb-4">
                <p className="text-sm text-gray-400 mb-2 font-semibold">Order Type</p>
                <div className="flex gap-2 mb-3">
                  <button onClick={() => setOrderType(2)} className={`flex-1 py-2 rounded-xl text-sm font-bold border border-[#333] transition-all ${orderType === 2 ? 'bg-[#00e676] text-black border-[#00e676]' : 'bg-[#1a1a1a] text-white hover:bg-[#222]'}`}>Walk-in</button>
                  <button onClick={() => setOrderType(1)} className={`flex-1 py-2 rounded-xl text-sm font-bold border border-[#333] transition-all ${orderType === 1 ? 'bg-[#00e676] text-black border-[#00e676]' : 'bg-[#1a1a1a] text-white hover:bg-[#222]'}`}>Delivery</button>
                </div>
                
                {orderType === 1 && (
                  <div className="bg-[#1a1a1a] p-3 rounded-xl border border-[#333] mb-4 space-y-3">
                    <p className="text-sm font-bold text-[#00e676]"><i className="fas fa-motorcycle mr-1"></i> Delivery Details</p>
                    
                    <div>
                      <label className="text-xs text-gray-400 mb-1 block">Driver</label>
                      <select value={deliveryDetails.driver_id} onChange={e => setDeliveryDetails(p => ({...p, driver_id: e.target.value}))} className="w-full bg-[#0a0a0a] text-white px-3 py-2 rounded-lg border border-[#333] text-sm focus:border-[#00e676] outline-none">
                        <option value="">Select Driver</option>
                        {drivers.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs text-gray-400 mb-1 block">Phone Number</label>
                      <input type="text" value={deliveryDetails.phone} onChange={e => setDeliveryDetails(p => ({...p, phone: e.target.value}))} className="w-full bg-[#0a0a0a] text-white px-3 py-2 rounded-lg border border-[#333] text-sm focus:border-[#00e676] outline-none" placeholder="0300 1234567" />
                    </div>

                    <div className="flex gap-2 items-end">
                      <div className="flex-1">
                        <label className="text-xs text-gray-400 mb-1 block">Postal Code</label>
                        <input type="text" value={deliveryDetails.postal_code} onChange={e => setDeliveryDetails(p => ({...p, postal_code: e.target.value}))} className="w-full bg-[#0a0a0a] text-white px-3 py-2 rounded-lg border border-[#333] text-sm focus:border-[#00e676] outline-none" placeholder="Zip/Postcode" />
                      </div>
                      <button onClick={handleLocationLookup} className="bg-[#333] hover:bg-[#444] text-white px-3 py-2 rounded-lg text-sm font-bold transition-colors">Lookup</button>
                    </div>

                    <div>
                      <label className="text-xs text-gray-400 mb-1 block">Address</label>
                      <Autocomplete
                        apiKey="YOUR_GOOGLE_MAPS_API_KEY_HERE"
                        onPlaceSelected={(place) => {
                          let postal_code = deliveryDetails.postal_code;
                          if (place.address_components) {
                            const zipComponent = place.address_components.find(c => c.types.includes("postal_code"));
                            if (zipComponent) postal_code = zipComponent.long_name;
                          }
                          setDeliveryDetails(p => ({
                            ...p, 
                            address: place.formatted_address || place.name,
                            postal_code
                          }));
                        }}
                        options={{
                          types: ["geocode", "establishment"],
                        }}
                        defaultValue={deliveryDetails.address}
                        onChange={(e) => setDeliveryDetails(p => ({...p, address: e.target.value}))}
                        className="w-full bg-[#0a0a0a] text-white px-3 py-2 rounded-lg border border-[#333] text-sm focus:border-[#00e676] outline-none"
                        placeholder="Type address to autocomplete..."
                      />
                    </div>
                  </div>
                )}
              </div>
              {/* Payment Methods */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Payment Method</label>
                <div className="grid grid-cols-5 gap-2">
                  {[
                    { id: 1, label: "Cash", icon: "fa-money-bill-wave" },
                    { id: 2, label: "Card", icon: "fa-credit-card" },
                    { id: 3, label: "Mobile", icon: "fa-mobile-alt" },
                    { id: 4, label: "Wallet", icon: "fa-wallet" },
                    { id: 5, label: "Split", icon: "fa-arrows-split-up-and-left" },
                  ].map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setPaymentMethod(m.id)}
                      className={`py-3 px-2 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                        paymentMethod === m.id
                          ? "bg-[#00e676] text-[#0d0d0d] border-[#00e676]"
                          : "bg-[#1c1c1c] border-[#222] text-gray-400 hover:border-gray-500 hover:text-white"
                      }`}
                    >
                      <i className={`fas ${m.icon} text-lg`}></i>
                      <span>{m.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Cash Section */}
              {paymentMethod === 1 && (
                <div className="space-y-4 pt-4 border-t border-[#222]">
                  <div className="form-group">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Amount Received</label>
                    <input
                      type="number"
                      value={amountReceived}
                      onChange={(e) => setAmountReceived(e.target.value)}
                      placeholder="0.00"
                      className="w-full mt-1.5 py-3 px-4 bg-[#050505] border border-[#222] rounded-xl text-white font-bold focus:outline-none focus:border-[#00e676]/50"
                    />
                  </div>
                  {parseFloat(amountReceived || 0) >= grandTotal && (
                    <div className="bg-green-950/20 border border-green-900/50 p-4 rounded-xl flex justify-between items-center">
                      <span className="text-xs text-gray-400">Change Return</span>
                      <h3 className="text-xl font-bold text-[#00e676]">
                        ${(parseFloat(amountReceived || 0) - grandTotal).toFixed(2)}
                      </h3>
                    </div>
                  )}
                </div>
              )}

              {/* Split Section */}
              {paymentMethod === 5 && (
                <div className="space-y-4 pt-4 border-t border-[#222]">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="form-group">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Cash Amount</label>
                      <input
                        type="number"
                        value={splitCash}
                        onChange={(e) => setSplitCash(e.target.value)}
                        placeholder="0.00"
                        className="w-full mt-1.5 py-3 px-4 bg-[#050505] border border-[#222] rounded-xl text-white font-bold focus:outline-none focus:border-[#00e676]/50"
                      />
                    </div>
                    <div className="form-group">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Card Amount</label>
                      <input
                        type="number"
                        value={splitCard}
                        onChange={(e) => setSplitCard(e.target.value)}
                        placeholder="0.00"
                        className="w-full mt-1.5 py-3 px-4 bg-[#050505] border border-[#222] rounded-xl text-white font-bold focus:outline-none focus:border-[#00e676]/50"
                      />
                    </div>
                  </div>
                  
                  {/* Split Summary */}
                  <div className="bg-[#111] p-4 rounded-xl border border-[#333] flex justify-between items-center">
                    <span className="text-xs text-gray-400">Total Entered</span>
                    <h3 className={`text-xl font-bold ${(parseFloat(splitCash || 0) + parseFloat(splitCard || 0)) >= grandTotal ? "text-[#00e676]" : "text-red-500"}`}>
                      ${(parseFloat(splitCash || 0) + parseFloat(splitCard || 0)).toFixed(2)}
                    </h3>
                  </div>

                  {(parseFloat(splitCash || 0) + parseFloat(splitCard || 0)) >= grandTotal && (
                    <div className="bg-green-950/20 border border-green-900/50 p-4 rounded-xl flex justify-between items-center mt-2">
                      <span className="text-xs text-gray-400">Change Return (from Cash)</span>
                      <h3 className="text-xl font-bold text-[#00e676]">
                        ${((parseFloat(splitCash || 0) + parseFloat(splitCard || 0)) - grandTotal).toFixed(2)}
                      </h3>
                    </div>
                  )}
                </div>
              )}

              {/* Quick Cash */}
              {paymentMethod === 1 && (
                  <div className="grid grid-cols-6 gap-1.5">
                    {["exact", "5", "10", "20", "50", "100"].map((amt) => (
                      <button
                        key={amt}
                        onClick={() =>
                          setAmountReceived(
                            amt === "exact" ? grandTotal.toFixed(2) : parseFloat(amt).toFixed(2)
                          )
                        }
                        className="py-2 bg-[#1c1c1c] border border-[#222] hover:border-gray-500 rounded-lg text-xs font-semibold text-gray-300 hover:text-white transition-all"
                      >
                        {amt === "exact" ? "Exact" : amt}
                      </button>
                    ))}
                  </div>
              )}

              {/* Notes */}
              <div className="form-group">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Order Notes (Optional)</label>
                <textarea
                  value={paymentNotes}
                  onChange={(e) => setPaymentNotes(e.target.value)}
                  rows="2"
                  placeholder="Notes, references..."
                  className="w-full mt-1.5 py-2.5 px-4 bg-[#050505] border border-[#222] rounded-xl text-white focus:outline-none focus:border-[#00e676]/50 placeholder-gray-600 text-sm"
                ></textarea>
              </div>
            </div>

            {/* Modal footer */}
            <div className="p-5 border-t border-[#222] bg-[#0a0a0a] flex gap-3">
              <button
                onClick={() => setActiveModal(null)}
                className="flex-1 py-3 bg-[#111111] hover:bg-[#1a1a1a] rounded-xl border border-[#222] font-semibold text-sm transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmPayment}
                className="flex-1 py-3 bg-[#00e676] text-[#0d0d0d] hover:bg-[#00c853] rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2"
              >
                <i className="fas fa-check-circle"></i> Confirm Payment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========== DISCOUNT MODAL ========== */}
      {activeModal === "discount" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" onClick={() => setActiveModal(null)}></div>
          <div className="relative bg-[#111111] border border-[#222] rounded-2xl w-full max-w-sm overflow-hidden flex flex-col z-10">
            <div className="p-5 border-b border-[#222] flex items-center justify-between">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <i className="fas fa-percent text-gray-400"></i> Apply Discount
              </h3>
              <button onClick={() => setActiveModal(null)} className="text-gray-400 hover:text-white">
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex border border-[#222] rounded-xl overflow-hidden">
                <button
                  onClick={() => setDiscount({ ...discount, type: "fixed" })}
                  className={`flex-1 py-2.5 text-xs font-semibold transition-all ${
                    discount.type === "fixed" ? "bg-[#1c1c1c] text-white" : "bg-[#0a0a0a] text-gray-500"
                  }`}
                >
                  <i className="fas fa-dollar-sign mr-1"></i> Fixed
                </button>
                <button
                  onClick={() => setDiscount({ ...discount, type: "percentage" })}
                  className={`flex-1 py-2.5 text-xs font-semibold transition-all ${
                    discount.type === "percentage" ? "bg-[#1c1c1c] text-white" : "bg-[#0a0a0a] text-gray-500"
                  }`}
                >
                  <i className="fas fa-percent mr-1"></i> Percentage
                </button>
              </div>
              <div className="form-group">
                <label className="text-xs font-semibold text-gray-400">Discount Value</label>
                <input
                  type="number"
                  value={discount.value || ""}
                  onChange={(e) => setDiscount({ ...discount, value: parseFloat(e.target.value) || 0 })}
                  placeholder="0.00"
                  className="w-full mt-1.5 py-2.5 px-4 bg-[#050505] border border-[#222] rounded-xl text-white focus:outline-none focus:border-[#00e676]/50 font-bold"
                />
              </div>
            </div>
            <div className="p-5 border-t border-[#222] bg-[#0a0a0a] flex gap-3">
              <button
                onClick={() => setActiveModal(null)}
                className="flex-1 py-2.5 bg-[#111111] hover:bg-[#1a1a1a] rounded-xl border border-[#222] text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => setActiveModal(null)}
                className="flex-1 py-2.5 bg-[#00e676] text-[#0d0d0d] hover:bg-[#00c853] rounded-xl text-xs font-bold"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========== CUSTOMER MODAL ========== */}
      {activeModal === "customer" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" onClick={() => setActiveModal(null)}></div>
          <div className="relative bg-[#111111] border border-[#222] rounded-2xl w-full max-w-md overflow-hidden flex flex-col z-10">
            <div className="p-5 border-b border-[#222] flex items-center justify-between">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <i className="fas fa-users text-[#00e676]"></i> Select Customer
              </h3>
              <button onClick={() => setActiveModal(null)} className="text-gray-400 hover:text-white">
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="p-5 space-y-4">
              <input
                type="text"
                value={customerSearch}
                onChange={(e) => setCustomerSearch(e.target.value)}
                placeholder="Search customer by name, phone or email..."
                className="w-full py-2.5 px-4 bg-[#050505] border border-[#222] rounded-xl text-white focus:outline-none focus:border-[#00e676]/50 placeholder-gray-600 text-sm"
              />
              <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                {customers.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => selectCustomer(c)}
                    className="p-3 bg-[#1c1c1c] hover:bg-[#252525] rounded-xl border border-[#222] hover:border-gray-500 cursor-pointer flex items-center justify-between transition-all"
                  >
                    <div>
                      <div className="font-semibold text-sm">{c.name}</div>
                      <div className="text-[10px] text-gray-500">{c.mobile || c.email}</div>
                    </div>
                    <i className="fas fa-chevron-right text-xs text-gray-600"></i>
                  </div>
                ))}
                {customers.length === 0 && (
                  <div className="text-center py-10 text-gray-500">
                    <i className="fas fa-user-friends text-2xl mb-2"></i>
                    <p className="text-xs">No customers found</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========== HELD CARTS MODAL ========== */}
      {activeModal === "held-carts" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" onClick={() => setActiveModal(null)}></div>
          <div className="relative bg-[#111111] border border-[#222] rounded-2xl w-full max-w-2xl overflow-hidden flex flex-col z-10">
            <div className="p-5 border-b border-[#222] flex items-center justify-between">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <i className="fas fa-history text-gray-400"></i> Held Carts
              </h3>
              <button onClick={() => setActiveModal(null)} className="text-gray-400 hover:text-white">
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
              {loadingHeld ? (
                <div className="text-center py-20 text-gray-500">
                  <i className="fas fa-spinner fa-spin text-2xl mb-2"></i>
                  <p className="text-xs">Loading held carts...</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {heldCarts.map((h) => (
                    <div key={h.id} className="p-4 bg-[#1c1c1c] border border-[#222] rounded-xl flex items-center justify-between gap-4">
                      <div>
                        <div className="font-bold text-xs text-white">{h.reference_no}</div>
                        <div className="text-[10px] text-gray-400 mt-1">
                          Cashier: {h.cashier_name} | Subtotal: ${h.subtotal.toFixed(2)} | Total: ${h.total.toFixed(2)}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => recallHeldCart(h)}
                          className="bg-[#00e676] hover:bg-[#00c853] text-[#0d0d0d] px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all"
                        >
                          Recall
                        </button>
                        <button
                          onClick={() => deleteHeldCart(h.id)}
                          className="bg-red-950/20 border border-red-950 text-[#ff1744] hover:bg-[#ff1744]/20 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                  {heldCarts.length === 0 && (
                    <div className="text-center py-20 text-gray-500">
                      <i className="fas fa-archive text-3xl mb-2"></i>
                      <p className="text-xs">No held carts found</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========== VARIATION SELECT MODAL ========== */}
      {activeModal === "variation" && selectedItemDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" onClick={() => setActiveModal(null)}></div>
          <div className="relative bg-[#111111] border border-[#222] rounded-2xl w-full max-w-md overflow-hidden flex flex-col z-10">
            <div className="p-5 border-b border-[#222] flex items-center justify-between">
              <h3 className="text-lg font-bold">
                Configure {selectedItemDetails.item.item_name}
              </h3>
              <button onClick={() => setActiveModal(null)} className="text-gray-400 hover:text-white">
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="p-6 space-y-6 overflow-y-auto max-h-[60vh]">
              {/* Variations */}
              {selectedItemDetails.variations.length > 0 && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Select Size / Variation</label>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedItemDetails.variations.map((v) => (
                      <button
                        key={v.id}
                        onClick={() => setSelectedVariation(v)}
                        className={`py-3 px-4 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                          selectedVariation?.id === v.id
                            ? "bg-[#00e676] text-[#0d0d0d] border-[#00e676]"
                            : "bg-[#1c1c1c] border-[#222] text-gray-300 hover:border-gray-500"
                        }`}
                      >
                        <span>{v.name}</span>
                        <span className={`text-[10px] font-bold ${selectedVariation?.id === v.id ? "text-black" : "text-[#00e676]"}`}>
                          ${parseFloat(v.price).toFixed(2)}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Addons */}
              {selectedItemDetails.addons.length > 0 && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Select Addons</label>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedItemDetails.addons.map((a) => {
                      const isSelected = selectedAddons.some((addon) => addon.id === a.id);
                      return (
                        <button
                          key={a.id}
                          onClick={() => {
                            if (isSelected) {
                              setSelectedAddons(selectedAddons.filter((addon) => addon.id !== a.id));
                            } else {
                              setSelectedAddons([...selectedAddons, a]);
                            }
                          }}
                          className={`py-2 px-3 rounded-xl border text-xs font-bold flex justify-between items-center transition-all ${
                            isSelected
                              ? "bg-[#00e676]/10 text-[#00e676] border-[#00e676]"
                              : "bg-[#1c1c1c] border-[#222] text-gray-300 hover:border-gray-500"
                          }`}
                        >
                          <span>{a.name}</span>
                          <span className="text-[10px] text-gray-400">+${parseFloat(a.price).toFixed(2)}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Extras */}
              {selectedItemDetails.extras.length > 0 && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Select Extras</label>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedItemDetails.extras.map((e) => {
                      const isSelected = selectedExtras.some((extra) => extra.id === e.id);
                      return (
                        <button
                          key={e.id}
                          onClick={() => {
                            if (isSelected) {
                              setSelectedExtras(selectedExtras.filter((extra) => extra.id !== e.id));
                            } else {
                              setSelectedExtras([...selectedExtras, e]);
                            }
                          }}
                          className={`py-2 px-3 rounded-xl border text-xs font-bold flex justify-between items-center transition-all ${
                            isSelected
                              ? "bg-[#ff1744]/10 text-[#ff1744] border-[#ff1744]"
                              : "bg-[#1c1c1c] border-[#222] text-gray-300 hover:border-gray-500"
                          }`}
                        >
                          <span>{e.name}</span>
                          <span className="text-[10px] text-gray-400">+${parseFloat(e.price).toFixed(2)}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Modal footer */}
            <div className="p-5 border-t border-[#222] bg-[#0a0a0a] flex gap-3">
              <button
                onClick={() => setActiveModal(null)}
                className="flex-1 py-3 bg-[#111111] hover:bg-[#1a1a1a] rounded-xl border border-[#222] font-semibold text-sm transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyVariationModal}
                className="flex-1 py-3 bg-[#00e676] text-[#0d0d0d] hover:bg-[#00c853] rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-1.5"
              >
                <i className="fas fa-plus"></i> Add to Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========== SUCCESS OVERLAY ========== */}
      {successOrder && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
          <div className="text-center space-y-6 max-w-sm">
            <div className="w-20 h-20 bg-[#00e676]/10 border border-[#00e676] text-[#00e676] rounded-full flex items-center justify-center text-4xl mx-auto shadow-2xl shadow-[#00e676]/20">
              <i className="fas fa-check-circle"></i>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold font-display tracking-tight">Payment Successful!</h2>
              <p className="text-gray-400 text-sm">Order Number: <span className="font-mono text-white font-bold">{successOrder.order_number}</span></p>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-4">
              <button
                onClick={() => window.open(`/admin/pos/receipt/${successOrder.order_id}`, "_blank")}
                className="bg-[#111111] border border-[#222] hover:border-gray-500 py-3 rounded-xl font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2"
              >
                <i className="fas fa-print"></i> Print Receipt
              </button>
              <button
                onClick={() => setSuccessOrder(null)}
                className="bg-[#00e676] text-[#0d0d0d] hover:bg-[#00c853] py-3 rounded-xl font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2"
              >
                <i className="fas fa-plus-circle"></i> New Sale
              </button>
            </div>
          </div>
        </div>
      )}
      {/* OPEN TILL MODAL */}
      {activeModal === "open-till" && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] backdrop-blur-sm">
          <div className="bg-[#1e1e24] p-8 rounded-2xl w-[400px] border border-gray-700 shadow-2xl">
            <div className="text-center mb-6">
              <i className="fas fa-cash-register text-5xl text-emerald-500 mb-4"></i>
              <h2 className="text-2xl font-black text-white uppercase tracking-wider">Open Till</h2>
              <p className="text-gray-400 text-sm mt-1">Enter opening cash balance to start your shift</p>
            </div>
            
            <div className="mb-6">
              <label className="text-sm font-bold text-gray-300 block mb-2">Opening Cash ($)</label>
              <input
                type="number"
                value={tillInputAmount}
                onChange={(e) => setTillInputAmount(e.target.value)}
                className="w-full bg-[#0d0d0d] border border-gray-600 p-4 rounded-xl text-white text-2xl font-bold focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-center"
                placeholder="0.00"
                autoFocus
              />
            </div>
            
            <button
              onClick={handleOpenTill}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-xl text-lg uppercase tracking-wider transition-all shadow-lg shadow-emerald-900/50"
            >
              Open Shift
            </button>
          </div>
        </div>
      )}

      {/* CLOSE TILL MODAL */}
      {activeModal === "close-till" && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] backdrop-blur-sm">
          <div className="bg-[#1e1e24] p-8 rounded-2xl w-[450px] border border-gray-700 shadow-2xl">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-black text-white uppercase tracking-wider flex items-center gap-2">
                  <i className="fas fa-lock text-red-500"></i> Close Till
                </h2>
                <p className="text-gray-400 text-sm mt-1">Review shift summary and enter final cash.</p>
              </div>
              <button onClick={() => setActiveModal(null)} className="text-gray-500 hover:text-white">
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>
            
            <div className="bg-[#0d0d0d] rounded-xl p-4 mb-6 border border-gray-800 space-y-3 text-sm">
              <div className="flex justify-between text-gray-300">
                <span>Opening Balance:</span>
                <span className="font-bold text-white">${Number(till.opening_balance || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Cash Sales:</span>
                <span className="font-bold text-emerald-400">+ ${Number(till.cash_sales || 0).toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-700 pt-2 flex justify-between text-white font-bold text-lg">
                <span>Expected Cash in Drawer:</span>
                <span className="text-emerald-400">${Number(till.current_cash || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-400 text-xs border-t border-gray-800 pt-2">
                <span>Card/Other Sales:</span>
                <span>${Number(till.card_sales || 0).toFixed(2)}</span>
              </div>
            </div>

            <div className="mb-6">
              <label className="text-sm font-bold text-gray-300 block mb-2">Actual Cash Counted ($)</label>
              <input
                type="number"
                value={tillInputAmount}
                onChange={(e) => setTillInputAmount(e.target.value)}
                className="w-full bg-[#0d0d0d] border border-gray-600 p-4 rounded-xl text-white text-2xl font-bold focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 text-center"
                placeholder={till.current_cash.toFixed(2)}
                autoFocus
              />
              <p className="text-xs text-gray-500 mt-2 text-center">Leave empty if actual cash matches expected cash.</p>
            </div>
            
            <button
              onClick={handleCloseTill}
              className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-4 rounded-xl text-lg uppercase tracking-wider transition-all shadow-lg shadow-red-900/50"
            >
              End Shift & Close Drawer
            </button>
          </div>
        </div>
      )}

      {/* QUICK ADD CATEGORY MODAL */}
      {activeModal === "add-category" && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1a1a] rounded-xl w-full max-w-sm overflow-hidden flex flex-col shadow-2xl border border-gray-700">
            <div className="bg-[#111] p-4 flex justify-between items-center border-b border-gray-800">
              <h3 className="font-bold text-white uppercase tracking-wider"><i className="fas fa-folder-plus text-[#00e676] mr-2"></i> Quick Add Category</h3>
              <button onClick={() => { setActiveModal(null); setNewCategory({name: "", image: null}); }} className="text-gray-400 hover:text-red-500 transition-colors">
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <input 
                type="text" 
                placeholder="Category Name" 
                value={newCategory.name}
                onChange={e => setNewCategory({...newCategory, name: e.target.value})}
                className="w-full bg-[#111] border border-gray-700 text-white p-3 rounded" 
              />
              <div className="border border-gray-700 p-3 rounded bg-[#111]">
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Category Image</label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={e => setNewCategory({...newCategory, image: e.target.files[0]})}
                  className="w-full text-white text-sm" 
                />
              </div>
              <button 
                onClick={async () => {
                  if(!newCategory.name) return alert("Enter name");
                  setLoadingAddCategory(true);
                  try {
                    const formData = new FormData();
                    formData.append("category_name", newCategory.name);
                    if (newCategory.image) formData.append("image", newCategory.image);

                    const res = await fetch("/api/admin2/categories", {
                      method: "POST",
                      body: formData
                    });
                    const data = await res.json();
                    if (data.status === 1) {
                      setCategories(prev => [...prev, data.category]);
                      setNewCategory({name: "", image: null});
                      setActiveModal(null);
                    } else {
                      alert("Error: " + data.error);
                    }
                  } catch (err) {
                    alert("Failed to add category");
                  }
                  setLoadingAddCategory(false);
                }}
                className="w-full bg-[#00e676] text-black font-bold py-3 rounded hover:bg-[#00c853] transition-colors mt-2"
              >
                {loadingAddCategory ? "Saving..." : "Save Category"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QUICK ADD PRODUCT MODAL */}
      {activeModal === "add-product" && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1a1a] rounded-xl w-full max-w-md overflow-hidden flex flex-col shadow-2xl border border-gray-700">
            <div className="bg-[#111] p-4 flex justify-between items-center border-b border-gray-800">
              <h3 className="font-bold text-white uppercase tracking-wider"><i className={`fas ${editingProduct ? "fa-pencil-alt text-blue-500" : "fa-box-open text-[#00e676]"} mr-2`}></i> {editingProduct ? "Edit Product" : "Quick Add Product"}</h3>
              <button onClick={() => { setActiveModal(null); setEditingProduct(false); setNewProduct({ id: null, name: "", price: "", category_id: "", description: "", image: null }); }} className="text-gray-400 hover:text-red-500 transition-colors">
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <input 
                type="text" 
                placeholder="Product Name" 
                value={newProduct.name}
                onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                className="w-full bg-[#111] border border-gray-700 text-white p-3 rounded" 
              />
              <input 
                type="number" 
                placeholder="Price" 
                value={newProduct.price}
                onChange={e => setNewProduct({...newProduct, price: e.target.value})}
                className="w-full bg-[#111] border border-gray-700 text-white p-3 rounded" 
              />
              <select 
                value={newProduct.category_id}
                onChange={e => setNewProduct({...newProduct, category_id: e.target.value})}
                className="w-full bg-[#111] border border-gray-700 text-white p-3 rounded"
              >
                <option value="">Select Category</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.category_name}</option>)}
              </select>
              <textarea
                placeholder="Product Description (optional)"
                value={newProduct.description}
                onChange={e => setNewProduct({...newProduct, description: e.target.value})}
                className="w-full bg-[#111] border border-gray-700 text-white p-3 rounded min-h-[80px]"
              ></textarea>
              <div className="border border-gray-700 p-3 rounded bg-[#111]">
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Product Image</label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={e => setNewProduct({...newProduct, image: e.target.files[0]})}
                  className="w-full text-white text-sm" 
                />
              </div>
              <button 
                onClick={async () => {
                  if(!newProduct.name || !newProduct.price || !newProduct.category_id) return alert("Enter required details");
                  setLoadingAddProduct(true);
                  try {
                    const formData = new FormData();
                    formData.append("item_name", newProduct.name);
                    formData.append("price", newProduct.price);
                    formData.append("cat_id", newProduct.category_id);
                    formData.append("item_description", newProduct.description);
                    if (newProduct.image) formData.append("image", newProduct.image);
                    
                    if (editingProduct) {
                      const existingItem = items.find(i => i.id === newProduct.id);
                      if (existingItem) {
                        formData.append("qty", existingItem.qty);
                        formData.append("item_type", existingItem.item_type);
                      }
                      const res = await fetch(`/api/admin/products/${newProduct.id}`, {
                        method: "PUT",
                        body: formData
                      });
                      const data = await res.json();
                      if (data.status === 1) {
                        fetchItems();
                        setNewProduct({ id: null, name: "", price: "", category_id: "", description: "", image: null });
                        setEditingProduct(false);
                        setActiveModal(null);
                      } else {
                        alert("Error: " + data.error);
                      }
                    } else {
                      const res = await fetch("/api/admin/products", {
                        method: "POST",
                        body: formData
                      });
                      const data = await res.json();
                      if (data.status === 1) {
                        fetchItems();
                        setNewProduct({ id: null, name: "", price: "", category_id: "", description: "", image: null });
                        setActiveModal(null);
                      } else {
                        alert("Error: " + data.error);
                      }
                    }
                  } catch (err) {
                    alert(`Failed to ${editingProduct ? "update" : "add"} product`);
                  }
                  setLoadingAddProduct(false);
                }}
                className={`w-full ${editingProduct ? "bg-blue-500 hover:bg-blue-600" : "bg-[#00e676] hover:bg-[#00c853]"} text-white font-bold py-3 rounded transition-colors mt-2`}
              >
                {loadingAddProduct ? "Saving..." : (editingProduct ? "Update Product" : "Save Product")}
              </button>
            </div>
          </div>
        </div>
      )}


      {/* ========== ORDERS MODAL ========== */}
      {activeModal === "orders" && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-[fadeIn_0.3s_ease-out]">
          <div className="bg-[#111] rounded-3xl border border-[#222] w-full max-w-4xl max-h-[90vh] flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-[#222] bg-[#0a0a0a]">
              <h2 className="text-2xl font-extrabold text-white flex items-center">
                <i className="fas fa-list-alt text-[#00e676] mr-3"></i> Orders
              </h2>
              <div className="flex items-center gap-4">
                <div className="bg-[#1a1a1a] px-4 py-2 rounded-xl border border-[#333] flex items-center">
                  <span className="text-gray-400 text-sm mr-2">Total Sales:</span>
                  <span className="text-[#00e676] font-bold">${ordersTotal}</span>
                </div>
                <input type="date" value={ordersDate} onChange={e => setOrdersDate(e.target.value)} className="bg-[#1a1a1a] text-white px-4 py-2 rounded-xl border border-[#333] focus:border-[#00e676] outline-none" />
                <button onClick={() => setActiveModal(null)} className="w-10 h-10 bg-[#1a1a1a] hover:bg-[#333] rounded-full text-gray-400 hover:text-white transition-colors flex items-center justify-center border border-[#222]">
                  <i className="fas fa-times"></i>
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
              {loadingOrders ? (
                <div className="flex justify-center items-center h-full"><i className="fas fa-spinner fa-spin text-3xl text-[#00e676]"></i></div>
              ) : orders.length === 0 ? (
                <div className="text-center text-gray-500 mt-10"><p>No orders found for {ordersDate}.</p></div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#333] text-gray-400 text-sm">
                      <th className="pb-3 px-2">Order #</th>
                      <th className="pb-3 px-2">Time</th>
                      <th className="pb-3 px-2">Type</th>
                      <th className="pb-3 px-2">Customer</th>
                      <th className="pb-3 px-2">Total</th>
                      <th className="pb-3 px-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(o => (
                      <tr key={o.id} className="border-b border-[#222] hover:bg-[#1a1a1a] transition-colors">
                        <td className="py-3 px-2 text-[#00e676] font-bold">{o.order_number}</td>
                        <td className="py-3 px-2 text-white text-sm">{new Date(o.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</td>
                        <td className="py-3 px-2 text-white text-sm">
                          {o.order_type === "1" ? <span className="bg-blue-900/40 text-blue-400 px-2 py-1 rounded text-xs border border-blue-800">Delivery</span> : <span className="bg-gray-800 text-gray-300 px-2 py-1 rounded text-xs border border-gray-700">Walk-in</span>}
                        </td>
                        <td className="py-3 px-2 text-white text-sm">{o.name || "Walk-in"} {o.is_pos_order === 0 ? <span className="text-xs text-yellow-500 ml-1">(Online)</span> : ""}</td>
                        <td className="py-3 px-2 text-white font-bold">${o.grand_total.toFixed(2)}</td>
                        <td className="py-3 px-2">
                           <span className="bg-green-900/40 text-green-400 px-2 py-1 rounded text-xs border border-green-800">Paid</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
