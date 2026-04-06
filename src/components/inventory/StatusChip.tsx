import type { PartStatus } from "@/types/inventory";

interface StatusChipProps {
  status: PartStatus;
}

const CONFIG: Record<PartStatus, { label: string; bg: string; text: string; dot: string }> = {
  "in-stock": {
    label: "Stokta Var",
    bg: "bg-[#d4edda]",
    text: "text-[#1a5c2a]",
    dot: "bg-[#28a745]",
  },
  "out-of-stock": {
    label: "Tükendi",
    bg: "bg-error-container",
    text: "text-[#752121]",
    dot: "bg-error",
  },
};

export default function StatusChip({ status }: StatusChipProps) {
  const cfg = CONFIG[status] ?? CONFIG["in-stock"];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-label font-medium ${cfg.bg} ${cfg.text}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}
