"use client";

import { useState } from "react";
import { useCart } from "@/store/cart";

export default function AddToCartButton({
  product,
  disabled = false,
}: {
  product: { id: number; name: string; slug: string; pricePerKg: number };
  disabled?: boolean;
}) {
  const add = useCart((s) => s.add);
  const [added, setAdded] = useState(false);

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => {
        add({
          productId: product.id,
          slug: product.slug,
          name: product.name,
          pricePerKg: product.pricePerKg,
        });
        setAdded(true);
        setTimeout(() => setAdded(false), 1000);
      }}
      className={`mt-4 w-full rounded-xl py-2.5 text-sm font-medium transition active:scale-95 disabled:cursor-not-allowed disabled:bg-stone-200 disabled:text-stone-500 ${
        added
          ? "bg-green-100 text-green-700"
          : "bg-green-600 text-white hover:bg-green-700"
      }`}
    >
      {disabled ? "ناموجود" : added ? "اضافه شد ✓" : "افزودن به سبد (۱ کیلو)"}
    </button>
  );
}
