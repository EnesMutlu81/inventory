"use client";

import TopAppBar from "@/components/layout/TopAppBar";
import StatsGrid from "@/components/dashboard/StatsGrid";
import SearchFilterBar from "@/components/inventory/SearchFilterBar";
import ImportExportBar from "@/components/inventory/ImportExportBar";
import PartsTable from "@/components/inventory/PartsTable";
import PartsCardList from "@/components/inventory/PartsCardList";
import PartFormModal from "@/components/modals/PartFormModal";
import DeleteConfirmModal from "@/components/modals/DeleteConfirmModal";
import { useInventory } from "@/hooks/useInventory";
import { useSearch } from "@/hooks/useSearch";
import { useModal } from "@/hooks/useModal";

export default function HomePage() {
  const { parts, hydrated, addPart, addParts, updatePart, deletePart } = useInventory();
  const { filteredParts, filterState, setFilterState, sortConfig, setSortConfig } =
    useSearch(parts);
  const {
    isFormOpen,
    isDeleteOpen,
    selectedPart,
    openAddForm,
    openEditForm,
    openDeleteConfirm,
    closeAll,
  } = useModal();

  return (
    <>
      <TopAppBar onAddPart={openAddForm} />

      <main className="max-w-screen-xl mx-auto px-4 sm:px-6 py-6 flex flex-col gap-6">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl font-headline font-extrabold text-on-surface">
              Stok Yönetimi
            </h2>
            <p className="text-sm text-on-surface-variant font-body mt-1">
              Yedek parça envanterinizi takip edin ve yönetin.
            </p>
          </div>
          {hydrated && (
            <p className="text-xs text-on-surface-variant font-label">
              {parts.length} parça kayıtlı
            </p>
          )}
        </div>

        {/* KPI Stats */}
        {hydrated ? (
          <StatsGrid parts={parts} />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-surface-container-lowest rounded-xl p-5 h-24 animate-pulse" />
            ))}
          </div>
        )}

        {/* Content section */}
        <section className="flex flex-col gap-4">
          {/* Search & Filter */}
          <SearchFilterBar
            filterState={filterState}
            setFilterState={setFilterState}
            sortConfig={sortConfig}
            setSortConfig={setSortConfig}
            totalCount={parts.length}
            filteredCount={filteredParts.length}
          />

          {/* Import / Export */}
          {hydrated && (
            <ImportExportBar
              parts={parts}
              filteredParts={filteredParts}
              onImport={addParts}
            />
          )}

          {/* Inventory list — responsive */}
          {hydrated ? (
            <>
              <div className="md:hidden">
                <PartsCardList
                  parts={filteredParts}
                  onEdit={openEditForm}
                  onDelete={openDeleteConfirm}
                />
              </div>
              <div className="hidden md:block">
                <PartsTable
                  parts={filteredParts}
                  onEdit={openEditForm}
                  onDelete={openDeleteConfirm}
                />
              </div>
            </>
          ) : (
            <div className="flex flex-col gap-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-surface-container-lowest rounded-xl h-16 animate-pulse" />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* FAB — mobile only */}
      <button
        onClick={openAddForm}
        className="fixed bottom-6 right-6 md:hidden w-14 h-14 rounded-2xl text-on-primary shadow-ghost-lg flex items-center justify-center z-30 transition-transform active:scale-95"
        style={{ background: "linear-gradient(135deg, #005db5 0%, #0052a0 100%)" }}
        aria-label="Yeni parça ekle"
      >
        <span className="material-symbols-outlined text-[24px]">add</span>
      </button>

      {/* Modals */}
      {isFormOpen && (
        <PartFormModal
          part={selectedPart}
          onSave={(data) => {
            if (selectedPart) {
              updatePart(selectedPart.id, data);
            } else {
              addPart(data);
            }
          }}
          onClose={closeAll}
        />
      )}

      {isDeleteOpen && selectedPart && (
        <DeleteConfirmModal
          part={selectedPart}
          onConfirm={() => {
            deletePart(selectedPart.id);
            closeAll();
          }}
          onClose={closeAll}
        />
      )}
    </>
  );
}
