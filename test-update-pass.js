const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  await prisma.users.updateMany({
    where: { email: 'admin@gmail.com' },
    data: { 
      password: '$2a$10$b6tg0HT40ufQqb91CVKbQergK96Aszcp8SMK/77gniglUQGxIlJFG',
      role_id: 1,
      type: 1
    }
  });
  console.log("Updated!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
