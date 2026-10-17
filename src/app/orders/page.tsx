import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { STATUS_LABEL, STATUS_STYLE } from "@/lib/orderStatus";
import {
  formatCreatedAt,
  formatDeliveryDay,
  formatOrderNumber,
} from "@/lib/format";
import { fruitEmoji } from "@/lib/fruitEmoji";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "سفارش‌های من" };

export default async function OrdersPage() {
  const user = await requireUser();

  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: {
      items: { include: { product: { select: { slug: true } } } },
    },
  });

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-extrabold">سفارش‌های من</h1>

      {orders.length === 0 ? (
        <div className="rounded-3xl border border-stone-200 bg-white p-10 text-center shadow-sm">
          <div className="text-6xl">📦</div>
          <h2 className="mt-4 text-xl font-extrabold">
            هنوز سفارشی ثبت نکرده‌اید
          </h2>
          <p className="mt-2 text-sm text-stone-500">
            اولین سفارش میوه‌ی تازه‌تان را ثبت کنید.
          </p>
          <Link
            href="/"
            className="mt-6 inline-block rounded-full bg-green-600 px-6 py-3 font-medium text-white transition hover:bg-green-700"
          >
            مشاهده‌ی محصولات
          </Link>
        </div>
      ) : (
        <ul className="flex flex-col gap-4">
          {orders.map((o) => (
            <li key={o.id}>
              <Link
                href={`/orders/${o.id}`}
                className="block rounded-2xl border border-stone-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="font-extrabold">
                    سفارش شماره‌ی {formatOrderNumber(o.id)}
                  </h2>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${STATUS_STYLE[o.status]}`}
                  >
                    {STATUS_LABEL[o.status]}
                  </span>
                </div>

                <p className="mt-1 text-xs text-stone-500">
                  ثبت‌شده در {formatCreatedAt(o.createdAt)}
                </p>

                <div className="mt-3 flex items-center gap-2">
                  {o.items.slice(0, 5).map((i) => (
                    <span
                      key={i.id}
                      className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-2xl"
                    >
                      {fruitEmoji(i.product.slug)}
                    </span>
                  ))}
                  {o.items.length > 5 && (
                    <span className="text-xs text-stone-500">
                      +{(o.items.length - 5).toLocaleString("fa-IR")}
                    </span>
                  )}
                </div>

                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-stone-100 pt-3 text-sm">
                  <span className="text-stone-600">
                    🚚 {formatDeliveryDay(o.deliveryDate)}، ساعت{" "}
                    {o.deliverySlot}
                  </span>
                  <span className="font-extrabold text-green-700">
                    {o.totalPrice.toLocaleString("fa-IR")} تومان
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
