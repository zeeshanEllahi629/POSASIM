require("dotenv").config();
const { PrismaClient } = require("../src/generated/prisma/client");
const { PrismaMariaDb } = require("../node_modules/@prisma/adapter-mariadb");
const mariadb = require("../node_modules/mariadb");

const dbUrl = process.env.DATABASE_URL || "mysql://root:@127.0.0.1:3306/foodefy_code";
console.log("Raw DATABASE_URL from env:", JSON.stringify(dbUrl));

// Clean quotes and spaces
const cleanDbUrl = dbUrl.replace(/^["']|["']$/g, "").trim();
console.log("Cleaned DATABASE_URL:", JSON.stringify(cleanDbUrl));

// Convert connection string
const connectionString = cleanDbUrl.replace(/^mysql:/, "mariadb:").replace(/:@/, "@");
console.log("Final Connection String for MariaDB:", JSON.stringify(connectionString));

try {
  const pool = mariadb.createPool(connectionString);
  const adapter = new PrismaMariaDb(pool);
  const prisma = new PrismaClient({ adapter });

  console.log("Connecting to database...");
  prisma.categories.findMany({
    where: { is_deleted: 2 },
    take: 5
  })
  .then(categories => {
    console.log("Successfully retrieved categories:", categories.length);
    console.log(categories);
    pool.end();
  })
  .catch(err => {
    console.error("Prisma query failed:", err);
    pool.end();
  });
} catch (e) {
  console.error("Setup failed:", e);
}
