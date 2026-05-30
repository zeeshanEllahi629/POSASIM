const { PrismaClient } = require("@prisma/client");
const { PrismaPlanetScale } = require("@prisma/adapter-planetscale"); // No wait, adapter-mysql
const { PrismaClient: PrismaClientEdge } = require("@prisma/client/edge"); // No, let's just use adapter-mysql
