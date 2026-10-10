"use client";

import { useActionState } from "react";
import { signup, type SignupState } from "./actions";

export default function SignupPage() {
  const [state, action, pending] = useActionState<SignupState, FormData>(
    signup,
    {},
  );

  return (
    <main className="mx-auto max-w-sm p-6">
      <h1 className="mb-6 text-2xl font-bold">ثبت‌نام</h1>
      <form action={action} className="flex flex-col gap-4">
        <input
          name="name"
          placeholder="نام و نام خانوادگی"
          className="rounded-lg border p-3"
        />
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
          {pending ? "در حال ثبت..." : "ثبت‌نام"}
        </button>
      </form>
    </main>
  );
}
