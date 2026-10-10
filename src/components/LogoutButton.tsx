"use client";

import { useCart } from "@/store/cart";
import { logout } from "@/app/actions";

export default function LogoutButton() {
  const clear = useCart((s) => s.clear);

  return (
    <form action={logout}>
      <button type="submit" onClick={() => clear()} className="text-red-600">
        خروج
      </button>
    </form>
  );
}
