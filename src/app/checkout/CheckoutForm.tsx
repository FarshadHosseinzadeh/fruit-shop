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
  const result: { value: string; label: string; slots: string[] }[] = [];

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
        label:
          (n === 0 ? "امروز، " : "فردا، ") +
          day.toLocaleDateString("fa-IR", { month: "long", day: "numeric" }),
        slots,
      });
    }
  }
  return result;
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
    return <main className="mx-auto max-w-3xl p-6">در حال بارگذاری...</main>;
  }

  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-3xl p-6">
        <h1 className="mb-4 text-2xl font-bold">ثبت سفارش</h1>
        <p className="mb-4">سبد خرید شما خالی است.</p>
        <Link href="/" className="text-green-700 underline">
          بازگشت به محصولات
        </Link>
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
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="mb-6 text-2xl font-bold">ثبت سفارش</h1>

      <section className="mb-6 rounded-xl border p-4">
        <h2 className="mb-3 font-semibold">خلاصه‌ی سبد</h2>
        <ul className="flex flex-col gap-1 text-sm">
          {items.map((i) => (
            <li key={i.productId} className="flex justify-between">
              <span>
                {i.name} ({i.qtyKg.toLocaleString("fa-IR")} کیلو)
              </span>
              <span>
                {(i.pricePerKg * i.qtyKg).toLocaleString("fa-IR")} تومان
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-3 flex justify-between border-t pt-3 font-bold">
          <span>مبلغ قابل پرداخت</span>
          <span>{total.toLocaleString("fa-IR")} تومان</span>
        </div>
      </section>

      <form className="flex flex-col gap-4">
        <label className="flex flex-col gap-1">
          <span className="text-sm">روز تحویل</span>
          <select
            value={selectedDay.value}
            onChange={(e) => setDate(e.target.value)}
            className="rounded-lg border p-3"
          >
            {options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm">بازه‌ی زمانی تحویل</span>
          <select
            value={selectedSlot}
            onChange={(e) => setSlot(e.target.value)}
            className="rounded-lg border p-3"
          >
            {selectedDay.slots.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <span className="text-xs text-gray-500">
            ثبت سفارش حداقل ۳ ساعت قبل از شروع بازه‌ی تحویل ممکن است.
          </span>
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm">آدرس کامل</span>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            rows={3}
            placeholder="شهر، خیابان، پلاک، واحد"
            className="rounded-lg border p-3"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm">توضیحات (اختیاری)</span>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={2}
            className="rounded-lg border p-3"
          />
        </label>

        <p className="text-sm text-gray-600">نحوه‌ی پرداخت: درب منزل (نقدی)</p>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="button"
          onClick={submit}
          disabled={pending}
          className="rounded-lg bg-green-600 p-3 text-white disabled:opacity-50"
        >
          {pending ? "در حال ثبت..." : "ثبت سفارش"}
        </button>
      </form>
    </main>
  );
}
