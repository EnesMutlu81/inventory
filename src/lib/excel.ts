import type { SparePart, PartFormData } from "@/types/inventory";
import { CATEGORIES, EXCEL_COLUMNS } from "@/lib/constants";
import { formatDate } from "@/lib/utils";

// Lazy-load xlsx so it never runs during SSR
async function getXLSX() {
  return await import("xlsx");
}

// ─── Template Download ──────────────────────────────────────────────
export async function downloadTemplate(): Promise<void> {
  const XLSX = await getXLSX();
  const wb = XLSX.utils.book_new();

  const templateData = [
    EXCEL_COLUMNS.map((c) => c.header),
    ["RLM-6205-2RS", "Rulman 6205-2RS", "Rulmanlar", 10, 125.5],
    ["CNT-OR-50X3", "O-Ring 50x3mm NBR", "Contalar", 0, 8.75],
  ];
  const ws = XLSX.utils.aoa_to_sheet(templateData);
  ws["!cols"] = [
    { wch: 20 },
    { wch: 30 },
    { wch: 22 },
    { wch: 10 },
    { wch: 18 },
  ];
  XLSX.utils.book_append_sheet(wb, ws, "Parçalar");

  const catData = [["Geçerli Kategoriler"], ...CATEGORIES.map((c) => [c])];
  const catWs = XLSX.utils.aoa_to_sheet(catData);
  catWs["!cols"] = [{ wch: 28 }];
  XLSX.utils.book_append_sheet(wb, catWs, "Kategoriler (Referans)");

  XLSX.writeFile(wb, "precision_inventory_sablonu.xlsx");
}

// ─── Import ─────────────────────────────────────────────────────────
export interface ImportResult {
  valid: PartFormData[];
  errors: { row: number; message: string }[];
}

export async function parseImportFile(file: File): Promise<ImportResult> {
  const XLSX = await getXLSX();

  const buffer = await file.arrayBuffer();
  const data = new Uint8Array(buffer);
  const wb = XLSX.read(data, { type: "array" });
  const ws = wb.Sheets[wb.SheetNames[0]];
  const rows: unknown[][] = XLSX.utils.sheet_to_json(ws, {
    header: 1,
    defval: "",
  });

  const dataRows = rows
    .slice(1)
    .filter((r) => (r as unknown[]).some((cell) => String(cell).trim() !== ""));

  const valid: PartFormData[] = [];
  const errors: { row: number; message: string }[] = [];

  dataRows.forEach((row, i) => {
    const rowNum = i + 2;
    const [partNumber, name, category, quantityRaw, unitPriceRaw] =
      row as unknown[];

    const pn = String(partNumber ?? "").trim();
    const nm = String(name ?? "").trim();
    const cat = String(category ?? "").trim();
    const qty = Number(quantityRaw);
    const price = Number(unitPriceRaw);

    if (!pn) {
      errors.push({ row: rowNum, message: "Parça No boş olamaz" });
      return;
    }
    if (!nm) {
      errors.push({ row: rowNum, message: "Parça Adı boş olamaz" });
      return;
    }
    if (!CATEGORIES.includes(cat)) {
      errors.push({
        row: rowNum,
        message: `"${cat}" geçersiz kategori. Kategoriler sayfasına bakın.`,
      });
      return;
    }
    if (isNaN(qty) || qty < 0) {
      errors.push({ row: rowNum, message: "Miktar geçersiz" });
      return;
    }
    if (isNaN(price) || price <= 0) {
      errors.push({ row: rowNum, message: "Birim Fiyat geçersiz" });
      return;
    }

    valid.push({
      partNumber: pn,
      name: nm,
      category: cat,
      quantity: Math.floor(qty),
      unitPrice: price,
    });
  });

  return { valid, errors };
}

// ─── Export ─────────────────────────────────────────────────────────
export async function exportParts(
  parts: SparePart[],
  filename = "stok_listesi"
): Promise<void> {
  const XLSX = await getXLSX();

  const headers = [
    "Parça No",
    "Parça Adı",
    "Kategori",
    "Miktar",
    "Birim Fiyat (TL)",
    "Toplam Değer (TL)",
    "Durum",
    "Son Güncelleme",
  ];

  const statusLabels: Record<SparePart["status"], string> = {
    "in-stock": "Stokta Var",
    "out-of-stock": "Tükendi",
  };

  const rows = parts.map((p) => [
    p.partNumber,
    p.name,
    p.category,
    p.quantity,
    p.unitPrice,
    p.quantity * p.unitPrice,
    statusLabels[p.status],
    formatDate(p.lastUpdated),
  ]);

  const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
  ws["!cols"] = [
    { wch: 20 },
    { wch: 30 },
    { wch: 22 },
    { wch: 10 },
    { wch: 18 },
    { wch: 20 },
    { wch: 14 },
    { wch: 18 },
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Stok Listesi");

  const date = new Date().toISOString().slice(0, 10);
  XLSX.writeFile(wb, `${filename}_${date}.xlsx`);
}
