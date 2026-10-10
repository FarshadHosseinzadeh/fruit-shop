import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import CartLink from "@/components/CartLink";
import LogoutButton from "@/components/LogoutButton";

export default async function Header() {
  const user = await getCurrentUser();

  return (
    <header className="border-b">
      <div className="mx-auto flex max-w-5xl items-center justify-between p-4">
        <Link href="/" className="text-lg font-bold">
          🍎 فروت شاپ
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          {user ? (
            <>
              <Link href="/orders">سفارش‌های من</Link>
              <span>{user.name}</span>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link href="/login">ورود</Link>
              <Link href="/signup">ثبت‌نام</Link>
            </>
          )}
          <CartLink />
        </nav>
      </div>
    </header>
  );
}
