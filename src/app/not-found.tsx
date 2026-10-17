import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-16">
      <div className="mx-auto max-w-md rounded-3xl border border-stone-200 bg-white p-10 text-center shadow-sm">
        <div className="text-6xl">🍂</div>
        <h1 className="mt-4 text-2xl font-extrabold">صفحه‌ای پیدا نشد</h1>
        <p className="mt-2 text-sm text-stone-500">
          آدرس را اشتباه وارد کرده‌اید یا این صفحه دیگر وجود ندارد.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-full bg-green-600 px-6 py-3 font-medium text-white transition hover:bg-green-700"
        >
          بازگشت به صفحه‌ی اصلی
        </Link>
      </div>
    </main>
  );
}
