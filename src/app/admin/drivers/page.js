import DriversClient from "./DriversClient";
import prisma from "@/lib/prisma";

export const metadata = {
  title: "Drivers | Admin Dashboard",
  description: "Manage driver assignment",
};

export default async function DriversPage() {
  let initialDrivers = [];
  let error = null;

  try {
    const driversList = await prisma.users.findMany({
      where: {
        type: 3,
        is_deleted: 2,
      },
      orderBy: {
        id: "desc",
      },
    });

    initialDrivers = JSON.parse(
      JSON.stringify(driversList, (key, value) =>
        typeof value === "bigint" ? value.toString() : value
      )
    );
  } catch (err) {
    console.error("Error fetching drivers:", err);
    error = "Failed to load drivers. Please try refreshing the page.";
  }

  return (
    <div className="max-w-7xl mx-auto pt-4 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <i className="fas fa-motorcycle text-[#00e676]"></i> Driver Management
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Add, edit, and manage delivery drivers.
        </p>
      </div>

      <DriversClient initialDrivers={initialDrivers} error={error} />
    </div>
  );
}
