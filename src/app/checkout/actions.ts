"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { tehranNowMs, validateDelivery } from "@/lib/delivery";

const schema = z.object({
  items: z
    .array(
      z.object({
        productId: z.number().int().positive(),
        qtyKg: z.number().int().min(1).max(100),
      }),
    )
    .min(1, "سبد خرید خالی است"),
  deliveryDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "روز تحویل نامعتبر است"),
  deliverySlot: z.string(),
  address: z.string().trim().min(10, "آدرس را کامل‌تر وارد کنید"),
  note: z.string().trim().max(300).optional(),
});

export type PlaceOrderInput = z.infer<typeof schema>;
export type PlaceOrderResult = { error: string } | { orderId: number };

class OrderError extends Error {}

export async function placeOrder(
  input: PlaceOrderInput,
): Promise<PlaceOrderResult> {
  const user = await requireUser();

  const parsed = schema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }
  const { items, deliveryDate, deliverySlot, address, note } = parsed.data;

  const delivery = validateDelivery(tehranNowMs(), deliveryDate, deliverySlot);
  if (!delivery.ok) {
    return { error: delivery.error };
  }

  const ids = items.map((i) => i.productId);
  if (new Set(ids).size !== ids.length) {
    return { error: "سبد خرید نامعتبر است" };
  }
  const products = await prisma.product.findMany({
    where: { id: { in: ids }, isActive: true },
  });
  if (products.length !== ids.length) {
    return { error: "یکی از محصولات سبد دیگر موجود نیست" };
  }
  const byId = new Map(products.map((p) => [p.id, p]));
  const totalPrice = items.reduce(
    (sum, i) => sum + byId.get(i.productId)!.pricePerKg * i.qtyKg,
    0,
  );

  try {
    const order = await prisma.$transaction(
      async (tx) => {
        for (const it of items) {
          const res = await tx.product.updateMany({
            where: {
              id: it.productId,
              isActive: true,
              stockKg: { gte: it.qtyKg },
            },
            data: { stockKg: { decrement: it.qtyKg } },
          });
          if (res.count === 0) {
            throw new OrderError(
              `موجودی «${byId.get(it.productId)!.name}» کافی نیست`,
            );
          }
        }

        return tx.order.create({
          data: {
            userId: user.id,
            totalPrice,
            deliveryDate,
            deliverySlot,
            address,
            note: note || null,
            items: {
              create: items.map((it) => ({
                productId: it.productId,
                productName: byId.get(it.productId)!.name,
                pricePerKg: byId.get(it.productId)!.pricePerKg,
                qtyKg: it.qtyKg,
              })),
            },
          },
        });
      },
      { maxWait: 10_000, timeout: 15_000 },
    );
    return { orderId: order.id };
  } catch (e) {
    if (e instanceof OrderError) return { error: e.message };
    console.error(e);
    return { error: "خطا در ثبت سفارش، دوباره تلاش کنید" };
  }
}
