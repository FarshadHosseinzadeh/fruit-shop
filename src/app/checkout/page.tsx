import type { Metadata } from "next";
import { requireUser } from "@/lib/auth";
import CheckoutForm from "./CheckoutForm";

export const metadata: Metadata = { title: "ثبت سفارش" };

export default async function CheckoutPage() {
  await requireUser();
  return <CheckoutForm />;
}
