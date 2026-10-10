import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

const FLOW = ["PENDING", "PREPARING", "ON_THE_WAY", "DELIVERED"] as const;
type Status = (typeof FLOW)[number];

async function main() {
  const [idArg, statusArg, flag] = process.argv.slice(2);
  const id = Number(idArg);
  const next = statusArg as Status;

  if (!Number.isInteger(id) || !FLOW.includes(next)) {
    console.error(
      "Usage: tsx prisma/set-status.ts <orderId> <PENDING|PREPARING|ON_THE_WAY|DELIVERED> [--reset]",
    );
    process.exit(1);
  }

  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) {
    console.error(`Order ${id} not found`);
    process.exit(1);
  }

  const from = FLOW.indexOf(order.status as Status);
  const to = FLOW.indexOf(next);

  if (flag !== "--reset" && to !== from + 1) {
    console.error(
      `Not allowed: ${order.status} -> ${next}. Next allowed: ${FLOW[from + 1] ?? "none (already delivered)"}`,
    );
    process.exit(1);
  }

  const updated = await prisma.order.update({
    where: { id },
    data: { status: next },
  });
  console.log(`Order ${updated.id}: ${order.status} -> ${updated.status}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
