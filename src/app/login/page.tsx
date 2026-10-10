"use client";

import Link from "next/link";
import { useActionState } from "react";
import { login, type LoginState } from "./actions";

export default function LoginPage() {
  const [state, action, pending] = useActionState<LoginState, FormData>(
    login,
    {},
  );

  return (
    <main className="mx-auto max-w-sm p-6">
      <h1 className="mb-6 text-2xl font-bold">ورود</h1>
      <form action={action} className="flex flex-col gap-4">
        <input
          name="phone"
          placeholder="شماره موبایل"
          dir="ltr"
          className="rounded-lg border p-3"
        />
        <input
          name="password"
          type="password"
          placeholder="رمز عبور"
          dir="ltr"
          className="rounded-lg border p-3"
        />
        {state.error && <p className="text-sm text-red-600">{state.error}</p>}
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-green-600 p-3 text-white disabled:opacity-50"
        >
          {pending ? "در حال ورود..." : "ورود"}
        </button>
      </form>
      <p className="mt-4 text-sm">
        حساب نداری؟{" "}
        <Link href="/signup" className="text-green-700 underline">
          ثبت‌نام
        </Link>
      </p>
    </main>
  );
}
