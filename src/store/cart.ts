import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  productId: number;
  name: string;
  pricePerKg: number;
  qtyKg: number;
};

type CartState = {
  items: CartItem[];
  add: (item: Omit<CartItem, "qtyKg">, qtyKg?: number) => void;
  setQty: (productId: number, qtyKg: number) => void;
  remove: (productId: number) => void;
  clear: () => void;
};

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      add: (item, qtyKg = 1) =>
        set((s) => {
          const found = s.items.find((i) => i.productId === item.productId);
          if (found) {
            return {
              items: s.items.map((i) =>
                i.productId === item.productId
                  ? { ...i, qtyKg: i.qtyKg + qtyKg }
                  : i,
              ),
            };
          }
          return { items: [...s.items, { ...item, qtyKg }] };
        }),
      setQty: (productId, qtyKg) =>
        set((s) => ({
          items: s.items.map((i) =>
            i.productId === productId ? { ...i, qtyKg } : i,
          ),
        })),
      remove: (productId) =>
        set((s) => ({
          items: s.items.filter((i) => i.productId !== productId),
        })),
      clear: () => set({ items: [] }),
    }),
    { name: "fruit-cart" },
  ),
);
