const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const roles = await prisma.manage_roles.findMany();
  console.log("Roles:", roles);
}
main().finally(() => process.exit());
