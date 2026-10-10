import { requireUser } from "@/lib/auth";
import CheckoutForm from "./CheckoutForm";

export default async function CheckoutPage() {
  await requireUser();
  return <CheckoutForm />;
}
