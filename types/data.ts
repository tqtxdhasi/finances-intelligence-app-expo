export interface Category {
  id: string;
  name: string;
  parentId?: string;
  subcategories?: Category[];
  level?: number;
}

export interface Location {
  id: string;
  address: string;
  // add other fields if needed (phone, hours, etc.)
}

export interface Merchant {
  id: string;
  name: string;
  receiptCount: number;
  totalSpent: number;
  locations: Location[];
}

// Also update FormData to include locations for merchant editing
export interface FormData {
  name: string;
  parentId: string;
  categoryId: string;
  locations?: Location[]; // for merchant
}

export interface Item {
  id: string;
  name: string;
  normalizedName: string;
  occurrenceCount: number;
  totalSpent: number;
  category?: string;
}
