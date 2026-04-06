import type { PartStatus } from "@/types/inventory";

export function computeStatus(quantity: number): PartStatus {
  return quantity === 0 ? "out-of-stock" : "in-stock";
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    minimumFractionDigits: 2,
  }).format(value);
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
}

export function generateId(): string {
  return crypto.randomUUID();
}
