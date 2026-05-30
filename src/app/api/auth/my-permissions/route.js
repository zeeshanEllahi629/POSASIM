import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function GET(req) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return NextResponse.json({ success: false, permissions: [] }, { status: 401 });

    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ success: false, permissions: [] }, { status: 401 });

    // Superadmin has all access
    if (decoded.type === 1) {
      return NextResponse.json({
        success: true,
        isSuperAdmin: true,
        permissions: ["ALL"],
      });
    }

    if (!decoded.role_id) {
      return NextResponse.json({ success: true, isSuperAdmin: false, permissions: [] });
    }

    // Fetch permissions for this role
    const rolePerms = await prisma.$queryRaw`
      SELECT p.name 
      FROM permissions p
      JOIN role_has_permissions rhp ON p.id = rhp.permission_id
      WHERE rhp.role_id = ${decoded.role_id}
    `;

    const permissions = rolePerms.map(p => p.name);

    return NextResponse.json({
      success: true,
      isSuperAdmin: false,
      permissions
    });

  } catch (error) {
    console.error("My Permissions Fetch Error:", error);
    return NextResponse.json(
      { success: false, isSuperAdmin: false, permissions: [] },
      { status: 500 }
    );
  }
}
