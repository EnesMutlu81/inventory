"use client";

import type { SparePart } from "@/types/inventory";
import StatusChip from "./StatusChip";
import Button from "@/components/ui/Button";
import { formatCurrency, formatDate } from "@/lib/utils";

interface PartsTableProps {
  parts: SparePart[];
  onEdit: (part: SparePart) => void;
  onDelete: (part: SparePart) => void;
}

export default function PartsTable({ parts, onEdit, onDelete }: PartsTableProps) {
  if (parts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3 bg-surface-container-low rounded-xl">
        <span className="material-symbols-outlined text-5xl text-outline-variant">
          inventory_2
        </span>
        <p className="text-on-surface-variant font-body text-sm">
          Arama kriterlerine uygun parça bulunamadı.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-surface-container-low rounded-xl overflow-hidden shadow-ghost">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="bg-surface-container">
              {["Parça No", "Parça Adı", "Kategori", "Miktar", "Birim Fiyat", "Durum", "Güncelleme", ""].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-[11px] font-label font-semibold uppercase tracking-[0.05em] text-on-surface-variant whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {parts.map((part, i) => (
              <PartRow
                key={part.id}
                part={part}
                isEven={i % 2 === 0}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

interface PartRowProps {
  part: SparePart;
  isEven: boolean;
  onEdit: (part: SparePart) => void;
  onDelete: (part: SparePart) => void;
}

function PartRow({ part, isEven, onEdit, onDelete }: PartRowProps) {
  return (
    <tr
      className={`
        group border-l-4 border-l-transparent transition-all duration-150
        hover:border-l-primary hover:bg-primary-container
        ${isEven ? "bg-surface-container-lowest" : "bg-surface-container-low"}
      `}
    >
      <td className="px-4 py-3 whitespace-nowrap">
        <span className="text-xs font-mono font-label font-medium text-on-surface-variant tracking-wide">
          {part.partNumber}
        </span>
      </td>
      <td className="px-4 py-3">
        <span className="text-sm font-body font-medium text-on-surface">
          {part.name}
        </span>
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        <span className="text-xs font-label text-on-surface-variant">
          {part.category}
        </span>
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        <span
          className={`text-sm font-label font-semibold ${
            part.quantity === 0 ? "text-error" : "text-on-surface"
          }`}
        >
          {part.quantity}
        </span>
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        <span className="text-sm font-label font-medium text-on-surface">
          {formatCurrency(part.unitPrice)}
        </span>
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        <StatusChip status={part.status} />
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        <span className="text-xs font-label text-on-surface-variant">
          {formatDate(part.lastUpdated)}
        </span>
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
          <Button
            variant="tertiary"
            size="sm"
            icon="edit"
            iconOnly
            onClick={() => onEdit(part)}
            title="Düzenle"
          />
          <Button
            variant="tertiary"
            size="sm"
            icon="delete"
            iconOnly
            onClick={() => onDelete(part)}
            title="Sil"
            className="hover:bg-red-50 hover:text-error"
          />
        </div>
      </td>
    </tr>
  );
}
