"use client";

import { useFormStatus } from "react-dom";

export default function SaveButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-xl bg-green-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-green-700 active:scale-95 disabled:opacity-50"
    >
      {pending ? "در حال ذخیره..." : "ذخیره"}
    </button>
  );
}
