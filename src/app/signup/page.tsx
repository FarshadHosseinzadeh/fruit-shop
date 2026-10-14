"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signup, type SignupState } from "./actions";

const inputClass =
  "w-full rounded-xl border border-stone-300 bg-white p-3 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-200";

export default function SignupPage() {
  const [state, action, pending] = useActionState<SignupState, FormData>(
    signup,
    {},
  );

  return (
    <main className="mx-auto flex max-w-6xl justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-3xl border border-stone-200 bg-white p-8 shadow-sm">
        <div className="mb-6 text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-3xl">
            🍊
          </span>
          <h1 className="mt-4 text-2xl font-extrabold">ثبت‌نام در فروت شاپ</h1>
          <p className="mt-1 text-sm text-stone-500">
            در چند ثانیه حساب بسازید و میوه‌ی تازه سفارش بدهید
          </p>
        </div>

        <form action={action} className="flex flex-col gap-4">
          <input
            name="name"
            placeholder="نام و نام خانوادگی"
            autoComplete="name"
            className={inputClass}
          />
          <input
            name="phone"
            placeholder="شماره موبایل (مثال: 09123456789)"
            dir="ltr"
            inputMode="numeric"
            autoComplete="tel"
            className={inputClass}
          />
          <input
            name="password"
            type="password"
            placeholder="رمز عبور (حداقل ۶ کاراکتر)"
            dir="ltr"
            autoComplete="new-password"
            className={inputClass}
          />

          {state.error && (
            <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">
              {state.error}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="rounded-xl bg-green-600 py-3 font-bold text-white shadow-sm transition hover:bg-green-700 active:scale-95 disabled:opacity-50"
          >
            {pending ? "در حال ثبت..." : "ثبت‌نام"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-stone-500">
          قبلاً ثبت‌نام کرده‌ای؟{" "}
          <Link
            href="/login"
            className="font-medium text-green-700 hover:underline"
          >
            ورود
          </Link>
        </p>
      </div>
    </main>
  );
}
