import { prisma } from "@/lib/prisma";
import LoyaltyClient from "./LoyaltyClient";

export const metadata = {
  title: "Loyalty Management | Admin Dashboard",
};

export default async function LoyaltyPage() {
  let initialCustomers = [];
  let error = null;

  try {
    const customers = await prisma.users.findMany({
      where: { type: 2 },
      orderBy: { loyalty_points: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        mobile: true,
        loyalty_points: true,
        loyalty_tier: true,
      },
    });

    initialCustomers = customers.map((c) => ({
      ...c,
      id: c.id.toString(),
    }));
  } catch (err) {
    console.error("Error fetching loyalty customers:", err);
    error = "Failed to load loyalty data.";
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white tracking-tight mb-2">
          Loyalty Management
        </h1>
        <p className="text-gray-400 text-sm">
          Manage customer loyalty points, view tiers, and award or deduct points.
        </p>
      </div>

      <LoyaltyClient initialCustomers={initialCustomers} error={error} />
    </div>
  );
}
