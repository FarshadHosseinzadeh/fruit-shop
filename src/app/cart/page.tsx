"use client";

import Link from "next/link";
import { useCart } from "@/store/cart";
import { useMounted } from "@/lib/useMounted";
import { fruitEmoji } from "@/lib/fruitEmoji";

const stepBtn =
  "flex h-8 w-8 items-center justify-center rounded-full text-lg font-bold transition";
const stepOn =
  "bg-white text-green-700 shadow-sm ring-1 ring-green-300 hover:bg-green-600 hover:text-white active:scale-90";
const stepOff =
  "cursor-not-allowed bg-stone-200 text-stone-400 ring-1 ring-stone-300";

export default function CartPage() {
  const mounted = useMounted();
  const items = useCart((s) => s.items);
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);
  const clear = useCart((s) => s.clear);

  const total = items.reduce((sum, i) => sum + i.pricePerKg * i.qtyKg, 0);
  const totalKg = items.reduce((sum, i) => sum + i.qtyKg, 0);

  if (!mounted) {
    return (
      <main className="mx-auto max-w-6xl p-6 text-stone-500">
        در حال بارگذاری...
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-16">
        <div className="mx-auto max-w-md rounded-3xl border border-stone-200 bg-white p-10 text-center shadow-sm">
          <div className="text-6xl">🛒</div>
          <h1 className="mt-4 text-xl font-extrabold">سبد خرید شما خالی است</h1>
          <p className="mt-2 text-sm text-stone-500">
            از میان میوه‌های تازه انتخاب کنید و به سبد اضافه کنید.
          </p>
          <Link
            href="/"
            className="mt-6 inline-block rounded-full bg-green-600 px-6 py-3 font-medium text-white transition hover:bg-green-700"
          >
            مشاهده‌ی محصولات
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-2 flex items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold">
          سبد خرید{" "}
          <span className="text-base font-medium text-stone-400">
            ({items.length.toLocaleString("fa-IR")} قلم)
          </span>
        </h1>
        <button
          type="button"
          onClick={() => clear()}
          className="rounded-full px-3 py-1.5 text-sm text-stone-400 transition hover:bg-red-50 hover:text-red-600"
        >
          خالی کردن سبد
        </button>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-x-4 gap-y-1 rounded-2xl bg-green-50 px-4 py-3 text-sm text-green-800">
        <span>🚚 تحویل امروز و فردا</span>
        <span>💵 پرداخت درب منزل</span>
        <span>🌿 میوه‌ی تازه</span>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <ul className="flex flex-col gap-3 lg:col-span-2">
          {items.map((i) => (
            <li
              key={i.productId}
              className="flex flex-wrap items-center gap-4 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm transition hover:shadow-md"
            >
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-green-50 to-lime-100 text-3xl">
                {fruitEmoji(i.slug)}
              </span>

              <div className="min-w-0 flex-1">
                <h2 className="font-bold">{i.name}</h2>
                <p className="text-sm text-stone-500">
                  {i.pricePerKg.toLocaleString("fa-IR")} تومان / کیلو
                </p>
              </div>

              <div className="flex items-center gap-1 rounded-full border border-stone-200 bg-stone-100 p-1">
                <button
                  type="button"
                  onClick={() => setQty(i.productId, i.qtyKg - 1)}
                  disabled={i.qtyKg <= 1}
                  aria-label="کم کردن"
                  className={`${stepBtn} ${i.qtyKg <= 1 ? stepOff : stepOn}`}
                >
                  −
                </button>
                <span className="min-w-14 text-center text-sm font-medium">
                  {i.qtyKg.toLocaleString("fa-IR")} کیلو
                </span>
                <button
                  type="button"
                  onClick={() => setQty(i.productId, i.qtyKg + 1)}
                  aria-label="زیاد کردن"
                  className={`${stepBtn} ${stepOn}`}
                >
                  +
                </button>
              </div>

              <div className="flex w-full items-center justify-between gap-4 sm:w-auto sm:justify-end">
                <span className="font-extrabold text-green-700">
                  {(i.pricePerKg * i.qtyKg).toLocaleString("fa-IR")} تومان
                </span>
                <button
                  type="button"
                  onClick={() => remove(i.productId)}
                  className="rounded-full px-3 py-1.5 text-sm text-stone-400 transition hover:bg-red-50 hover:text-red-600"
                >
                  حذف
                </button>
              </div>
            </li>
          ))}
        </ul>

        <aside className="h-fit rounded-2xl border border-stone-200 bg-white p-5 shadow-sm lg:sticky lg:top-24">
          <h2 className="mb-4 font-extrabold">جزئیات فاکتور</h2>

          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-stone-200 text-stone-500">
                <th className="py-2 text-right font-medium">محصول</th>
                <th className="py-2 text-right font-medium">مقدار</th>
                <th className="py-2 text-left font-medium">جمع</th>
              </tr>
            </thead>
            <tbody>
              {items.map((i) => (
                <tr key={i.productId} className="border-b border-stone-100">
                  <td className="py-2">{i.name}</td>
                  <td className="py-2">
                    {i.qtyKg.toLocaleString("fa-IR")} کیلو
                  </td>
                  <td className="py-2 text-left">
                    {(i.pricePerKg * i.qtyKg).toLocaleString("fa-IR")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-4 flex items-center justify-between text-sm text-stone-500">
            <span>مجموع وزن</span>
            <span>{totalKg.toLocaleString("fa-IR")} کیلو</span>
          </div>
          <div className="mt-2 flex items-center justify-between border-t border-stone-200 pt-4 text-lg font-extrabold">
            <span>مبلغ قابل پرداخت</span>
            <span className="text-green-700">
              {total.toLocaleString("fa-IR")} تومان
            </span>
          </div>

          <Link
            href="/checkout"
            className="mt-5 block rounded-xl bg-green-600 py-3 text-center font-bold text-white shadow-sm transition hover:bg-green-700 active:scale-95"
          >
            ادامه و ثبت سفارش
          </Link>
          <Link
            href="/"
            className="mt-2 block rounded-xl py-2 text-center text-sm text-stone-500 transition hover:text-green-700"
          >
            ادامه‌ی خرید
          </Link>
        </aside>
      </div>
    </main>
  );
}
