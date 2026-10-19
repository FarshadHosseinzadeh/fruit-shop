import { describe, expect, it } from "vitest";
import { tehranNowMs, validateDelivery } from "./delivery";

// ساعت دیواری تهران به‌صورت میلی‌ثانیه‌ی UTC
const at = (y: number, m: number, d: number, h: number, min = 0) =>
  Date.UTC(y, m - 1, d, h, min);

const today = "2026-10-20";
const tomorrow = "2026-10-21";

describe("tehranNowMs", () => {
  it("convert a UTC instant to Tehran wall-clock time (UTC+3:30)", () => {
    const utc = new Date("2026-10-20T10:30:00Z");
    expect(tehranNowMs(utc)).toBe(at(2026, 10, 20, 14, 0));
  });
});

describe("validateDelivery", () => {
  it("at 14:00 the nearest bookable slot today is 18-21", () => {
    const now = at(2026, 10, 20, 14, 0);
    expect(validateDelivery(now, today, "۱۸ تا ۲۱").ok).toBe(true);
    expect(validateDelivery(now, today, "۱۵ تا ۱۸").ok).toBe(false);
    expect(validateDelivery(now, today, "۱۲ تا ۱۵").ok).toBe(false);
    expect(validateDelivery(now, today, "۹ تا ۱۲").ok).toBe(false);
  });

  it("allows a slot exactly 3 hours before it starts", () => {
    const now = at(2026, 10, 20, 15, 0);
    expect(validateDelivery(now, today, "۱۸ تا ۲۱").ok).toBe(true);
  });

  it("rejects a slot one minute short of the 3 hour lead time", () => {
    const now = at(2026, 10, 20, 15, 1);
    expect(validateDelivery(now, today, "۱۸ تا ۲۱").ok).toBe(false);
  });

  it("allows every slot tomorrow, even late at night", () => {
    const now = at(2026, 10, 20, 23, 59);
    for (const slot of ["۹ تا ۱۲", "۱۲ تا ۱۵", "۱۵ تا ۱۸", "۱۸ تا ۲۱"]) {
      expect(validateDelivery(now, tomorrow, slot).ok).toBe(true);
    }
  });

  it("allows the 9-12 slot today early in the morning", () => {
    const now = at(2026, 10, 20, 0, 30);
    expect(validateDelivery(now, today, "۹ تا ۱۲").ok).toBe(true);
  });

  it("rejects the day after tomorrow and past days", () => {
    const now = at(2026, 10, 20, 8, 0);
    expect(validateDelivery(now, "2026-10-22", "۱۸ تا ۲۱").ok).toBe(false);
    expect(validateDelivery(now, "2026-10-19", "۱۸ تا ۲۱").ok).toBe(false);
  });

  it("rejects an unknown slot", () => {
    const now = at(2026, 10, 20, 8, 0);
    expect(validateDelivery(now, tomorrow, "۲۱ تا ۲۴").ok).toBe(false);
  });
});
