export const STATUS_LABEL: Record<string, string> = {
  PENDING: "در انتظار تأیید مغازه",
  PREPARING: "در حال آماده‌سازی",
  ON_THE_WAY: "در راه",
  DELIVERED: "تحویل‌شده",
  CANCELLED: "لغو شده",
};

export const STATUS_STYLE: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  PREPARING: "bg-blue-100 text-blue-800",
  ON_THE_WAY: "bg-purple-100 text-purple-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};

// مراحل عادی سفارش به ترتیب (لغو شده جزو این مسیر نیست)
export const STATUS_FLOW = [
  "PENDING",
  "PREPARING",
  "ON_THE_WAY",
  "DELIVERED",
] as const;
export type FlowStatus = (typeof STATUS_FLOW)[number];

export function nextStatus(status: string): FlowStatus | null {
  const idx = STATUS_FLOW.indexOf(status as FlowStatus);
  if (idx === -1) return null;
  return STATUS_FLOW[idx + 1] ?? null;
}
