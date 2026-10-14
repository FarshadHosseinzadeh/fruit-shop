"use client";

import { useCart } from "@/store/cart";
import { logout } from "@/app/actions";

export default function LogoutButton() {
  const clear = useCart((s) => s.clear);

  return (
    <form action={logout}>
      <button
        type="submit"
        onClick={() => clear()}
        className="rounded-full px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
      >
        خروج
      </button>
    </form>
  );
}
