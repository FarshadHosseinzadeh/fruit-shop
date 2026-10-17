import Link from "next/link";
import { notFound } from "next/navigation";
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

export const metadata: Metadata = { title: "جزئیات سفارش" };

const STEPS: string[] = ["PENDING", "PREPARING", "ON_THE_WAY", "DELIVERED"];

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireUser();
  const { id } = await params;
  const orderId = Number(id);
  if (!Number.isInteger(orderId)) notFound();

  const order = await prisma.order.findFirst({
    where: { id: orderId, userId: user.id },
    include: {
      items: { include: { product: { select: { slug: true } } } },
    },
  });
  if (!order) notFound();

  const currentIndex = STEPS.indexOf(order.status);

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-extrabold">
          سفارش شماره‌ی {formatOrderNumber(order.id)}
        </h1>
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${STATUS_STYLE[order.status]}`}
        >
          {STATUS_LABEL[order.status]}
        </span>
      </div>

      <section className="mb-4 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
        <h2 className="mb-5 font-extrabold">وضعیت سفارش</h2>
        <ol className="flex">
          {STEPS.map((s, idx) => (
            <li
              key={s}
              className="relative flex flex-1 flex-col items-center gap-2 text-center"
            >
              {idx < STEPS.length - 1 && (
                <span
                  className={`absolute start-1/2 top-4 h-0.5 w-full ${
                    idx < currentIndex ? "bg-green-600" : "bg-stone-200"
                  }`}
                />
              )}
              <span
                className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                  idx < currentIndex
                    ? "bg-green-600 text-white"
                    : idx === currentIndex
                      ? "bg-green-600 text-white ring-4 ring-green-200"
                      : "bg-stone-200 text-stone-500"
                }`}
              >
                {idx < currentIndex ? "✓" : (idx + 1).toLocaleString("fa-IR")}
              </span>
              <span
                className={`text-xs ${
                  idx === currentIndex
                    ? "font-bold text-green-700"
                    : "text-stone-500"
                }`}
              >
                {STATUS_LABEL[s]}
              </span>
            </li>
          ))}
        </ol>
      </section>

      <section className="mb-4 rounded-2xl border border-stone-200 bg-white p-5 text-sm shadow-sm">
        <h2 className="mb-3 font-extrabold">اطلاعات سفارش</h2>
        <dl className="flex flex-col gap-2">
          <div className="flex gap-2">
            <dt className="w-24 shrink-0 text-stone-500">زمان ثبت</dt>
            <dd>{formatCreatedAt(order.createdAt)}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="w-24 shrink-0 text-stone-500">زمان تحویل</dt>
            <dd>
              {formatDeliveryDay(order.deliveryDate)}، ساعت {order.deliverySlot}
            </dd>
          </div>
          <div className="flex gap-2">
            <dt className="w-24 shrink-0 text-stone-500">آدرس</dt>
            <dd>{order.address}</dd>
          </div>
          {order.note && (
            <div className="flex gap-2">
              <dt className="w-24 shrink-0 text-stone-500">توضیحات</dt>
              <dd>{order.note}</dd>
            </div>
          )}
          <div className="flex gap-2">
            <dt className="w-24 shrink-0 text-stone-500">پرداخت</dt>
            <dd>درب منزل (نقدی)</dd>
          </div>
        </dl>
      </section>

      <section className="mb-6 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
        <h2 className="mb-3 font-extrabold">اقلام سفارش</h2>
        <ul className="flex flex-col gap-2 text-sm">
          {order.items.map((i) => (
            <li
              key={i.id}
              className="flex items-center justify-between gap-3 rounded-xl bg-stone-50 p-3"
            >
              <span className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-2xl shadow-sm">
                  {fruitEmoji(i.product.slug)}
                </span>
                <span>
                  <span className="block font-bold">{i.productName}</span>
                  <span className="text-xs text-stone-500">
                    {i.qtyKg.toLocaleString("fa-IR")} کیلو ×{" "}
                    {i.pricePerKg.toLocaleString("fa-IR")}
                  </span>
                </span>
              </span>
              <span className="font-medium">
                {(i.pricePerKg * i.qtyKg).toLocaleString("fa-IR")}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex items-center justify-between border-t border-stone-200 pt-4 text-lg font-extrabold">
          <span>مبلغ کل</span>
          <span className="text-green-700">
            {order.totalPrice.toLocaleString("fa-IR")} تومان
          </span>
        </div>
      </section>

      <Link
        href="/orders"
        className="text-sm font-medium text-green-700 hover:underline"
      >
        ← بازگشت به سفارش‌های من
      </Link>
    </main>
  );
}
