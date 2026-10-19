"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { nextStatus } from "@/lib/orderStatus";

export async function advanceOrderStatus(orderId: number) {
  await requireAdmin();

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: { status: true },
  });
  if (!order) return;

  const next = nextStatus(order.status);
  if (!next) return;

  // فقط اگر وضعیت هنوز همان است، تا دابل‌کلیک یک مرحله را نپراند
  await prisma.order.updateMany({
    where: { id: orderId, status: order.status },
    data: { status: next },
  });

  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath("/admin/orders");
  revalidatePath("/admin");
}
