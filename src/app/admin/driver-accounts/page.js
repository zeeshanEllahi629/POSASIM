"use client";
import { useState, useEffect } from "react";

export default function DriverAccountsPage() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  
  // Payment Modal
  const [showModal, setShowModal] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentNotes, setPaymentNotes] = useState("");

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (dateRange.start) query.append("start", dateRange.start);
      if (dateRange.end) query.append("end", dateRange.end);

      const res = await fetch(`/api/admin/driver-accounts?${query.toString()}`);
      const data = await res.json();
      setAccounts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, [dateRange]);

  const handlePay = async (e) => {
    e.preventDefault();
    if (!paymentAmount || isNaN(paymentAmount) || Number(paymentAmount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    try {
      const res = await fetch("/api/admin/driver-accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          driver_id: selectedDriver.id,
          amount: paymentAmount,
          notes: paymentNotes
        })
      });

      if (res.ok) {
        alert("Payment recorded successfully");
        setShowModal(false);
        fetchAccounts(); // refresh data
      } else {
        alert("Failed to record payment");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">Driver Accounts</h1>
          
          <div className="flex gap-4 items-center bg-[#1a1a1a] p-3 rounded-lg border border-[#333]">
            <div>
              <label className="text-xs text-zinc-400 block mb-1">From Date</label>
              <input 
                type="date" 
                className="bg-[#111] border border-[#333] rounded px-3 py-1.5 text-sm text-white"
                value={dateRange.start}
                onChange={e => setDateRange({...dateRange, start: e.target.value})}
              />
            </div>
            <div>
              <label className="text-xs text-zinc-400 block mb-1">To Date</label>
              <input 
                type="date" 
                className="bg-[#111] border border-[#333] rounded px-3 py-1.5 text-sm text-white"
                value={dateRange.end}
                onChange={e => setDateRange({...dateRange, end: e.target.value})}
              />
            </div>
            <div className="pt-5">
              <button 
                onClick={() => setDateRange({start:"", end:""})}
                className="text-xs text-red-500 hover:text-red-400 underline"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
        
        {loading ? (
          <p className="text-zinc-400">Loading...</p>
        ) : accounts.length === 0 ? (
          <div className="bg-[#1a1a1a] p-8 text-center rounded-xl border border-[#333]">
            <p className="text-zinc-400">No driver accounts found for this period.</p>
          </div>
        ) : (
          <div className="overflow-x-auto bg-[#1a1a1a] rounded-xl border border-[#333]">
            <table className="min-w-full divide-y divide-[#333]">
              <thead className="bg-[#111]">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Driver Name</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Total Deliveries</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Earned Amount</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Paid Amount</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Remaining Balance</th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-zinc-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#333]">
                {accounts.map((driver) => (
                  <tr key={driver.id} className="hover:bg-[#222] transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-medium">
                      {driver.name} <br/>
                      <span className="text-xs text-zinc-500 font-normal">{driver.email}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-300">
                      <span className="bg-blue-500/20 text-blue-400 py-1 px-3 rounded-full">{driver.totalDeliveries}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-400 font-semibold">${driver.totalEarned}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-300">${driver.totalPaid}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold">
                      <span className={Number(driver.remainingBalance) > 0 ? "text-red-400" : "text-zinc-400"}>
                        ${driver.remainingBalance}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {Number(driver.remainingBalance) > 0 && (
                        <button
                          onClick={() => {
                            setSelectedDriver(driver);
                            setPaymentAmount(driver.remainingBalance);
                            setPaymentNotes("");
                            setShowModal(true);
                          }}
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                          Pay Now
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Payment Modal */}
        {showModal && selectedDriver && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-[#161616] border border-[#333] rounded-2xl p-6 w-full max-w-md shadow-2xl">
              <h3 className="text-xl font-bold text-white mb-4">Record Payment for {selectedDriver.name}</h3>
              <p className="text-zinc-400 text-sm mb-6">Current remaining balance: <span className="text-red-400 font-bold">${selectedDriver.remainingBalance}</span></p>
              
              <form onSubmit={handlePay}>
                <div className="mb-4">
                  <label className="block text-zinc-400 text-sm mb-2">Amount to Pay ($)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    required
                    className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-red-500"
                    value={paymentAmount}
                    onChange={e => setPaymentAmount(e.target.value)}
                  />
                </div>
                
                <div className="mb-6">
                  <label className="block text-zinc-400 text-sm mb-2">Notes (Optional)</label>
                  <textarea 
                    className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-red-500"
                    rows="3"
                    value={paymentNotes}
                    onChange={e => setPaymentNotes(e.target.value)}
                    placeholder="e.g. Weekly payout via Bank Transfer"
                  ></textarea>
                </div>
                
                <div className="flex gap-3 justify-end">
                  <button 
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 rounded-lg border border-[#333] text-zinc-300 hover:bg-[#222]"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium"
                  >
                    Confirm Payment
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </>
  );
}
