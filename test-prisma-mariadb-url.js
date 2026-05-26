require('dotenv').config();
const { PrismaClient } = require("@prisma/client");
const { PrismaMariaDb } = require("@prisma/adapter-mariadb");
const { createPool } = require("mariadb");

// Use explicit mariadb:// connection string to prevent any fallback to OS user
const pool = createPool("mariadb://root:@127.0.0.1:3306/foodefy_code");

const adapter = new PrismaMariaDb(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  try {
    const res = await prisma.users.findFirst({ where: { email: 'admin@gmail.com' } });
    console.log("Success:", res ? res.email : "Not found");
  } catch (err) {
    console.error("Prisma error:", err);
  } finally {
    await pool.end();
  }
}
main();
