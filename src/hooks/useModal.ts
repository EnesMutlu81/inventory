"use client";

import { useState } from "react";
import type { SparePart } from "@/types/inventory";

export function useModal() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedPart, setSelectedPart] = useState<SparePart | null>(null);

  function openAddForm() {
    setSelectedPart(null);
    setIsFormOpen(true);
  }

  function openEditForm(part: SparePart) {
    setSelectedPart(part);
    setIsFormOpen(true);
  }

  function openDeleteConfirm(part: SparePart) {
    setSelectedPart(part);
    setIsDeleteOpen(true);
  }

  function closeAll() {
    setIsFormOpen(false);
    setIsDeleteOpen(false);
    setSelectedPart(null);
  }

  return {
    isFormOpen,
    isDeleteOpen,
    selectedPart,
    openAddForm,
    openEditForm,
    openDeleteConfirm,
    closeAll,
  };
}
