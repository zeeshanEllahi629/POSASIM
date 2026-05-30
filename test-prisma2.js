require('dotenv').config();
const { PrismaClient } = require("@prisma/client");
const { PrismaMariaDb } = require("@prisma/adapter-mariadb");
const { createPool } = require("mariadb");

const pool = createPool({
  host: '127.0.0.1',
  port: 3306,
  user: 'root',
  password: '',
  database: 'foodefy_code',
  connectionLimit: 10,
});

console.log("Pool user is:", pool.options ? pool.options.user : "unknown");

const adapter = new PrismaMariaDb(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  try {
    const res = await prisma.$queryRaw`SELECT 1 as result`;
    console.log("Success:", res);
  } catch (err) {
    console.error("Prisma error:", err);
  } finally {
    await pool.end();
  }
}
main();
