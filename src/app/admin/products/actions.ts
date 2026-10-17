"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

const schema = z.object({
  id: z.coerce.number().int().positive(),
  pricePerKg: z.coerce.number().int().min(1000).max(100_000_000),
  stockKg: z.coerce.number().int().min(0).max(100_000),
  isActive: z.boolean(),
});

export async function updateProduct(formData: FormData) {
  await requireAdmin();

  const parsed = schema.safeParse({
    id: formData.get("id"),
    pricePerKg: formData.get("pricePerKg"),
    stockKg: formData.get("stockKg"),
    isActive: formData.get("isActive") === "on",
  });
  if (!parsed.success) return;

  const { id, ...data } = parsed.data;
  await prisma.product.update({ where: { id }, data });

  revalidatePath("/admin/products");
  revalidatePath("/");
}
