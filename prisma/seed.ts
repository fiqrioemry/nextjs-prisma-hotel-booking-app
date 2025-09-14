import { PrismaClient } from "@prisma/client";
import fs from "fs";

const prisma = new PrismaClient();

async function main() {
  // baca file sql
  const sql = fs.readFileSync("./prisma/seeder.sql", "utf8");
  // execute raw
  await prisma.$executeRawUnsafe(sql);
}

main()
  .then(() => {
    console.log("Seeding selesai ✅");
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
