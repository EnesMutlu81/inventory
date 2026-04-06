"use client";

import type { SparePart } from "@/types/inventory";
import StatusChip from "./StatusChip";
import Button from "@/components/ui/Button";
import { formatCurrency, formatDate } from "@/lib/utils";

interface PartsCardListProps {
  parts: SparePart[];
  onEdit: (part: SparePart) => void;
  onDelete: (part: SparePart) => void;
}

export default function PartsCardList({ parts, onEdit, onDelete }: PartsCardListProps) {
  if (parts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3 bg-surface-container-low rounded-xl">
        <span className="material-symbols-outlined text-5xl text-outline-variant">
          inventory_2
        </span>
        <p className="text-on-surface-variant font-body text-sm text-center px-6">
          Arama kriterlerine uygun parça bulunamadı.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {parts.map((part) => (
        <PartCard key={part.id} part={part} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
}

function PartCard({
  part,
  onEdit,
  onDelete,
}: {
  part: SparePart;
  onEdit: (p: SparePart) => void;
  onDelete: (p: SparePart) => void;
}) {
  return (
    <div className="bg-surface-container-lowest rounded-xl p-4 shadow-ghost border-l-4 border-l-transparent hover:border-l-primary transition-all duration-150">
      {/* Header row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <p className="text-base font-headline font-semibold text-on-surface leading-tight truncate">
            {part.name}
          </p>
          <p className="text-xs font-mono text-on-surface-variant mt-0.5">
            {part.partNumber}
          </p>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <Button variant="tertiary" size="sm" icon="edit" iconOnly onClick={() => onEdit(part)} title="Düzenle" />
          <Button variant="tertiary" size="sm" icon="delete" iconOnly onClick={() => onDelete(part)} title="Sil" className="hover:bg-red-50 hover:text-error" />
        </div>
      </div>

      {/* Status + Category */}
      <div className="flex items-center gap-2 mb-3">
        <StatusChip status={part.status} />
        <span className="text-xs font-label text-on-surface-variant bg-surface-container px-2 py-1 rounded-full">
          {part.category}
        </span>
      </div>

      {/* Details grid */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
        <div>
          <p className="text-[10px] uppercase tracking-[0.05em] font-label text-on-surface-variant mb-0.5">
            Miktar
          </p>
          <p className={`text-sm font-label font-semibold ${part.quantity === 0 ? "text-error" : "text-on-surface"}`}>
            {part.quantity} adet
          </p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-[0.05em] font-label text-on-surface-variant mb-0.5">
            Birim Fiyat
          </p>
          <p className="text-sm font-label font-semibold text-on-surface">
            {formatCurrency(part.unitPrice)}
          </p>
        </div>
      </div>

      <p className="text-[10px] text-on-surface-variant font-label mt-3 pt-3 border-t border-outline-variant/15">
        Son güncelleme: {formatDate(part.lastUpdated)}
      </p>
    </div>
  );
}
