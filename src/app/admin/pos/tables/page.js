import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function PosTableManagement() {
  // Fetch today's bookings
  const today = new Date().toISOString().split('T')[0];
  
  const bookings = await prisma.bookings.findMany({
    where: {
      status: {
        in: [1, 2] // Assuming 1=Pending, 2=Confirmed/Seated
      }
    },
    orderBy: {
      time: 'asc'
    }
  });

  // Define our restaurant layout (mocked total tables)
  const TOTAL_TABLES = 24;
  const tables = Array.from({ length: TOTAL_TABLES }, (_, i) => i + 1);

  // Map bookings to tables
  const tableBookings = bookings.reduce((acc, booking) => {
    if (booking.table_number) {
      acc[booking.table_number] = booking;
    }
    return acc;
  }, {});

  return (
    <div className="bg-[#0f172a] min-h-screen text-slate-200">
      {/* Top Navbar */}
      <div className="bg-[#1e293b] border-b border-slate-700 p-4 sticky top-0 z-50">
        <div className="flex items-center justify-between container mx-auto">
          <div className="flex items-center gap-4">
            <Link href="/admin/pos" className="text-slate-400 hover:text-white transition">
              <i className="fa-solid fa-arrow-left text-xl"></i>
            </Link>
            <h1 className="text-2xl font-bold text-white tracking-tight">Table Management</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              <span className="text-sm font-medium">Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500"></div>
              <span className="text-sm font-medium">Occupied</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-500"></div>
              <span className="text-sm font-medium">Reserved</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-6 flex flex-col lg:flex-row gap-6">
        
        {/* Table Map Grid */}
        <div className="w-full lg:w-3/4">
          <div className="bg-[#1e293b] rounded-2xl shadow-xl p-8 border border-slate-700">
            <h2 className="text-xl font-bold mb-6 text-white border-b border-slate-700 pb-4">Main Floor Layout</h2>
            
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {tables.map(num => {
                const booking = tableBookings[num];
                const isOccupied = booking && booking.status === 2;
                const isReserved = booking && booking.status === 1;
                
                let bgColor = "bg-slate-700 hover:bg-slate-600";
                let borderColor = "border-slate-600";
                let textColor = "text-slate-300";

                if (isOccupied) {
                  bgColor = "bg-rose-900/30 hover:bg-rose-900/50";
                  borderColor = "border-rose-500/50";
                  textColor = "text-rose-400";
                } else if (isReserved) {
                  bgColor = "bg-amber-900/30 hover:bg-amber-900/50";
                  borderColor = "border-amber-500/50";
                  textColor = "text-amber-400";
                }

                return (
                  <div 
                    key={num} 
                    className={`relative flex flex-col items-center justify-center h-28 rounded-xl border-2 transition-all cursor-pointer shadow-sm hover:shadow-md ${bgColor} ${borderColor}`}
                  >
                    <span className={`text-2xl font-bold ${textColor}`}>T{num}</span>
                    {booking && (
                      <div className="mt-2 text-center px-2">
                        <p className="text-xs text-white font-medium truncate w-full">{booking.name}</p>
                        <p className="text-[10px] text-slate-400 mt-1"><i className="fa-solid fa-users"></i> {booking.guests}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sidebar - Upcoming Reservations */}
        <div className="w-full lg:w-1/4">
          <div className="bg-[#1e293b] rounded-2xl shadow-xl p-6 border border-slate-700 h-full">
            <h2 className="text-xl font-bold mb-6 text-white border-b border-slate-700 pb-4 flex justify-between items-center">
              Active Bookings
              <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">{bookings.length}</span>
            </h2>
            
            {bookings.length > 0 ? (
              <div className="space-y-4 overflow-y-auto max-h-[600px] pr-2 custom-scrollbar">
                {bookings.map(booking => (
                  <div key={booking.id} className="bg-slate-800 p-4 rounded-xl border border-slate-700 hover:border-blue-500/50 transition">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-white truncate pr-2">{booking.name}</h3>
                      <span className={`text-[10px] font-bold px-2 py-1 rounded border ${booking.status === 2 ? 'bg-rose-900/30 text-rose-400 border-rose-500/30' : 'bg-amber-900/30 text-amber-400 border-amber-500/30'}`}>
                        {booking.status === 2 ? 'SEATED' : 'WAITING'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mb-2"><i className="fa-regular fa-clock mr-1"></i> {booking.time} | <i className="fa-solid fa-users mx-1"></i> {booking.guests}</p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-sm font-medium text-slate-300">
                        {booking.table_number ? `Table ${booking.table_number}` : 'Unassigned'}
                      </span>
                      <button className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-1 px-3 rounded transition">
                        Assign
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-slate-500">
                <i className="fa-solid fa-clipboard-list text-4xl mb-3 opacity-50"></i>
                <p>No active bookings today.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
