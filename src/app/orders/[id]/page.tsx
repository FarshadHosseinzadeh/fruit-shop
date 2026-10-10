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
    include: { items: true },
  });
  if (!order) notFound();

  const currentIndex = STEPS.indexOf(order.status);

  return (
    <main className="mx-auto max-w-3xl p-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-bold">
          سفارش شماره‌ی {formatOrderNumber(order.id)}
        </h1>
        <span
          className={`rounded-full px-3 py-1 text-xs ${STATUS_STYLE[order.status]}`}
        >
          {STATUS_LABEL[order.status]}
        </span>
      </div>

      <section className="mb-4 rounded-xl border p-4">
        <h2 className="mb-4 font-semibold">وضعیت سفارش</h2>
        <ol className="flex items-start justify-between gap-2">
          {STEPS.map((s, idx) => (
            <li
              key={s}
              className="flex flex-1 flex-col items-center gap-1 text-center"
            >
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm ${
                  idx <= currentIndex
                    ? "bg-green-600 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {idx < currentIndex ? "✓" : (idx + 1).toLocaleString("fa-IR")}
              </span>
              <span
                className={`text-xs ${
                  idx === currentIndex ? "font-bold" : "text-gray-500"
                }`}
              >
                {STATUS_LABEL[s]}
              </span>
            </li>
          ))}
        </ol>
      </section>

      <section className="mb-4 rounded-xl border p-4 text-sm">
        <h2 className="mb-3 font-semibold">اطلاعات سفارش</h2>
        <p>زمان ثبت: {formatCreatedAt(order.createdAt)}</p>
        <p className="mt-1">
          زمان تحویل: {formatDeliveryDay(order.deliveryDate)}، ساعت{" "}
          {order.deliverySlot}
        </p>
        <p className="mt-1">آدرس: {order.address}</p>
        {order.note && <p className="mt-1">توضیحات: {order.note}</p>}
        <p className="mt-1">نحوه‌ی پرداخت: درب منزل (نقدی)</p>
      </section>

      <section className="mb-6 rounded-xl border p-4">
        <h2 className="mb-3 font-semibold">اقلام سفارش</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-gray-600">
              <th className="py-2 text-right">محصول</th>
              <th className="py-2 text-right">مقدار</th>
              <th className="py-2 text-right">قیمت واحد</th>
              <th className="py-2 text-left">جمع</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((i) => (
              <tr key={i.id} className="border-b last:border-0">
                <td className="py-2">{i.productName}</td>
                <td className="py-2">{i.qtyKg.toLocaleString("fa-IR")} کیلو</td>
                <td className="py-2">{i.pricePerKg.toLocaleString("fa-IR")}</td>
                <td className="py-2 text-left">
                  {(i.pricePerKg * i.qtyKg).toLocaleString("fa-IR")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-4 flex items-center justify-between border-t pt-4 text-lg font-bold">
          <span>مبلغ کل</span>
          <span>{order.totalPrice.toLocaleString("fa-IR")} تومان</span>
        </div>
      </section>

      <Link href="/orders" className="text-green-700 underline">
        بازگشت به سفارش‌های من
      </Link>
    </main>
  );
}
