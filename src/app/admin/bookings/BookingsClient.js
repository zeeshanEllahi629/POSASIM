"use client";

import { useState } from "react";

export default function BookingsClient({ initialBookings, error }) {
  const [bookings, setBookings] = useState(initialBookings || []);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Modals state
  const [showTableModal, setShowTableModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Form inputs
  const [tableNumber, setTableNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");

  const handleOpenTableModal = (booking) => {
    setSelectedBooking(booking);
    setTableNumber("");
    setFormError("");
    setShowTableModal(true);
  };

  const handleAcceptBooking = async (e) => {
    e.preventDefault();
    if (!tableNumber.trim()) {
      setFormError("Table number is required");
      return;
    }
    setLoading(true);
    setFormError("");

    try {
      const res = await fetch(`/api/admin/bookings/${selectedBooking.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: 2,
          table_number: tableNumber,
        }),
      });

      const data = await res.json();
      if (data.status === 1) {
        setBookings(
          bookings.map((b) => (b.id === selectedBooking.id ? data.booking : b))
        );
        setShowTableModal(false);
      } else {
        setFormError(data.error || "Failed to accept booking");
      }
    } catch (err) {
      setFormError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRejectBooking = async (id) => {
    if (!confirm("Are you sure you want to reject this booking?")) return;

    try {
      const res = await fetch(`/api/admin/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: 3,
        }),
      });

      const data = await res.json();
      if (data.status === 1) {
        setBookings(
          bookings.map((b) => (b.id === id ? data.booking : b))
        );
      } else {
        alert(data.error || "Failed to reject booking");
      }
    } catch (err) {
      alert("Failed to connect to server");
    }
  };

  const handleDeleteBooking = async (id) => {
    if (!confirm("Are you sure you want to delete this booking?")) return;

    try {
      const res = await fetch(`/api/admin/bookings/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (data.status === 1) {
        setBookings(bookings.filter((b) => b.id !== id));
      } else {
        alert(data.error || "Failed to delete booking");
      }
    } catch (err) {
      alert("Failed to connect to server");
    }
  };

  // Filter list
  const filtered = bookings.filter((b) =>
    (b.booking_number || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (b.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (b.email || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (b.mobile || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/30 text-[#ff1744] text-xs">
          {error}
        </div>
      )}

      {/* ========== HEADER CONTROL BAR ========== */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-[#111111]/60 border border-[#222222] p-4 rounded-2xl">
        <div className="relative flex-1 max-w-md">
          <i className="fas fa-search absolute left-4.5 top-1/2 -translate-y-1/2 text-gray-500"></i>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search bookings..."
            className="w-full pl-11 pr-4 py-2.5 bg-[#080808] border border-[#222222] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#00e676]/50 focus:ring-1 focus:ring-[#00e676]/30 transition-all text-sm"
          />
        </div>
      </div>

      {/* ========== BOOKINGS LIST TABLE ========== */}
      <div className="bg-[#111]/80 border border-[#222] rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#222] text-[10px] text-gray-500 uppercase font-bold tracking-wider bg-[#0a0a0a]">
                <th className="py-4 px-6">Booking No.</th>
                <th className="py-4 px-6">User Info</th>
                <th className="py-4 px-6">Date & Time</th>
                <th className="py-4 px-6">Guests & Type</th>
                <th className="py-4 px-6">Message</th>
                <th className="py-4 px-6">Table No.</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1c1c1c] text-xs">
              {filtered.map((booking) => (
                <tr key={booking.id} className="hover:bg-[#161616]/40 transition-colors group">
                  <td className="py-4 px-6 font-semibold text-gray-200">
                    {booking.booking_number}
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-semibold text-white">{booking.name}</div>
                    <div className="text-gray-500">{booking.email}</div>
                    <div className="text-gray-500">{booking.mobile}</div>
                  </td>
                  <td className="py-4 px-6 text-gray-400">
                    <div className="text-white">{booking.date}</div>
                    <div>{booking.time}</div>
                  </td>
                  <td className="py-4 px-6 text-gray-400">
                    <div className="text-white">{booking.guests} Guests</div>
                    <div>{booking.reservation_type}</div>
                  </td>
                  <td className="py-4 px-6 text-gray-400 max-w-xs truncate">
                    {booking.special_request || "--"}
                  </td>
                  <td className="py-4 px-6 font-mono text-gray-400">
                    {booking.status === 2 && booking.table_number ? booking.table_number : "--"}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {booking.status === 1 && (
                        <>
                          <button
                            onClick={() => handleOpenTableModal(booking)}
                            className="w-8 h-8 flex items-center justify-center bg-green-950/20 border border-green-500/30 text-[#00e676] hover:bg-[#00e676] hover:text-[#0d0d0d] rounded-lg transition-all"
                            title="Accept"
                          >
                            <i className="fa-sharp fa-solid fa-check"></i>
                          </button>
                          <button
                            onClick={() => handleRejectBooking(booking.id)}
                            className="w-8 h-8 flex items-center justify-center bg-red-950/20 border border-red-500/30 text-[#ff1744] hover:bg-[#ff1744] hover:text-[#0d0d0d] rounded-lg transition-all"
                            title="Reject"
                          >
                            <i className="fa-sharp fa-solid fa-xmark"></i>
                          </button>
                        </>
                      )}
                      {booking.status === 2 && (
                        <span className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-green-950/20 text-[#00e676]">
                          Accepted
                        </span>
                      )}
                      {booking.status === 3 && (
                        <span className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-red-950/20 text-[#ff1744]">
                          Rejected
                        </span>
                      )}
                      <button
                        onClick={() => handleDeleteBooking(booking.id)}
                        className="w-8 h-8 flex items-center justify-center ml-2 bg-red-950/10 border border-red-950/30 text-[#ff1744] hover:bg-[#ff1744]/15 rounded-lg transition-all"
                        title="Delete"
                      >
                        <i className="fas fa-trash-alt"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center py-12 text-gray-500">
                    No bookings found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========== ACCEPT/TABLE MODAL ========== */}
      {showTableModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" onClick={() => setShowTableModal(false)}></div>
          <div className="relative bg-[#111111] border border-[#222] rounded-2xl w-full max-w-md overflow-hidden flex flex-col z-10">
            <div className="p-5 border-b border-[#222] flex items-center justify-between">
              <h3 className="text-base font-bold flex items-center gap-2">
                <i className="fa-sharp fa-solid fa-check text-[#00e676]"></i> Accept Booking
              </h3>
              <button onClick={() => setShowTableModal(false)} className="text-gray-400 hover:text-white">
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            {formError && (
              <div className="mx-6 mt-4 p-3 rounded-lg bg-red-950/20 border border-red-500/20 text-[#ff1744] text-[11px]">
                {formError}
              </div>
            )}

            <form onSubmit={handleAcceptBooking} className="p-6 space-y-4">
              <div className="form-group">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Booking Number
                </label>
                <input
                  type="text"
                  disabled
                  value={selectedBooking?.booking_number || ""}
                  className="w-full px-4 py-2.5 bg-[#050505] border border-[#222] rounded-xl text-gray-500 cursor-not-allowed text-sm"
                />
              </div>

              <div className="form-group">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Table Number <span className="text-[#ff1744]">*</span>
                </label>
                <input
                  type="number"
                  required
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  placeholder="e.g. 10"
                  className="w-full px-4 py-2.5 bg-[#050505] border border-[#222] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#00e676]/50 text-sm"
                />
              </div>

              <div className="pt-4 flex gap-3 border-t border-[#222] mt-6">
                <button
                  type="button"
                  onClick={() => setShowTableModal(false)}
                  className="flex-1 py-2.5 bg-[#1c1c1c] hover:bg-[#222] rounded-xl border border-[#222] text-xs font-bold transition-all text-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2.5 bg-[#00e676] text-[#0d0d0d] hover:bg-[#00c853] rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
                >
                  {loading ? <i className="fas fa-spinner fa-spin"></i> : "Confirm"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
