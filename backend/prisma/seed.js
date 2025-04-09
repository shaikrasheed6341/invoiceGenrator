// prisma/seed.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.quotation.create({
    data: {
      id: 999,
      customerName: "Test User",
      amount: 1000,
    },
  });
}

main().catch((e) => console.error(e)).finally(() => prisma.$disconnect());