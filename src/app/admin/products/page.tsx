import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { fruitEmoji } from "@/lib/fruitEmoji";
import { updateProduct } from "./actions";
import SaveButton from "@/components/admin/SaveButton";

export const metadata: Metadata = { title: "محصولات (مدیریت)" };
export const dynamic = "force-dynamic";

const inputClass =
  "w-36 rounded-xl border border-stone-300 bg-white p-2.5 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-200";

export default async function AdminProductsPage() {
  await requireAdmin();

  const products = await prisma.product.findMany({ orderBy: { id: "asc" } });

  return (
    <div>
      <h1 className="mb-2 text-2xl font-extrabold">محصولات</h1>
      <p className="mb-6 text-sm text-stone-500">
        قیمت (تومان به ازای هر کیلو)، موجودی و فعال بودن هر محصول را تغییر دهید.
        محصول غیرفعال در فروشگاه نمایش داده نمی‌شود.
      </p>

      <ul className="flex flex-col gap-3">
        {products.map((p) => (
          <li key={p.id}>
            <form
              action={updateProduct}
              className={`flex flex-wrap items-end gap-4 rounded-2xl border bg-white p-4 shadow-sm ${
                p.isActive ? "border-stone-200" : "border-stone-200 opacity-70"
              }`}
            >
              <input type="hidden" name="id" value={p.id} />

              <div className="flex min-w-32 items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-3xl">
                  {fruitEmoji(p.slug)}
                </span>
                <span className="font-bold">{p.name}</span>
              </div>

              <label className="flex flex-col gap-1 text-xs text-stone-500">
                قیمت هر کیلو (تومان)
                <input
                  name="pricePerKg"
                  type="number"
                  min={1000}
                  step={1}
                  required
                  dir="ltr"
                  defaultValue={p.pricePerKg}
                  className={inputClass}
                />
              </label>

              <label className="flex flex-col gap-1 text-xs text-stone-500">
                موجودی (کیلو)
                <input
                  name="stockKg"
                  type="number"
                  min={0}
                  step={1}
                  required
                  dir="ltr"
                  defaultValue={p.stockKg}
                  className={inputClass}
                />
              </label>

              <label className="flex items-center gap-2 pb-2.5 text-sm">
                <input
                  name="isActive"
                  type="checkbox"
                  defaultChecked={p.isActive}
                  className="h-4 w-4 accent-green-600"
                />
                فعال
              </label>

              <SaveButton />
            </form>
          </li>
        ))}
      </ul>
    </div>
  );
}
