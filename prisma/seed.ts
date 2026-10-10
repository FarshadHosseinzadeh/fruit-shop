import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

const products = [
  { name: "سیب قرمز", slug: "red-apple", pricePerKg: 90000, stockKg: 120 },
  { name: "پرتقال", slug: "orange", pricePerKg: 70000, stockKg: 150 },
  { name: "موز", slug: "banana", pricePerKg: 120000, stockKg: 80 },
  { name: "انگور", slug: "grape", pricePerKg: 110000, stockKg: 60 },
  { name: "انار", slug: "pomegranate", pricePerKg: 100000, stockKg: 90 },
  { name: "کیوی", slug: "kiwi", pricePerKg: 130000, stockKg: 50 },
  { name: "خرمالو", slug: "persimmon", pricePerKg: 80000, stockKg: 70 },
  { name: "نارنگی", slug: "mandarin", pricePerKg: 65000, stockKg: 140 },
  { name: "گلابی", slug: "pear", pricePerKg: 95000, stockKg: 100 },
  { name: "هلو", slug: "peach", pricePerKg: 115000, stockKg: 40 },
];

async function main() {
  for (const p of products) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: p,
      create: p,
    });
  }
  console.log(`Seeded ${products.length} products`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
