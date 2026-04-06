"use client";

import Button from "@/components/ui/Button";

interface TopAppBarProps {
  onAddPart: () => void;
}

export default function TopAppBar({ onAddPart }: TopAppBarProps) {
  return (
    <header className="sticky top-0 z-40 bg-surface-container/95 backdrop-blur-md border-b border-outline-variant/10 shadow-ghost">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo + Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: "linear-gradient(135deg, #005db5 0%, #0052a0 100%)" }}>
            <span className="material-symbols-outlined text-white text-[18px]">
              precision_manufacturing
            </span>
          </div>
          <div className="hidden sm:block">
            <h1 className="text-base font-headline font-bold text-on-surface leading-none">
              Precision Inventory
            </h1>
            <p className="text-[10px] text-on-surface-variant font-label leading-none mt-0.5">
              Yedek Parça Stok Yönetimi
            </p>
          </div>
          <h1 className="sm:hidden text-base font-headline font-bold text-on-surface">
            Envanter
          </h1>
        </div>

        {/* Nav links (desktop) */}
        <nav className="hidden md:flex items-center gap-1">
          <NavLink icon="dashboard" label="Genel Bakış" active />
          <NavLink icon="inventory_2" label="Stok" />
          <NavLink icon="bar_chart" label="Raporlar" />
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button className="h-11 w-11 flex items-center justify-center rounded-xl text-on-surface-variant hover:bg-surface-container-high transition-colors">
            <span className="material-symbols-outlined text-[20px]">notifications</span>
          </button>
          <Button variant="primary" icon="add" onClick={onAddPart} size="md">
            <span className="hidden sm:inline">Yeni Parça</span>
          </Button>
        </div>
      </div>
    </header>
  );
}

function NavLink({
  icon,
  label,
  active = false,
}: {
  icon: string;
  label: string;
  active?: boolean;
}) {
  return (
    <button
      className={`h-9 px-3 rounded-xl flex items-center gap-2 text-sm font-label font-medium transition-colors duration-150
        ${
          active
            ? "bg-primary-container text-on-primary-container"
            : "text-on-surface-variant hover:bg-surface-container-high"
        }`}
    >
      <span className="material-symbols-outlined text-[18px]">{icon}</span>
      {label}
    </button>
  );
}
