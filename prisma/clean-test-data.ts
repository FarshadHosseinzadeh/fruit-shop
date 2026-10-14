import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

async function main() {
  if (process.argv[2] !== "--yes") {
    const [orders, users] = await Promise.all([
      prisma.order.count(),
      prisma.user.count(),
    ]);
    console.log(
      `Would delete ${orders} orders and ${users} users. Re-run with --yes to confirm.`,
    );
    return;
  }

  const items = await prisma.orderItem.deleteMany();
  const orders = await prisma.order.deleteMany();
  const users = await prisma.user.deleteMany();
  console.log(
    `Deleted ${items.count} order items, ${orders.count} orders, ${users.count} users`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
