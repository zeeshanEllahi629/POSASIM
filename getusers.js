const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.users.findMany({
    select: { id: true, name: true, type: true, role_id: true }
  });
  console.log(users.map(u => ({ ...u, id: u.id.toString(), role_id: u.role_id ? u.role_id.toString() : null })));
}
main().finally(() => process.exit());
