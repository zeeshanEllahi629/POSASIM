import sys
import re

path = "src/app/admin/pos/page.js"

with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. State Injection
state_inj = """
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
"""

if "const [deliveryDetails" not in content:
    content = content.replace('const [orderType, setOrderType] = useState(2); // 1 = Delivery, 2 = Takeaway/Collection, 3 = Dine-in', 
                              'const [orderType, setOrderType] = useState(2); // 1 = Delivery, 2 = Takeaway/Collection, 3 = Dine-in' + state_inj)


# 2. Payment payload injection
pay_target = 'customer_name: customer ? customer.name : "Walk-in Customer",'
pay_inj = pay_target + """
          customer_phone: deliveryDetails.phone || null,
          customer_address: deliveryDetails.address || null,
          customer_postal_code: deliveryDetails.postal_code || null,
          driver_id: deliveryDetails.driver_id || null,"""
if "customer_address: deliveryDetails.address" not in content:
    content = content.replace(pay_target, pay_inj)

# 3. Header Orders Button
head_target = '<button onClick={() => setActiveModal("held-carts")}'
head_inj = """<button onClick={() => setActiveModal("orders")} className="h-8 px-4 rounded-full bg-[#117a3a] text-white flex items-center justify-center font-bold text-sm hover:bg-[#148e43] mr-2">
            <i className="fas fa-list-alt mr-2"></i> Orders
          </button>\n          """ + head_target
if "activeModal(\"orders\")" not in content:
    content = content.replace(head_target, head_inj)

# 4. Delivery UI in Payment Modal
# We inject after the Order Type buttons inside Payment Modal. 
# Let's find a safe spot in Payment Modal.
ui_target = '{/* Payment Methods */}'
ui_inj = """{/* Delivery / Order Type */}
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
                      <textarea value={deliveryDetails.address} onChange={e => setDeliveryDetails(p => ({...p, address: e.target.value}))} className="w-full bg-[#0a0a0a] text-white px-3 py-2 rounded-lg border border-[#333] text-sm focus:border-[#00e676] outline-none resize-none h-16" placeholder="Street address..." />
                    </div>
                  </div>
                )}
              </div>
              """ + ui_target
if "Delivery Details" not in content:
    content = content.replace(ui_target, ui_inj)


# 5. Receipt UI Updates
rec_target = '{/* Contact Info */}'
rec_inj = rec_target + """
              {successOrder.address && <p className="text-xs text-black mt-1">Address: {successOrder.address}</p>}
              {successOrder.mobile && <p className="text-xs text-black">Phone: {successOrder.mobile}</p>}
"""
if "successOrder.address" not in content:
    content = content.replace(rec_target, rec_inj)

# Need to update successOrder state to include address/mobile from process-payment! Wait, process-payment only returns order_id and order_number. I need to fetch the receipt immediately if I want to show address, OR just pass the delivery details! Let's just use deliveryDetails for the receipt if it's the current session.
# Better yet, the receipt usually prints directly via API fetch in `pos/page.js` or just uses current state.
# Wait, let's check `pos/page.js` receipt logic. 

# 6. Orders Modal JSX
orders_modal = """
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
"""
if "========== ORDERS MODAL ==========" not in content:
    # insert before final </div> tag
    content = content.replace("    </div>\n  );\n}", orders_modal + "    </div>\n  );\n}")


with open(path, "w", encoding="utf-8") as f:
    f.write(content)

print("Patch applied to POS page")
