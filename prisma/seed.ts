import "dotenv/config";
import { prisma } from "../src/lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  const adminEmail = "admin@example.com";
  const rawPassword = "admin";
  const hashedPassword = await bcrypt.hash(rawPassword, 10);

  const user = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      password: hashedPassword,
    },
    create: {
      email: adminEmail,
      name: "Admin",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log({ user });
  console.log("Seed finished. Login with:", adminEmail, rawPassword);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
