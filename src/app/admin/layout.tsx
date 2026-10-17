import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";

export const metadata: Metadata = { title: "مدیریت" };

const linkClass =
  "rounded-full px-4 py-2 font-medium text-amber-900 transition hover:bg-amber-100";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-amber-50 px-4 py-3">
        <div className="flex items-center gap-2 font-extrabold text-amber-900">
          <span>🛠️</span>
          پنل مدیریت
        </div>
        <nav className="flex flex-wrap gap-1 text-sm">
          <Link href="/admin" className={linkClass}>
            نمای کلی
          </Link>
          <Link href="/admin/orders" className={linkClass}>
            سفارش‌ها
          </Link>
          <Link href="/admin/products" className={linkClass}>
            محصولات
          </Link>
        </nav>
      </div>
      {children}
    </div>
  );
}
