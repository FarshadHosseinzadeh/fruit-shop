"use client";

import Link from "next/link";
import { useCart } from "@/store/cart";
import { useMounted } from "@/lib/useMounted";

export default function CartPage() {
  const mounted = useMounted();
  const items = useCart((s) => s.items);
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);

  const total = items.reduce((sum, i) => sum + i.pricePerKg * i.qtyKg, 0);

  if (!mounted) {
    return <main className="mx-auto max-w-3xl p-6">در حال بارگذاری...</main>;
  }

  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-3xl p-6">
        <h1 className="mb-4 text-2xl font-bold">سبد خرید</h1>
        <p className="mb-4">سبد خرید شما خالی است.</p>
        <Link href="/" className="text-green-700 underline">
          بازگشت به محصولات
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="mb-6 text-2xl font-bold">سبد خرید</h1>
      <ul className="flex flex-col gap-3">
        {items.map((i) => (
          <li
            key={i.productId}
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border p-4"
          >
            <div>
              <h2 className="font-semibold">{i.name}</h2>
              <p className="text-sm text-gray-600">
                {i.pricePerKg.toLocaleString("fa-IR")} تومان / کیلو
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setQty(i.productId, i.qtyKg - 1)}
                disabled={i.qtyKg <= 1}
                className="h-8 w-8 rounded-lg border disabled:opacity-40"
              >
                −
              </button>
              <span className="min-w-16 text-center">
                {i.qtyKg.toLocaleString("fa-IR")} کیلو
              </span>
              <button
                type="button"
                onClick={() => setQty(i.productId, i.qtyKg + 1)}
                className="h-8 w-8 rounded-lg border"
              >
                +
              </button>
            </div>

            <div className="flex items-center gap-4">
              <span className="font-medium">
                {(i.pricePerKg * i.qtyKg).toLocaleString("fa-IR")} تومان
              </span>
              <button
                type="button"
                onClick={() => remove(i.productId)}
                className="text-sm text-red-600"
              >
                حذف
              </button>
            </div>
          </li>
        ))}
      </ul>

      <section className="mt-6 rounded-xl border p-4">
        <h2 className="mb-3 font-semibold">جزئیات فاکتور</h2>
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
            {items.map((i) => (
              <tr key={i.productId} className="border-b last:border-0">
                <td className="py-2">{i.name}</td>
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
          <span>{total.toLocaleString("fa-IR")} تومان</span>
        </div>

        <Link
          href="/checkout"
          className="mt-4 block rounded-lg bg-green-600 py-3 text-center text-white"
        >
          ادامه و ثبت سفارش
        </Link>
      </section>
    </main>
  );
}
