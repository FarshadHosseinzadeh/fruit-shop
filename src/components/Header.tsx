import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import CartLink from "@/components/CartLink";
import LogoutButton from "@/components/LogoutButton";

export default async function Header() {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200/70 bg-white/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-green-100 text-xl">
            🍎
          </span>
          <span className="text-xl font-extrabold text-green-700">
            فروت شاپ
          </span>
        </Link>

        <nav className="flex items-center gap-1 text-sm sm:gap-3">
          {user ? (
            <>
              <Link
                href="/orders"
                className="rounded-full px-3 py-2 font-medium text-stone-600 transition hover:bg-green-50 hover:text-green-700"
              >
                سفارش‌های من
              </Link>
              <span className="hidden rounded-full bg-stone-100 px-3 py-2 text-stone-700 sm:inline">
                {user.name}
              </span>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-full px-3 py-2 font-medium text-stone-600 transition hover:bg-green-50 hover:text-green-700"
              >
                ورود
              </Link>
              <Link
                href="/signup"
                className="rounded-full bg-green-600 px-4 py-2 font-medium text-white shadow-sm transition hover:bg-green-700"
              >
                ثبت‌نام
              </Link>
            </>
          )}
          <CartLink />
        </nav>
      </div>
    </header>
  );
}
