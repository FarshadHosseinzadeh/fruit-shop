import { prisma } from "@/lib/prisma";
import AddToCartButton from "@/components/AddToCartButton";

export const dynamic = "force-dynamic";

export default async function Home() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: { id: "asc" },
  });

  return (
    <main className="mx-auto max-w-5xl p-6">
      <h1 className="mb-6 text-2xl font-bold">محصولات</h1>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {products.map((p) => (
          <div key={p.id} className="rounded-xl border p-4">
            <h2 className="font-semibold">{p.name}</h2>
            <p className="mt-2 text-sm text-gray-600">
              {p.pricePerKg.toLocaleString("fa-IR")} تومان / کیلو
            </p>
            <AddToCartButton
              product={{ id: p.id, name: p.name, pricePerKg: p.pricePerKg }}
            />
          </div>
        ))}
      </div>
    </main>
  );
}
