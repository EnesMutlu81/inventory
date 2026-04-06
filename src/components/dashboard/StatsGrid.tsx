import type { SparePart } from "@/types/inventory";
import StatsCard from "./StatsCard";
import { formatCurrency } from "@/lib/utils";

interface StatsGridProps {
  parts: SparePart[];
}

export default function StatsGrid({ parts }: StatsGridProps) {
  const total = parts.length;
  const inStock = parts.filter((p) => p.status === "in-stock").length;
  const outOfStock = parts.filter((p) => p.status === "out-of-stock").length;
  const totalValue = parts.reduce((sum, p) => sum + p.quantity * p.unitPrice, 0);

  const stats = [
    {
      label: "Toplam Parça",
      value: total,
      icon: "category",
    },
    {
      label: "Stokta Var",
      value: inStock,
      icon: "check_circle",
    },
    {
      label: "Tükendi",
      value: outOfStock,
      icon: "error",
      trend: outOfStock > 0 ? "Sipariş gerekiyor" : undefined,
      trendUp: false,
    },
    {
      label: "Toplam Stok Değeri",
      value: formatCurrency(totalValue),
      icon: "payments",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {stats.map((s) => (
        <StatsCard key={s.label} data={s} />
      ))}
    </div>
  );
}
