import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

function Stat({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-2xl">
        {icon}
      </span>
      <div>
        <p className="text-sm text-stone-500">{label}</p>
        <p className="text-xl font-extrabold">{value}</p>
      </div>
    </div>
  );
}

export default async function AdminHome() {
  await requireAdmin();

  const [orders, pending, products, customers, revenue] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.product.count(),
    prisma.user.count({ where: { role: "USER" } }),
    prisma.order.aggregate({ _sum: { totalPrice: true } }),
  ]);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-extrabold">نمای کلی</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Stat
          icon="📦"
          label="کل سفارش‌ها"
          value={orders.toLocaleString("fa-IR")}
        />
        <Stat
          icon="⏳"
          label="در انتظار تأیید"
          value={pending.toLocaleString("fa-IR")}
        />
        <Stat
          icon="🍎"
          label="تعداد محصولات"
          value={products.toLocaleString("fa-IR")}
        />
        <Stat
          icon="👤"
          label="مشتری‌ها"
          value={customers.toLocaleString("fa-IR")}
        />
        <Stat
          icon="💵"
          label="جمع مبلغ سفارش‌ها (تومان)"
          value={(revenue._sum.totalPrice ?? 0).toLocaleString("fa-IR")}
        />
      </div>
    </div>
  );
}
