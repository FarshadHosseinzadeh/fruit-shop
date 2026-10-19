import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { STATUS_LABEL, STATUS_STYLE, nextStatus } from "@/lib/orderStatus";
import {
  formatCreatedAt,
  formatDeliveryDay,
  formatOrderNumber,
} from "@/lib/format";
import { fruitEmoji } from "@/lib/fruitEmoji";
import { advanceOrderStatus } from "../actions";
import AdvanceButton from "@/components/admin/AdvanceButton";

export const metadata: Metadata = { title: "جزئیات سفارش (مدیریت)" };
export const dynamic = "force-dynamic";

export default async function AdminOrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();

  const { id } = await params;
  const orderId = Number(id);
  if (!Number.isInteger(orderId)) notFound();

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      user: { select: { name: true, phone: true } },
      items: { include: { product: { select: { slug: true } } } },
    },
  });
  if (!order) notFound();

  const next = nextStatus(order.status);

  return (
    <div>
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
        <h2 className="mb-3 font-extrabold">تغییر وضعیت</h2>
        {next ? (
          <form action={advanceOrderStatus.bind(null, order.id)}>
            <AdvanceButton label={`انتقال به: ${STATUS_LABEL[next]}`} />
          </form>
        ) : order.status === "CANCELLED" ? (
          <p className="text-sm text-red-700">
            این سفارش لغو شده و موجودی آن به انبار برگشته است.
          </p>
        ) : (
          <p className="text-sm text-green-700">
            این سفارش تحویل شده و مرحله‌ی بعدی ندارد.
          </p>
        )}
        <p className="mt-2 text-xs text-stone-500">
          وضعیت فقط یک مرحله به جلو می‌رود و پرش یا برگشت ممکن نیست.
        </p>
      </section>

      <section className="mb-4 rounded-2xl border border-stone-200 bg-white p-5 text-sm shadow-sm">
        <h2 className="mb-3 font-extrabold">اطلاعات سفارش</h2>
        <dl className="flex flex-col gap-2">
          <div className="flex gap-2">
            <dt className="w-24 shrink-0 text-stone-500">مشتری</dt>
            <dd>
              {order.user.name}{" "}
              <span dir="ltr" className="text-stone-500">
                {order.user.phone}
              </span>
            </dd>
          </div>
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
        href="/admin/orders"
        className="text-sm font-medium text-green-700 hover:underline"
      >
        ← بازگشت به سفارش‌ها
      </Link>
    </div>
  );
}
