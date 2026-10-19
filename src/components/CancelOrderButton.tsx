"use client";

import { useState, useTransition } from "react";
import { cancelOrder } from "@/app/orders/actions";

export default function CancelOrderButton({ orderId }: { orderId: number }) {
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  function run() {
    setError("");
    startTransition(async () => {
      const res = await cancelOrder(orderId);
      if ("error" in res) {
        setError(res.error);
        setConfirming(false);
      }
    });
  }

  return (
    <div>
      {confirming ? (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm">مطمئن هستید؟</span>
          <button
            type="button"
            onClick={run}
            disabled={pending}
            className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-red-700 active:scale-95 disabled:opacity-50"
          >
            {pending ? "در حال لغو..." : "بله، لغو شود"}
          </button>
          <button
            type="button"
            onClick={() => setConfirming(false)}
            disabled={pending}
            className="rounded-xl border border-stone-300 px-5 py-2.5 text-sm text-stone-600 transition hover:bg-stone-50"
          >
            انصراف
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setConfirming(true)}
          className="rounded-xl border border-red-300 px-5 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
        >
          لغو سفارش
        </button>
      )}
      {error && (
        <p className="mt-3 rounded-xl bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}
