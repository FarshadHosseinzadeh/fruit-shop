import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { STATUS_LABEL, STATUS_STYLE } from "@/lib/orderStatus";
import { formatDeliveryDay, formatOrderNumber } from "@/lib/format";
import { fruitEmoji } from "@/lib/fruitEmoji";

export default async function OrderSuccessPage({
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

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-6 rounded-3xl bg-gradient-to-bl from-green-600 via-green-500 to-lime-400 p-8 text-center text-white shadow-sm">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white text-3xl text-green-600">
          ✓
        </span>
        <h1 className="mt-4 text-2xl font-extrabold">سفارش شما ثبت شد</h1>
        <p className="mt-1 text-green-50">
          شماره‌ی سفارش: {formatOrderNumber(order.id)}
        </p>
        <span
          className={`mt-4 inline-block rounded-full px-4 py-1.5 text-xs font-medium ${STATUS_STYLE[order.status]}`}
        >
          {STATUS_LABEL[order.status]}
        </span>
      </div>

      <section className="mb-4 rounded-2xl border border-stone-200 bg-white p-5 text-sm shadow-sm">
        <h2 className="mb-3 font-extrabold">اطلاعات تحویل</h2>
        <dl className="flex flex-col gap-2">
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
          <span>مبلغ قابل پرداخت</span>
          <span className="text-green-700">
            {order.totalPrice.toLocaleString("fa-IR")} تومان
          </span>
        </div>
      </section>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/orders"
          className="rounded-xl bg-green-600 px-6 py-3 font-bold text-white shadow-sm transition hover:bg-green-700 active:scale-95"
        >
          سفارش‌های من
        </Link>
        <Link
          href="/"
          className="rounded-xl border border-stone-300 bg-white px-6 py-3 font-medium text-stone-700 transition hover:border-green-400 hover:text-green-700"
        >
          ادامه‌ی خرید
        </Link>
      </div>
    </main>
  );
}
