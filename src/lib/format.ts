export function formatDeliveryDay(deliveryDate: string) {
  return new Date(`${deliveryDate}T00:00:00Z`).toLocaleDateString("fa-IR", {
    timeZone: "UTC",
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export function formatOrderNumber(id: number) {
  return id.toLocaleString("fa-IR", { useGrouping: false });
}

export function formatCreatedAt(date: Date) {
  return date.toLocaleString("fa-IR", {
    timeZone: "Asia/Tehran",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
