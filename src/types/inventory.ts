export type PartStatus = "in-stock" | "out-of-stock";

export interface SparePart {
  id: string;
  partNumber: string;
  name: string;
  category: string;
  quantity: number;
  unitPrice: number;
  lastUpdated: string;
  status: PartStatus;
}

export type PartFormData = Omit<SparePart, "id" | "status" | "lastUpdated">;

export interface FilterState {
  search: string;
  category: string;
  status: string;
}

export type SortField = keyof Pick<
  SparePart,
  "name" | "partNumber" | "quantity" | "unitPrice" | "lastUpdated"
>;

export interface SortConfig {
  field: SortField;
  direction: "asc" | "desc";
}

export interface StatsData {
  label: string;
  value: string | number;
  icon: string;
  trend?: string;
  trendUp?: boolean;
}
