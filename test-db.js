const { PrismaClient } = require('@prisma/client');

async function check(pw) {
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: 'mysql://root:' + pw + '@127.0.0.1:3306/foodefy_code'
      }
    }
  });
  try {
    await prisma.$connect();
    console.log('SUCCESS WITH PASSWORD:', pw);
    process.exit(0);
  } catch(e) {
    // console.log('FAILED:', pw);
  } finally {
    await prisma.$disconnect();
  }
}

async function run() {
  const pws = ['', 'root', 'password', '12345', '123456', '12345678', 'admin', 'admin123'];
  for(let pw of pws) {
    await check(pw);
  }
  console.log('ALL FAILED');
  process.exit(1);
}

run();
