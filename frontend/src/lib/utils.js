import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const CURRENCIES = [
  { code: "USD", symbol: "$", name: "US Dollar ($)" },
  { code: "EUR", symbol: "€", name: "Euro (€)" },
  { code: "GBP", symbol: "£", name: "British Pound (£)" },
  { code: "INR", symbol: "₹", name: "Indian Rupee (₹)" },
  { code: "CAD", symbol: "CA$", name: "Canadian Dollar (CA$)" },
  { code: "AUD", symbol: "AU$", name: "Australian Dollar (AU$)" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen (¥)" },
];

export function formatMoney(amount, currency = "USD") {
  const num = typeof amount === "string" ? parseFloat(amount) : Number(amount) || 0;
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  } catch {
    return `$${num.toFixed(2)}`;
  }
}

export const formatCurrency = formatMoney;

export function formatDate(dateString) {
  if (!dateString) return "—";
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateString;
  }
}

export function toDateInput(dateString) {
  if (!dateString) return "";
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return "";
    return d.toISOString().slice(0, 10);
  } catch {
    return "";
  }
}

export function relativeTime(dateString) {
  if (!dateString) return "—";
  try {
    const d = new Date(dateString);
    const now = new Date();
    const diffMs = d.getTime() - now.getTime();
    const diffSec = Math.round(diffMs / 1000);
    const diffDays = Math.round(diffSec / 86400);

    if (Math.abs(diffDays) > 30) {
      return formatDate(dateString);
    }
    const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
    if (Math.abs(diffDays) >= 1) {
      return rtf.format(diffDays, "day");
    }
    const diffHours = Math.round(diffSec / 3600);
    if (Math.abs(diffHours) >= 1) {
      return rtf.format(diffHours, "hour");
    }
    const diffMin = Math.round(diffSec / 60);
    return rtf.format(diffMin, "minute");
  } catch {
    return dateString;
  }
}
