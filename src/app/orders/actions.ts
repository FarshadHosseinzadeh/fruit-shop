"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

export type CancelResult = { error: string } | { ok: true };

class CancelError extends Error {}

export async function cancelOrder(orderId: number): Promise<CancelResult> {
  const user = await requireUser();
  if (!Number.isInteger(orderId)) return { error: "سفارش نامعتبر است" };

  try {
    await prisma.$transaction(
      async (tx) => {
        // فقط سفارش خودِ کاربر و فقط تا وقتی هنوز در انتظار تأیید است
        const res = await tx.order.updateMany({
          where: { id: orderId, userId: user.id, status: "PENDING" },
          data: { status: "CANCELLED" },
        });
        if (res.count === 0) throw new CancelError();

        const items = await tx.orderItem.findMany({
          where: { orderId },
          select: { productId: true, qtyKg: true },
        });
        for (const it of items) {
          await tx.product.update({
            where: { id: it.productId },
            data: { stockKg: { increment: it.qtyKg } },
          });
        }
      },
      { maxWait: 10_000, timeout: 15_000 },
    );
  } catch (e) {
    if (e instanceof CancelError) {
      return { error: "این سفارش دیگر قابل لغو نیست" };
    }
    console.error(e);
    return { error: "خطا در لغو سفارش، دوباره تلاش کنید" };
  }

  revalidatePath("/orders");
  revalidatePath(`/orders/${orderId}`);
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/orders");
  return { ok: true };
}
