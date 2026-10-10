"use client";

import { useState } from "react";
import { useCart } from "@/store/cart";

export default function AddToCartButton({
  product,
}: {
  product: { id: number; name: string; pricePerKg: number };
}) {
  const add = useCart((s) => s.add);
  const [added, setAdded] = useState(false);

  return (
    <button
      type="button"
      onClick={() => {
        add({
          productId: product.id,
          name: product.name,
          pricePerKg: product.pricePerKg,
        });
        setAdded(true);
        setTimeout(() => setAdded(false), 1000);
      }}
      className="mt-3 w-full rounded-lg bg-green-600 py-2 text-sm text-white"
    >
      {added ? "اضافه شد ✓" : "افزودن به سبد (۱ کیلو)"}
    </button>
  );
}
