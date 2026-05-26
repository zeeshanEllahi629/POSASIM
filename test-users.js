const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.users.findMany();
  console.log(users.map(u => ({ email: u.email, role_id: u.role_id, password: u.password })));
}

main().catch(console.error).finally(() => prisma.$disconnect());
