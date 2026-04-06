"use client";

import { useState, useEffect } from "react";
import type { SparePart, PartFormData } from "@/types/inventory";
import ModalBackdrop from "./ModalBackdrop";
import InputField from "@/components/ui/InputField";
import SelectField from "@/components/ui/SelectField";
import Button from "@/components/ui/Button";
import { CATEGORIES } from "@/lib/constants";

interface PartFormModalProps {
  part?: SparePart | null;
  onSave: (data: PartFormData) => void;
  onClose: () => void;
}

type FormErrors = Partial<Record<keyof PartFormData, string>>;

const EMPTY_FORM: PartFormData = {
  partNumber: "",
  name: "",
  category: "",
  quantity: 0,
  unitPrice: 0,
};

export default function PartFormModal({ part, onSave, onClose }: PartFormModalProps) {
  const isEdit = !!part;
  const [form, setForm] = useState<PartFormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (part) {
      setForm({
        partNumber: part.partNumber,
        name: part.name,
        category: part.category,
        quantity: part.quantity,
        unitPrice: part.unitPrice,
      });
    } else {
      setForm(EMPTY_FORM);
    }
    setErrors({});
  }, [part]);

  function validate(): boolean {
    const errs: FormErrors = {};
    if (!form.partNumber.trim()) errs.partNumber = "Parça numarası zorunludur";
    if (!form.name.trim()) errs.name = "Parça adı zorunludur";
    if (!form.category) errs.category = "Kategori seçiniz";
    if (form.quantity < 0) errs.quantity = "Miktar 0 veya üzeri olmalıdır";
    if (form.unitPrice <= 0) errs.unitPrice = "Birim fiyat 0'dan büyük olmalıdır";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => {
      onSave(form);
      setLoading(false);
      onClose();
    }, 300);
  }

  function set<K extends keyof PartFormData>(key: K, value: PartFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  const categoryOptions = CATEGORIES.map((c) => ({ value: c, label: c }));

  return (
    <ModalBackdrop onClose={onClose}>
      <form onSubmit={handleSubmit} noValidate>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-outline-variant/15">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary-container flex items-center justify-center">
              <span className="material-symbols-outlined text-on-primary-container text-[18px]">
                {isEdit ? "edit" : "add_circle"}
              </span>
            </div>
            <div>
              <h2 className="text-base font-headline font-bold text-on-surface">
                {isEdit ? "Parçayı Düzenle" : "Yeni Parça Ekle"}
              </h2>
              {isEdit && (
                <p className="text-xs text-on-surface-variant font-label">
                  {part?.partNumber}
                </p>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-xl text-on-surface-variant hover:bg-surface-container-high transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField
              label="Parça Numarası"
              value={form.partNumber}
              onChange={(e) => set("partNumber", e.target.value)}
              error={errors.partNumber}
              placeholder="örn. RLM-6205-2RS"
            />
            <InputField
              label="Parça Adı"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              error={errors.name}
              placeholder="örn. Rulman 6205-2RS"
            />
          </div>

          <SelectField
            label="Kategori"
            value={form.category}
            onChange={(e) => set("category", e.target.value)}
            error={errors.category}
            options={categoryOptions}
            placeholder="Kategori seçin..."
          />

          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Miktar"
              type="number"
              min={0}
              value={form.quantity}
              onChange={(e) => set("quantity", Number(e.target.value))}
              error={errors.quantity}
            />
            <InputField
              label="Birim Fiyat (₺)"
              type="number"
              min={0}
              step={0.01}
              value={form.unitPrice}
              onChange={(e) => set("unitPrice", Number(e.target.value))}
              error={errors.unitPrice}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-outline-variant/15 bg-surface-container-low/50">
          <Button type="button" variant="tertiary" onClick={onClose}>
            İptal
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={loading}
            icon={isEdit ? "save" : "add"}
          >
            {isEdit ? "Değişiklikleri Kaydet" : "Parça Ekle"}
          </Button>
        </div>
      </form>
    </ModalBackdrop>
  );
}
