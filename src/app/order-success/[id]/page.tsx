import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { STATUS_LABEL, STATUS_STYLE } from "@/lib/orderStatus";

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
    include: { items: true },
  });
  if (!order) notFound();

  const deliveryDay = new Date(
    `${order.deliveryDate}T00:00:00Z`,
  ).toLocaleDateString("fa-IR", {
    timeZone: "UTC",
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <main className="mx-auto max-w-3xl p-6">
      <div className="mb-6 rounded-xl bg-green-50 p-5 text-center">
        <p className="text-4xl">✅</p>
        <h1 className="mt-2 text-2xl font-bold">سفارش شما ثبت شد</h1>
        <p className="mt-1 text-sm text-gray-600">
          شماره‌ی سفارش:{" "}
          {order.id.toLocaleString("fa-IR", { useGrouping: false })}
        </p>
        <span
          className={`mt-3 inline-block rounded-full px-3 py-1 text-xs ${STATUS_STYLE[order.status]}`}
        >
          {STATUS_LABEL[order.status]}
        </span>
      </div>

      <section className="mb-4 rounded-xl border p-4 text-sm">
        <h2 className="mb-3 font-semibold">اطلاعات تحویل</h2>
        <p>
          زمان تحویل: {deliveryDay}، ساعت {order.deliverySlot}
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
          <span>مبلغ قابل پرداخت</span>
          <span>{order.totalPrice.toLocaleString("fa-IR")} تومان</span>
        </div>
      </section>

      <Link href="/" className="text-green-700 underline">
        بازگشت به محصولات
      </Link>
    </main>
  );
}
