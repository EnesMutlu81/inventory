"use client";

import type { FilterState, SortConfig } from "@/types/inventory";
import { CATEGORIES, SORT_OPTIONS } from "@/lib/constants";

interface SearchFilterBarProps {
  filterState: FilterState;
  setFilterState: (s: FilterState) => void;
  sortConfig: SortConfig;
  setSortConfig: (s: SortConfig) => void;
  totalCount: number;
  filteredCount: number;
}

export default function SearchFilterBar({
  filterState,
  setFilterState,
  sortConfig,
  setSortConfig,
  totalCount,
  filteredCount,
}: SearchFilterBarProps) {
  return (
    <div className="flex flex-col gap-3">
      {/* Search + Sort row */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search input */}
        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px] pointer-events-none">
            search
          </span>
          <input
            type="text"
            placeholder="Parça adı, numarası veya tedarikçi ara..."
            value={filterState.search}
            onChange={(e) =>
              setFilterState({ ...filterState, search: e.target.value })
            }
            className="w-full h-11 pl-10 pr-4 rounded-md font-body text-sm text-on-surface
              bg-surface-container-lowest border-0 border-b-2 border-transparent
              focus:border-primary shadow-ghost outline-none
              placeholder:text-outline transition-all duration-150"
          />
          {filterState.search && (
            <button
              onClick={() => setFilterState({ ...filterState, search: "" })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface h-6 w-6 flex items-center justify-center rounded"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          )}
        </div>

        {/* Sort select */}
        <div className="relative sm:w-48">
          <select
            value={`${sortConfig.field}:${sortConfig.direction}`}
            onChange={(e) => {
              const [field, direction] = e.target.value.split(":") as [
                SortConfig["field"],
                SortConfig["direction"]
              ];
              setSortConfig({ field, direction });
            }}
            className="w-full h-11 pl-3 pr-10 rounded-md font-body text-sm text-on-surface
              bg-surface-container-lowest border-0 border-b-2 border-transparent
              focus:border-primary shadow-ghost outline-none appearance-none cursor-pointer
              transition-all duration-150"
          >
            {SORT_OPTIONS.map((opt) => (
              <optgroup key={opt.field} label={opt.label}>
                <option value={`${opt.field}:asc`}>{opt.label} ↑</option>
                <option value={`${opt.field}:desc`}>{opt.label} ↓</option>
              </optgroup>
            ))}
          </select>
          <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-[18px]">
            sort
          </span>
        </div>
      </div>

      {/* Filters row */}
      <div className="flex flex-wrap gap-2 items-center">
        {/* Category filter */}
        <div className="relative">
          <select
            value={filterState.category}
            onChange={(e) =>
              setFilterState({ ...filterState, category: e.target.value })
            }
            className="h-8 pl-3 pr-8 rounded-full font-body text-xs text-on-surface
              bg-surface-container border-0 outline-none appearance-none cursor-pointer
              hover:bg-surface-container-high transition-colors duration-150"
          >
            <option value="">Tüm Kategoriler</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-[14px]">
            expand_more
          </span>
        </div>

        {/* Status filter */}
        <div className="relative">
          <select
            value={filterState.status}
            onChange={(e) =>
              setFilterState({ ...filterState, status: e.target.value })
            }
            className="h-8 pl-3 pr-8 rounded-full font-body text-xs text-on-surface
              bg-surface-container border-0 outline-none appearance-none cursor-pointer
              hover:bg-surface-container-high transition-colors duration-150"
          >
            <option value="">Tüm Durumlar</option>
            <option value="in-stock">Stokta Var</option>
            <option value="low-stock">Az Stok</option>
            <option value="out-of-stock">Tükendi</option>
          </select>
          <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-[14px]">
            expand_more
          </span>
        </div>

        {/* Clear filters */}
        {(filterState.search || filterState.category || filterState.status) && (
          <button
            onClick={() =>
              setFilterState({ search: "", category: "", status: "" })
            }
            className="h-8 px-3 rounded-full font-body text-xs text-on-surface-variant
              hover:bg-surface-container-high flex items-center gap-1 transition-colors duration-150"
          >
            <span className="material-symbols-outlined text-[14px]">filter_list_off</span>
            Temizle
          </button>
        )}

        {/* Result count */}
        <span className="ml-auto text-xs text-on-surface-variant font-label">
          {filteredCount === totalCount
            ? `${totalCount} parça`
            : `${filteredCount} / ${totalCount} parça`}
        </span>
      </div>
    </div>
  );
}
