"use client";

import type { SparePart } from "@/types/inventory";
import ModalBackdrop from "./ModalBackdrop";
import Button from "@/components/ui/Button";

interface DeleteConfirmModalProps {
  part: SparePart;
  onConfirm: () => void;
  onClose: () => void;
}

export default function DeleteConfirmModal({
  part,
  onConfirm,
  onClose,
}: DeleteConfirmModalProps) {
  return (
    <ModalBackdrop onClose={onClose}>
      <div className="px-6 py-6 flex flex-col gap-5">
        {/* Icon + title */}
        <div className="flex items-start gap-4">
          <div className="shrink-0 w-10 h-10 rounded-xl bg-error-container/50 flex items-center justify-center">
            <span className="material-symbols-outlined text-error text-[20px]">
              delete_forever
            </span>
          </div>
          <div>
            <h2 className="text-base font-headline font-bold text-on-surface">
              Parçayı Sil
            </h2>
            <p className="text-sm text-on-surface-variant font-body mt-1 leading-relaxed">
              <strong className="text-on-surface">{part.name}</strong> (
              {part.partNumber}) parçasını kalıcı olarak silmek istediğinizden
              emin misiniz? Bu işlem geri alınamaz.
            </p>
          </div>
        </div>

        {/* Part summary chip */}
        <div className="bg-surface-container rounded-xl px-4 py-3 flex items-center gap-3">
          <span className="material-symbols-outlined text-on-surface-variant text-[18px]">
            inventory_2
          </span>
          <div>
            <p className="text-sm font-label font-medium text-on-surface">
              {part.name}
            </p>
            <p className="text-xs text-on-surface-variant font-label">
              {part.partNumber} · {part.category} · Stok: {part.quantity}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <Button variant="tertiary" onClick={onClose}>
            İptal
          </Button>
          <Button variant="danger" icon="delete" onClick={onConfirm}>
            Sil
          </Button>
        </div>
      </div>
    </ModalBackdrop>
  );
}
