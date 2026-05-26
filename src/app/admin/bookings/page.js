import prisma from "@/lib/prisma";
import BookingsClient from "./BookingsClient";

export const metadata = {
  title: "Bookings | Admin Dashboard",
};

export default async function BookingsPage() {
  let bookings = [];
  let error = null;

  try {
    bookings = await prisma.bookings.findMany({
      orderBy: { id: "desc" },
    });
  } catch (err) {
    console.error("Error fetching bookings:", err);
    error = "Failed to load bookings.";
  }

  return (
    <main className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Bookings</h1>
        <p className="text-sm text-gray-400">Manage table reservations</p>
      </div>
      
      <BookingsClient initialBookings={bookings} error={error} />
    </main>
  );
}
