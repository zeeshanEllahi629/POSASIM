import UsersClient from "./UsersClient";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
  try {
    // Fetch users (type = 2 for customers, is_deleted = 2 means not deleted)
    const users = await prisma.users.findMany({
      where: {
        type: 2,
        is_deleted: 2,
      },
      orderBy: {
        id: "desc",
      },
      select: {
        id: true,
        name: true,
        email: true,
        mobile: true,
        profile_image: true,
        wallet: true,
        login_type: true,
        is_available: true,
        is_verified: true,
      },
    });

    // Convert BigInt to string for client component
    const serializedUsers = users.map((user) => ({
      ...user,
      id: user.id.toString(),
    }));

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <i className="fas fa-users text-[#00e676]"></i>
            Customers Management
          </h1>
        </div>
        <UsersClient initialUsers={serializedUsers} error={null} />
      </div>
    );
  } catch (error) {
    console.error("Failed to load users:", error);
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <i className="fas fa-users text-[#00e676]"></i>
            Customers Management
          </h1>
        </div>
        <UsersClient initialUsers={[]} error="Failed to load users from database" />
      </div>
    );
  }
}
