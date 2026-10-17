"use client";

import { useFormStatus } from "react-dom";

export default function AdvanceButton({ label }: { label: string }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-xl bg-green-600 px-6 py-3 font-bold text-white shadow-sm transition hover:bg-green-700 active:scale-95 disabled:opacity-50"
    >
      {pending ? "در حال تغییر..." : label}
    </button>
  );
}
