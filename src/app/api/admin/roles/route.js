import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const roles = await prisma.roles.findMany({
      orderBy: { id: "desc" }
    });
    const serialized = JSON.parse(JSON.stringify(roles, (k, v) => typeof v === 'bigint' ? v.toString() : v));
    return NextResponse.json({ status: 1, roles: serialized }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ status: 0, error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const data = await req.json();
    const { name, permissions } = data;

    if (!name) {
      return NextResponse.json({ status: 0, error: "Role name is required" }, { status: 400 });
    }

    const result = await prisma.$transaction(async (tx) => {
      // 1. Create the role
      const role = await tx.roles.create({
        data: {
          name: name.toLowerCase(),
          label: name,
          guard_name: "web",
          created_at: new Date(),
          updated_at: new Date()
        }
      });

      // 2. Ensure all permissions exist in the permissions table (or create them)
      // Then attach them in role_has_permissions
      if (permissions && permissions.length > 0) {
        for (const permName of permissions) {
          // Find or create permission
          let permission = await tx.permissions.findFirst({ where: { name: permName } });
          if (!permission) {
            permission = await tx.permissions.create({
              data: { name: permName, guard_name: "web" }
            });
          }
          
          // Attach
          await tx.role_has_permissions.create({
            data: {
              permission_id: permission.id,
              role_id: role.id
            }
          });
        }
      }

      return role;
    });

    const serialized = JSON.parse(JSON.stringify(result, (k, v) => typeof v === 'bigint' ? v.toString() : v));
    return NextResponse.json({ status: 1, message: "Role created successfully", role: serialized }, { status: 201 });
  } catch (error) {
    console.error("POST Role Error:", error);
    return NextResponse.json({ status: 0, error: "Internal Server Error: " + error.message }, { status: 500 });
  }
}
