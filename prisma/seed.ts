import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

async function main() {
  const password = "StrongPass123!"; // password sama untuk semua user
  const hashedPassword = await bcrypt.hash(password, 10);

  // Buat admin
  const admin = await db.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      id: "admin-user-id-001",
      name: "Admin User",
      email: "admin@example.com",
      emailVerified: true,
      image:
        "https://ui-avatars.com/api/?name=Admin&background=random&color=fff",
      role: "ADMIN",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  await db.account.upsert({
    where: { id: "admin-account-id-001" },
    update: {},
    create: {
      id: "admin-account-id-001",
      accountId: admin.id,
      providerId: "credential",
      userId: admin.id,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  // Buat 4 user biasa
  const users = await Promise.all(
    [1, 2, 3, 4].map(async (i) => {
      const user = await db.user.upsert({
        where: { email: `user${i}@example.com` },
        update: {},
        create: {
          id: `user-id-00${i}`,
          name: `User ${i}`,
          email: `user${i}@example.com`,
          emailVerified: true,
          image: `https://ui-avatars.com/api/?name=User+${i}&background=random&color=fff`,
          role: "USER",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      await db.account.upsert({
        where: { id: `user-account-id-00${i}` },
        update: {},
        create: {
          id: `user-account-id-00${i}`,
          accountId: user.id,
          providerId: "credential",
          userId: user.id,
          password: hashedPassword,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      return user;
    })
  );

  console.log("✅ Seeding selesai!");
  console.log("Admin login: admin@example.com /", password);
  users.forEach((u, idx) =>
    console.log(`User${idx + 1} login: ${u.email} / ${password}`)
  );
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
