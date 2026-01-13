import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Create a Ministry first
  const ministry = await prisma.ministry.upsert({
    where: { name: "Ministry of Health" },
    update: {},
    create: {
      name: "Ministry of Health",
      description: "Handles national health policies and programs.",
      contact_email: "health@somaliland.gov",
      contact_phone: "+252 63 4000000",
    },
  });

  // Create Admin user
  const adminPassword = await bcrypt.hash("admin123", 10);
  await prisma.user.upsert({
    where: { username: "SCPE admin" },
    update: {},
    create: {
      username: "SCPE Admin",
      email: "admin@govsl.org",
      password_hash: adminPassword,
      role: "Admin",
    },
  });

  // Create Ministry user
  const ministryPassword = await bcrypt.hash("ministry321", 10);
  await prisma.user.upsert({
    where: { username: "Ministry Health User" },
    update: {},
    create: {
      username: "Ministry Health User",
      email: "ministry@health.govsl.org",
      password_hash: ministryPassword,
      role: "MinistryUser",
      ministry_id: ministry.ministry_id,
    },
  });

  console.log("✅ Seeded Admin and Ministry users successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
