"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

const SLOT_START: Record<string, number> = {
  "۹ تا ۱۲": 9,
  "۱۲ تا ۱۵": 12,
  "۱۵ تا ۱۸": 15,
  "۱۸ تا ۲۱": 18,
};
const MIN_LEAD_HOURS = 3;
const HOUR_MS = 60 * 60 * 1000;

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

// ساعت دیواری تهران، به‌صورت میلی‌ثانیه‌ی UTC برای مقایسه‌ی ساده
function tehranNowMs() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Tehran",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());
  const get = (t: string) => Number(parts.find((p) => p.type === t)!.value);
  return Date.UTC(
    get("year"),
    get("month") - 1,
    get("day"),
    get("hour"),
    get("minute"),
  );
}

function isoDay(ms: number) {
  return new Date(ms).toISOString().slice(0, 10);
}

export async function placeOrder(
  input: PlaceOrderInput,
): Promise<PlaceOrderResult> {
  const user = await requireUser();

  const parsed = schema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }
  const { items, deliveryDate, deliverySlot, address, note } = parsed.data;

  // قانون روز و بازه
  const nowMs = tehranNowMs();
  const allowedDays = [isoDay(nowMs), isoDay(nowMs + 24 * HOUR_MS)];
  const startHour = SLOT_START[deliverySlot];
  if (!allowedDays.includes(deliveryDate) || startHour === undefined) {
    return { error: "روز یا بازه‌ی تحویل معتبر نیست" };
  }
  const [y, m, d] = deliveryDate.split("-").map(Number);
  const slotStartMs = Date.UTC(y, m - 1, d, startHour);
  if (slotStartMs < nowMs + MIN_LEAD_HOURS * HOUR_MS) {
    return {
      error: "این بازه دیگر قابل رزرو نیست، بازه‌ی دیگری انتخاب کنید",
    };
  }

  // محصولات از دیتابیس
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
