const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "mysql://root@localhost:3306/foodefy_code"
    }
  }
});

async function main() {
  console.time("Prisma Query");
  const users = await prisma.users.findMany();
  console.timeEnd("Prisma Query");
}

main().catch(console.error).finally(() => prisma.$disconnect());
