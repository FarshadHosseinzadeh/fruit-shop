"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/store/cart";
import { useMounted } from "@/lib/useMounted";
import { placeOrder } from "./actions";

const SLOTS = [
  { label: "۹ تا ۱۲", start: 9 },
  { label: "۱۲ تا ۱۵", start: 12 },
  { label: "۱۵ تا ۱۸", start: 15 },
  { label: "۱۸ تا ۲۱", start: 18 },
];
const MIN_LEAD_HOURS = 3;

function toValue(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function buildOptions() {
  const now = new Date();
  const earliest = now.getTime() + MIN_LEAD_HOURS * 60 * 60 * 1000;
  const result: {
    value: string;
    label: string;
    date: string;
    slots: string[];
  }[] = [];

  for (let n = 0; n <= 1; n++) {
    const day = new Date(now.getFullYear(), now.getMonth(), now.getDate() + n);
    const slots = SLOTS.filter((s) => {
      const start = new Date(
        day.getFullYear(),
        day.getMonth(),
        day.getDate(),
        s.start,
      ).getTime();
      return start >= earliest;
    }).map((s) => s.label);

    if (slots.length > 0) {
      result.push({
        value: toValue(day),
        label: n === 0 ? "امروز" : "فردا",
        date: day.toLocaleDateString("fa-IR", {
          month: "long",
          day: "numeric",
        }),
        slots,
      });
    }
  }
  return result;
}

const inputClass =
  "w-full rounded-xl border border-stone-300 bg-white p-3 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-200";

function SectionTitle({
  n,
  children,
}: {
  n: string;
  children: React.ReactNode;
}) {
  return (
    <h2 className="mb-4 flex items-center gap-2 font-extrabold">
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-green-600 text-sm text-white">
        {n}
      </span>
      {children}
    </h2>
  );
}

export default function CheckoutForm() {
  const mounted = useMounted();
  const items = useCart((s) => s.items);
  const clear = useCart((s) => s.clear);
  const router = useRouter();
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

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

  const options = buildOptions();
  const selectedDay = options.find((o) => o.value === date) ?? options[0];
  const selectedSlot = selectedDay.slots.includes(slot)
    ? slot
    : selectedDay.slots[0];
  const total = items.reduce((sum, i) => sum + i.pricePerKg * i.qtyKg, 0);

  function submit() {
    setError("");
    startTransition(async () => {
      const res = await placeOrder({
        items: items.map((i) => ({ productId: i.productId, qtyKg: i.qtyKg })),
        deliveryDate: selectedDay.value,
        deliverySlot: selectedSlot,
        address,
        note,
      });
      if ("error" in res) {
        setError(res.error);
        return;
      }
      clear();
      router.push(`/order-success/${res.orderId}`);
    });
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-extrabold">ثبت سفارش</h1>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-4 lg:col-span-2">
          <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
            <SectionTitle n="۱">زمان تحویل</SectionTitle>

            <div className="grid grid-cols-2 gap-3">
              {options.map((o) => (
                <button
                  key={o.value}
                  type="button"
                  onClick={() => setDate(o.value)}
                  className={`rounded-xl border-2 p-3 text-right transition ${
                    o.value === selectedDay.value
                      ? "border-green-600 bg-green-50 text-green-800"
                      : "border-stone-200 hover:border-green-300"
                  }`}
                >
                  <span className="block font-bold">{o.label}</span>
                  <span className="text-xs text-stone-500">{o.date}</span>
                </button>
              ))}
            </div>

            <p className="mb-2 mt-4 text-sm text-stone-600">بازه‌ی زمانی</p>
            <div className="flex flex-wrap gap-2">
              {selectedDay.slots.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSlot(s)}
                  className={`rounded-full border px-4 py-2 text-sm transition ${
                    s === selectedSlot
                      ? "border-green-600 bg-green-600 text-white"
                      : "border-stone-300 hover:border-green-400"
                  }`}
                >
                  ساعت {s}
                </button>
              ))}
            </div>
            <p className="mt-3 text-xs text-stone-500">
              ثبت سفارش حداقل ۳ ساعت قبل از شروع بازه‌ی تحویل ممکن است.
            </p>
          </section>

          <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
            <SectionTitle n="۲">آدرس تحویل</SectionTitle>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={3}
              placeholder="شهر، خیابان، پلاک، واحد"
              className={inputClass}
            />
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
              placeholder="توضیحات (اختیاری)"
              className={`${inputClass} mt-3`}
            />
          </section>

          <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
            <SectionTitle n="۳">نحوه‌ی پرداخت</SectionTitle>
            <div className="flex items-center gap-3 rounded-xl border-2 border-green-600 bg-green-50 p-3">
              <span className="text-2xl">💵</span>
              <div>
                <p className="font-bold text-green-800">پرداخت درب منزل</p>
                <p className="text-xs text-stone-500">
                  بعد از دریافت میوه، نقدی پرداخت کنید
                </p>
              </div>
            </div>
          </section>
        </div>

        <aside className="h-fit rounded-2xl border border-stone-200 bg-white p-5 shadow-sm lg:sticky lg:top-24">
          <h2 className="mb-4 font-extrabold">خلاصه‌ی سبد</h2>
          <ul className="flex flex-col gap-2 text-sm">
            {items.map((i) => (
              <li key={i.productId} className="flex justify-between gap-2">
                <span>
                  {i.name}{" "}
                  <span className="text-stone-400">
                    ({i.qtyKg.toLocaleString("fa-IR")} کیلو)
                  </span>
                </span>
                <span>{(i.pricePerKg * i.qtyKg).toLocaleString("fa-IR")}</span>
              </li>
            ))}
          </ul>

          <div className="mt-4 flex items-center justify-between border-t border-stone-200 pt-4 text-lg font-extrabold">
            <span>مبلغ قابل پرداخت</span>
            <span className="text-green-700">
              {total.toLocaleString("fa-IR")} تومان
            </span>
          </div>

          {error && (
            <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">
              {error}
            </p>
          )}

          <button
            type="button"
            onClick={submit}
            disabled={pending}
            className="mt-4 w-full rounded-xl bg-green-600 py-3 font-bold text-white shadow-sm transition hover:bg-green-700 active:scale-95 disabled:opacity-50"
          >
            {pending ? "در حال ثبت..." : "ثبت سفارش"}
          </button>
        </aside>
      </div>
    </main>
  );
}
