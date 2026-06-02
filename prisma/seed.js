const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const agents = [
    { name: 'superbuy', displayName: 'Superbuy', websiteUrl: 'https://www.superbuy.com', loginUrl: 'https://www.superbuy.com/en/page/login/' },
    { name: 'cssbuy',   displayName: 'CSSBuy',   websiteUrl: 'https://www.cssbuy.com',   loginUrl: 'https://www.cssbuy.com/user.html' },
    { name: 'sugargoo', displayName: 'Sugargoo', websiteUrl: 'https://www.sugargoo.com', loginUrl: 'https://www.sugargoo.com/#/home/login' },
    { name: 'basetao',  displayName: 'Basetao',  websiteUrl: 'https://www.basetao.com',  loginUrl: 'https://www.basetao.com/user/login' },
    { name: 'yoybuy',   displayName: 'Yoybuy',   websiteUrl: 'https://www.yoybuy.com',   loginUrl: 'https://www.yoybuy.com/user/login' },
    { name: 'bhiner',   displayName: 'Bhiner',   websiteUrl: 'https://www.bhiner.com',   loginUrl: 'https://www.bhiner.com/user/login' },
  ];

  for (const agent of agents) {
    await prisma.sourcingAgent.upsert({
      where: { name: agent.name },
      update: {},
      create: agent
    });
  }
  console.log('Agents seeded!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
