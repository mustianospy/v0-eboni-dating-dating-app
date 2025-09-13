import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const rows: Array<{ id: string; email: string }> =
    await prisma.$queryRawUnsafe(`
    SELECT id, email FROM auth.users
  `);

  for (const u of rows) {
    await prisma.user.upsert({
      where: { id: u.id },
      update: {},
      create: {
        id: u.id,
        email: u.email,
        name: null,
        coins: 10, // default bonus for new users
      },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
