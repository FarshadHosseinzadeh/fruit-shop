import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { STATUS_LABEL, STATUS_STYLE } from "@/lib/orderStatus";
import {
  formatCreatedAt,
  formatDeliveryDay,
  formatOrderNumber,
} from "@/lib/format";

export const metadata: Metadata = { title: "سفارش‌ها (مدیریت)" };
export const dynamic = "force-dynamic";

const STATUSES = ["PENDING", "PREPARING", "ON_THE_WAY", "DELIVERED"] as const;
type Status = (typeof STATUSES)[number];

function chip(on: boolean) {
  return `rounded-full border px-4 py-2 text-sm transition ${
    on
      ? "border-green-600 bg-green-600 text-white"
      : "border-stone-300 bg-white hover:border-green-400"
  }`;
}

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  await requireAdmin();

  const { status } = await searchParams;
  const active = STATUSES.find((s) => s === status);

  const [orders, counts] = await Promise.all([
    prisma.order.findMany({
      where: active ? { status: active } : undefined,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true, phone: true } },
        items: { select: { id: true } },
      },
    }),
    prisma.order.groupBy({ by: ["status"], _count: { _all: true } }),
  ]);

  const countOf = (s: Status) =>
    counts.find((c) => c.status === s)?._count._all ?? 0;
  const total = counts.reduce((sum, c) => sum + c._count._all, 0);

  return (
    <div>
      <h1 className="mb-4 text-2xl font-extrabold">سفارش‌ها</h1>

      <div className="mb-6 flex flex-wrap gap-2">
        <Link href="/admin/orders" className={chip(!active)}>
          همه ({total.toLocaleString("fa-IR")})
        </Link>
        {STATUSES.map((s) => (
          <Link
            key={s}
            href={`/admin/orders?status=${s}`}
            className={chip(active === s)}
          >
            {STATUS_LABEL[s]} ({countOf(s).toLocaleString("fa-IR")})
          </Link>
        ))}
      </div>

      {orders.length === 0 ? (
        <div className="rounded-2xl border border-stone-200 bg-white p-10 text-center text-stone-500">
          سفارشی با این وضعیت وجود ندارد.
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {orders.map((o) => (
            <li key={o.id}>
              <Link
                href={`/admin/orders/${o.id}`}
                className="block rounded-2xl border border-stone-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="font-extrabold">
                    سفارش شماره‌ی {formatOrderNumber(o.id)}
                  </h2>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${STATUS_STYLE[o.status]}`}
                  >
                    {STATUS_LABEL[o.status]}
                  </span>
                </div>

                <p className="mt-2 text-sm">
                  {o.user.name}{" "}
                  <span dir="ltr" className="text-stone-500">
                    {o.user.phone}
                  </span>
                </p>
                <p className="mt-1 text-xs text-stone-500">
                  ثبت‌شده در {formatCreatedAt(o.createdAt)}
                </p>

                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-stone-100 pt-3 text-sm">
                  <span className="text-stone-600">
                    🚚 {formatDeliveryDay(o.deliveryDate)}، ساعت{" "}
                    {o.deliverySlot}
                    {" · "}
                    {o.items.length.toLocaleString("fa-IR")} قلم
                  </span>
                  <span className="font-extrabold text-green-700">
                    {o.totalPrice.toLocaleString("fa-IR")} تومان
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
