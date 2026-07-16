import { format, parseISO } from "date-fns";

const euroFormatter = new Intl.NumberFormat("en-IE", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

export function formatEuroCents(amountCents: number): string {
  return euroFormatter.format(amountCents / 100);
}

export function formatTripDate(date: string): string {
  return format(parseISO(date), "EEE, d MMM");
}

export function formatTripDateRange(startDate: string, endDate: string): string {
  const start = parseISO(startDate);
  const end = parseISO(endDate);

  if (start.getFullYear() === end.getFullYear()) {
    return `${format(start, "d MMM")} - ${format(end, "d MMM yyyy")}`;
  }

  return `${format(start, "d MMM yyyy")} - ${format(end, "d MMM yyyy")}`;
}
