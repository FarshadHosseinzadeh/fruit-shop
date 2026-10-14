import { prisma } from "@/lib/prisma";
import AddToCartButton from "@/components/AddToCartButton";
import { fruitEmoji } from "@/lib/fruitEmoji";

export const dynamic = "force-dynamic";

const FEATURES = [
  {
    icon: "🚚",
    title: "تحویل امروز و فردا",
    text: "بازه‌ی تحویل را خودتان انتخاب کنید",
  },
  {
    icon: "💵",
    title: "پرداخت درب منزل",
    text: "بعد از دریافت میوه، نقدی پرداخت کنید",
  },
  {
    icon: "🌿",
    title: "میوه‌ی تازه",
    text: "هر روز از میدان تازه تامین می‌شود",
  },
];

export default async function Home() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: { id: "asc" },
  });

  return (
    <main>
      <section className="bg-gradient-to-bl from-green-600 via-green-500 to-lime-400 text-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 py-12 text-center sm:flex-row sm:py-16 sm:text-right">
          <div className="flex-1">
            <h1 className="text-3xl font-extrabold leading-snug sm:text-4xl">
              میوه‌ی تازه، درب منزل شما
            </h1>
            <p className="mt-3 text-green-50">
              میوه‌ی مورد نظرتان را انتخاب کنید، روز و ساعت تحویل را بگویید و در
              خانه تحویل بگیرید.
            </p>
            <a
              href="#products"
              className="mt-6 inline-block rounded-full bg-white px-6 py-3 font-bold text-green-700 shadow transition hover:bg-green-50"
            >
              مشاهده‌ی محصولات
            </a>
          </div>
          <div className="text-7xl sm:text-8xl" aria-hidden>
            🍎🍊🍇
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-3 px-4 py-6 sm:grid-cols-3">
        {FEATURES.map((f) => (
          <div
            key={f.title}
            className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-white p-4"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-50 text-2xl">
              {f.icon}
            </span>
            <div>
              <h3 className="font-bold">{f.title}</h3>
              <p className="text-xs text-stone-500">{f.text}</p>
            </div>
          </div>
        ))}
      </section>

      <section id="products" className="mx-auto max-w-6xl px-4 pb-4 pt-6">
        <h2 className="mb-6 text-2xl font-extrabold">محصولات</h2>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <div
              key={p.id}
              className="group flex flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex h-32 items-center justify-center bg-gradient-to-br from-green-50 to-lime-100 sm:h-36">
                <span className="text-6xl transition-transform duration-300 group-hover:scale-110">
                  {fruitEmoji(p.slug)}
                </span>
              </div>

              <div className="flex flex-1 flex-col p-4">
                <div className="flex-1">
                  <h3 className="font-bold">{p.name}</h3>
                  <p className="mt-1 text-sm text-stone-500">
                    <span className="text-lg font-extrabold text-green-700">
                      {p.pricePerKg.toLocaleString("fa-IR")}
                    </span>{" "}
                    تومان / کیلو
                  </p>
                  {p.stockKg <= 0 ? (
                    <p className="mt-1 text-xs font-medium text-red-600">
                      ناموجود
                    </p>
                  ) : p.stockKg <= 20 ? (
                    <p className="mt-1 text-xs font-medium text-amber-600">
                      تنها {p.stockKg.toLocaleString("fa-IR")} کیلو مانده
                    </p>
                  ) : null}
                </div>

                <AddToCartButton
                  product={{id: p.id, name: p.name, slug: p.slug, pricePerKg: p.pricePerKg,}}
                  disabled={p.stockKg <= 0}
                />
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
