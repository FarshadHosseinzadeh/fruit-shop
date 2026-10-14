"use client";

import Link from "next/link";
import { useCart } from "@/store/cart";
import { useMounted } from "@/lib/useMounted";

export default function CartLink() {
  const mounted = useMounted();
  const count = useCart((s) => s.items.length);

  return (
    <Link
      href="/cart"
      aria-label="سبد خرید"
      className="relative flex h-10 w-10 items-center justify-center rounded-full text-stone-700 transition hover:bg-green-50 hover:text-green-700"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-6 w-6"
      >
        <circle cx="9" cy="20" r="1.5" />
        <circle cx="18" cy="20" r="1.5" />
        <path d="M2 3h3l2.7 12.4a1 1 0 0 0 1 .8h9.2a1 1 0 0 0 1-.8L21 7H6" />
      </svg>
      {mounted && count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-green-600 px-1 text-xs font-medium text-white ring-2 ring-white">
          {count.toLocaleString("fa-IR")}
        </span>
      )}
    </Link>
  );
}
