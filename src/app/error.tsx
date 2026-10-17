"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-16">
      <div className="mx-auto max-w-md rounded-3xl border border-stone-200 bg-white p-10 text-center shadow-sm">
        <div className="text-6xl">🍏</div>
        <h1 className="mt-4 text-2xl font-extrabold">مشکلی پیش آمد</h1>
        <p className="mt-2 text-sm text-stone-500">
          خطای غیرمنتظره‌ای رخ داد. دوباره تلاش کنید و اگر ادامه داشت، کمی بعد
          برگردید.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="rounded-full bg-green-600 px-6 py-3 font-medium text-white transition hover:bg-green-700 active:scale-95"
          >
            تلاش دوباره
          </button>
          <Link
            href="/"
            className="rounded-full border border-stone-300 bg-white px-6 py-3 font-medium text-stone-700 transition hover:border-green-400 hover:text-green-700"
          >
            صفحه‌ی اصلی
          </Link>
        </div>
      </div>
    </main>
  );
}
