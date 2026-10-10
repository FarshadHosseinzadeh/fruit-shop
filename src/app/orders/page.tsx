import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { STATUS_LABEL, STATUS_STYLE } from "@/lib/orderStatus";
import {
  formatCreatedAt,
  formatDeliveryDay,
  formatOrderNumber,
} from "@/lib/format";

export default async function OrdersPage() {
  const user = await requireUser();

  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });

  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="mb-6 text-2xl font-bold">سفارش‌های من</h1>

      {orders.length === 0 ? (
        <div>
          <p className="mb-4">هنوز سفارشی ثبت نکرده‌اید.</p>
          <Link href="/" className="text-green-700 underline">
            مشاهده‌ی محصولات
          </Link>
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {orders.map((o) => (
            <li key={o.id} className="rounded-xl border p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="font-semibold">
                  سفارش شماره‌ی {formatOrderNumber(o.id)}
                </h2>
                <span
                  className={`rounded-full px-3 py-1 text-xs ${STATUS_STYLE[o.status]}`}
                >
                  {STATUS_LABEL[o.status]}
                </span>
              </div>

              <p className="mt-2 text-sm text-gray-600">
                ثبت‌شده در {formatCreatedAt(o.createdAt)}
              </p>
              <p className="mt-1 text-sm">
                تحویل: {formatDeliveryDay(o.deliveryDate)}، ساعت{" "}
                {o.deliverySlot}
              </p>
              <p className="mt-1 text-sm">
                {o.items.length.toLocaleString("fa-IR")} قلم، مبلغ:{" "}
                {o.totalPrice.toLocaleString("fa-IR")} تومان
              </p>

              <Link
                href={`/orders/${o.id}`}
                className="mt-3 inline-block text-sm text-green-700 underline"
              >
                مشاهده‌ی جزئیات
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
