"use client";

// Eskiden: veri localStorage'da duruyordu (sadece o tarayıcıda görünürdü)
// Şimdi: veri Supabase PostgreSQL'de duruyor, API üzerinden erişiyoruz
// Böylece farklı cihazlar aynı veriyi görür

import { useState, useEffect, useCallback } from "react";
import type { SparePart, PartFormData } from "@/types/inventory";

export function useInventory() {
  const [parts, setParts] = useState<SparePart[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ── Tüm parçaları çek ──────────────────────────────────────────
  const fetchParts = useCallback(async () => {
    try {
      const res = await fetch("/api/parts");
      if (!res.ok) throw new Error("Veriler alınamadı");
      const data: SparePart[] = await res.json();
      setParts(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Hata oluştu");
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    fetchParts();
  }, [fetchParts]);

  // ── Tek parça ekle ─────────────────────────────────────────────
  async function addPart(data: PartFormData): Promise<void> {
    const res = await fetch("/api/parts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Eklenemedi");
    const created: SparePart = await res.json();
    // Sunucudan dönen veriyi listeye ekle — yeniden fetch'e gerek yok
    setParts((prev) => [created, ...prev]);
  }

  // ── Toplu ekle (Excel import) ──────────────────────────────────
  async function addParts(dataList: PartFormData[]): Promise<void> {
    // Her parçayı sırayla ekle — paralel yaparsak rate-limit riski var
    const created: SparePart[] = [];
    for (const data of dataList) {
      const res = await fetch("/api/parts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        created.push(await res.json());
      }
    }
    setParts((prev) => [...created, ...prev]);
  }

  // ── Güncelle ───────────────────────────────────────────────────
  async function updatePart(id: string, data: PartFormData): Promise<void> {
    const res = await fetch(`/api/parts/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Güncellenemedi");
    const updated: SparePart = await res.json();
    setParts((prev) => prev.map((p) => (p.id === id ? updated : p)));
  }

  // ── Sil ────────────────────────────────────────────────────────
  async function deletePart(id: string): Promise<void> {
    const res = await fetch(`/api/parts/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Silinemedi");
    setParts((prev) => prev.filter((p) => p.id !== id));
  }

  return { parts, hydrated, error, addPart, addParts, updatePart, deletePart };
}
