"use client";

import { useState, useMemo } from "react";
import type { SparePart, FilterState, SortConfig } from "@/types/inventory";

const defaultFilter: FilterState = { search: "", category: "", status: "" };
const defaultSort: SortConfig = { field: "name", direction: "asc" };

export function useSearch(parts: SparePart[]) {
  const [filterState, setFilterState] = useState<FilterState>(defaultFilter);
  const [sortConfig, setSortConfig] = useState<SortConfig>(defaultSort);

  const filteredParts = useMemo(() => {
    let result = [...parts];

    if (filterState.search.trim()) {
      const q = filterState.search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.partNumber.toLowerCase().includes(q)
      );
    }

    if (filterState.category) {
      result = result.filter((p) => p.category === filterState.category);
    }

    if (filterState.status) {
      result = result.filter((p) => p.status === filterState.status);
    }

    result.sort((a, b) => {
      const aVal = a[sortConfig.field];
      const bVal = b[sortConfig.field];
      const mult = sortConfig.direction === "asc" ? 1 : -1;
      if (typeof aVal === "number" && typeof bVal === "number") {
        return (aVal - bVal) * mult;
      }
      return String(aVal).localeCompare(String(bVal), "tr") * mult;
    });

    return result;
  }, [parts, filterState, sortConfig]);

  return { filteredParts, filterState, setFilterState, sortConfig, setSortConfig };
}
