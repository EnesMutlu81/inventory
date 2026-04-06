"use client";

import { useRef, useState } from "react";
import type { SparePart, PartFormData } from "@/types/inventory";
import type { ImportResult } from "@/lib/excel";
import Button from "@/components/ui/Button";
import ModalBackdrop from "@/components/modals/ModalBackdrop";

interface ImportExportBarProps {
  parts: SparePart[];
  filteredParts: SparePart[];
  onImport: (data: PartFormData[]) => void;
}

export default function ImportExportBar({
  parts,
  filteredParts,
  onImport,
}: ImportExportBarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [importing, setImporting] = useState(false);
  const [fileName, setFileName] = useState("");

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setImporting(true);
    try {
      const { parseImportFile } = await import("@/lib/excel");
      const result = await parseImportFile(file);
      setImportResult(result);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Hata oluştu");
    } finally {
      setImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleDownloadTemplate() {
    const { downloadTemplate } = await import("@/lib/excel");
    await downloadTemplate();
  }

  async function handleExport() {
    const { exportParts } = await import("@/lib/excel");
    await exportParts(filteredParts, "stok_listesi");
  }

  function confirmImport() {
    if (!importResult?.valid.length) return;
    onImport(importResult.valid);
    setImportResult(null);
    setFileName("");
  }

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        {/* Import group */}
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            icon="download"
            onClick={handleDownloadTemplate}
          >
            Şablon İndir
          </Button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls"
            className="hidden"
            onChange={handleFileChange}
          />
          <Button
            variant="secondary"
            size="sm"
            icon="upload_file"
            loading={importing}
            onClick={() => fileInputRef.current?.click()}
          >
            Excel Yükle
          </Button>
        </div>

        {/* Divider */}
        <div className="h-5 w-px bg-outline-variant/40 mx-1 hidden sm:block" />

        {/* Export group */}
        <Button
          variant="tertiary"
          size="sm"
          icon="table_view"
          onClick={handleExport}
          title={`${filteredParts.length} parçayı dışa aktar`}
        >
          {filteredParts.length < parts.length
            ? `Filtreleneni Aktar (${filteredParts.length})`
            : "Tümünü Aktar"}
        </Button>
      </div>

      {/* Import preview modal */}
      {importResult && (
        <ModalBackdrop onClose={() => setImportResult(null)}>
          <div className="px-6 py-5 flex flex-col gap-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-on-primary-container text-[18px]">
                    upload_file
                  </span>
                </div>
                <div>
                  <h2 className="text-base font-headline font-bold text-on-surface">
                    İçe Aktarma Önizlemesi
                  </h2>
                  <p className="text-xs text-on-surface-variant font-label truncate max-w-[200px]">
                    {fileName}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setImportResult(null)}
                className="w-9 h-9 flex items-center justify-center rounded-xl text-on-surface-variant hover:bg-surface-container-high transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Summary chips */}
            <div className="flex gap-3 flex-wrap">
              <div className="flex items-center gap-2 bg-[#d4edda] text-[#1a5c2a] px-3 py-2 rounded-xl">
                <span className="material-symbols-outlined text-[16px]">check_circle</span>
                <span className="text-sm font-label font-medium">
                  {importResult.valid.length} geçerli satır
                </span>
              </div>
              {importResult.errors.length > 0 && (
                <div className="flex items-center gap-2 bg-error-container text-[#752121] px-3 py-2 rounded-xl">
                  <span className="material-symbols-outlined text-[16px]">error</span>
                  <span className="text-sm font-label font-medium">
                    {importResult.errors.length} hatalı satır
                  </span>
                </div>
              )}
            </div>

            {/* Valid preview */}
            {importResult.valid.length > 0 && (
              <div className="bg-surface-container-low rounded-xl overflow-hidden">
                <p className="text-[11px] uppercase tracking-[0.05em] font-label font-semibold text-on-surface-variant px-4 py-2 bg-surface-container">
                  Eklenecek Parçalar
                </p>
                <div className="max-h-40 overflow-y-auto">
                  {importResult.valid.map((p, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between px-4 py-2.5 border-t border-outline-variant/10 first:border-0"
                    >
                      <div>
                        <p className="text-sm font-body font-medium text-on-surface">
                          {p.name}
                        </p>
                        <p className="text-xs text-on-surface-variant font-label">
                          {p.partNumber} · {p.category}
                        </p>
                      </div>
                      <div className="text-right shrink-0 ml-4">
                        <p className="text-xs font-label font-medium text-on-surface">
                          {p.quantity} adet
                        </p>
                        <p className="text-xs text-on-surface-variant font-label">
                          ₺{p.unitPrice.toLocaleString("tr-TR")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Errors */}
            {importResult.errors.length > 0 && (
              <div className="bg-red-50 rounded-xl overflow-hidden">
                <p className="text-[11px] uppercase tracking-[0.05em] font-label font-semibold text-error px-4 py-2 bg-error-container/30">
                  Hatalı Satırlar (atlanacak)
                </p>
                <div className="max-h-32 overflow-y-auto">
                  {importResult.errors.map((err, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 px-4 py-2 border-t border-error/10 first:border-0"
                    >
                      <span className="text-xs font-mono text-on-surface-variant bg-surface-container px-1.5 py-0.5 rounded shrink-0">
                        Satır {err.row}
                      </span>
                      <p className="text-xs text-error font-label">{err.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 pt-1">
              <Button variant="tertiary" onClick={() => setImportResult(null)}>
                İptal
              </Button>
              <Button
                variant="primary"
                icon="add_circle"
                onClick={confirmImport}
                disabled={importResult.valid.length === 0}
              >
                {importResult.valid.length} Parça Ekle
              </Button>
            </div>
          </div>
        </ModalBackdrop>
      )}
    </>
  );
}
