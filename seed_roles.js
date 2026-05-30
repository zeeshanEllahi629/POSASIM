const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const rolesToCreate = [
    { name: "Super Admin", titles: "Super Admin", modules: "all", is_available: true },
    { name: "Business Owner", titles: "Business Owner", modules: "dashboard,reports", is_available: true },
    { name: "Marketing Manager", titles: "Marketing Manager", modules: "marketing,dashboard", is_available: true },
    { name: "Sourcing Manager", titles: "Sourcing Manager", modules: "sourcing,suppliers", is_available: true },
    { name: "Logistics Manager", titles: "Logistics Manager", modules: "logistics", is_available: true },
    { name: "Sales Manager", titles: "Sales Manager", modules: "marketplaces,orders", is_available: true },
    { name: "Customer Support Agent", titles: "Customer Support Agent", modules: "orders,customers", is_available: true }
  ];

  for (const role of rolesToCreate) {
    const existing = await prisma.manage_roles.findFirst({ where: { name: role.name } });
    if (!existing) {
      await prisma.manage_roles.create({ data: role });
      console.log(`Created role: ${role.name}`);
    } else {
      console.log(`Role ${role.name} already exists.`);
    }
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
