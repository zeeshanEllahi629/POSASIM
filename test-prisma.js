const { PrismaClient } = require("@prisma/client");
const p = new PrismaClient({});
p.$connect().then(()=>console.log("OK")).catch(console.error);
