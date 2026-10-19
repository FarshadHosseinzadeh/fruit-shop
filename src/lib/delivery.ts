export const SLOT_START: Record<string, number> = {
  "۹ تا ۱۲": 9,
  "۱۲ تا ۱۵": 12,
  "۱۵ تا ۱۸": 15,
  "۱۸ تا ۲۱": 18,
};
export const MIN_LEAD_HOURS = 3;
const HOUR_MS = 60 * 60 * 1000;

// ساعت دیواری تهران، به‌صورت میلی‌ثانیه‌ی UTC برای مقایسه‌ی ساده
export function tehranNowMs(date: Date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Tehran",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const get = (t: string) => Number(parts.find((p) => p.type === t)!.value);
  return Date.UTC(
    get("year"),
    get("month") - 1,
    get("day"),
    get("hour"),
    get("minute"),
  );
}

function isoDay(ms: number) {
  return new Date(ms).toISOString().slice(0, 10);
}

export type DeliveryCheck = { ok: true } | { ok: false; error: string };

export function validateDelivery(
  nowMs: number,
  deliveryDate: string,
  deliverySlot: string,
): DeliveryCheck {
  const allowedDays = [isoDay(nowMs), isoDay(nowMs + 24 * HOUR_MS)];
  const startHour = SLOT_START[deliverySlot];
  if (!allowedDays.includes(deliveryDate) || startHour === undefined) {
    return { ok: false, error: "روز یا بازه‌ی تحویل معتبر نیست" };
  }

  const [y, m, d] = deliveryDate.split("-").map(Number);
  const slotStartMs = Date.UTC(y, m - 1, d, startHour);
  if (slotStartMs < nowMs + MIN_LEAD_HOURS * HOUR_MS) {
    return {
      ok: false,
      error: "این بازه دیگر قابل رزرو نیست، بازه‌ی دیگری انتخاب کنید",
    };
  }
  return { ok: true };
}
