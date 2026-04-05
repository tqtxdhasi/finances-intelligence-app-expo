// ========== Core Entities ==========

export interface User {
  id: string;
  email: string;
  name?: string | null;
  default_currency: string; // e.g. 'USD'
  default_country: string;
  created_at: string;
  updated_at: string;
}

export interface Merchant {
  id: string;
  name: string;
  alternative_names?: string | null;
  domain?: string | null;
  merchant_logo?: string | null;
  industry_type?: string | null;
  country_code?: string | null;
  tax_registration_id?: string | null;
  created_at: string;
  updated_at: string;
  // Aggregated fields (computed, not stored in merchants table)
  receiptCount?: number;
  totalSpent?: number | 0;
  locations?: Location[];
}

export interface Location {
  id: string;
  location_address: string;
  city: string;
  province?: string | null;
  country_code: string;
  zip: string;
  external_place_id?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  created_at: string;
  updated_at: string;
}

// Junction table between merchants and locations
export interface MerchantLocation {
  merchant_id: string;
  location_id: string;
}

export interface Category {
  id: string;
  taxonomy_id?: string | null;
  name: string;
  parent_id?: string | null;
  level?: number | null;
  created_at: string;
}

export interface MerchantCategoryConstraint {
  merchant_id: string;
  root_category_id: string;
}

export interface Product {
  id: string;
  name: string;
  category_id?: string | null;
  user_id?: string | null; // user who discovered it
  created_at: string;
  // Aggregated fields (computed)
  normalizedName?: string;
  occurrenceCount?: number;
  totalSpent?: number;
  category?: string; // optional category name
}

export interface ProductAlias {
  id: string;
  product_id: string;
  raw_receipt_name: string;
  usage_count: number;
  last_used_at: string;
  user_id?: string | null;
}

// ========== DTOs (Data Transfer Objects) ==========

export interface CreateCategoryDTO {
  name: string;
  parentId?: string | null;
}

// For merchant creation (matches your SQL insert)
export interface CreateMerchantDTO {
  name: string;
  alternative_names?: string;
  domain?: string;
  merchant_logo?: string;
  industry_type?: string;
  country_code?: string;
  tax_registration_id?: string;
  locations?: Omit<Location, "id" | "created_at" | "updated_at">[];
}

// For editing a merchant (including its locations)
export interface UpdateMerchantDTO {
  name?: string;
  alternative_names?: string | null;
  domain?: string | null;
  merchant_logo?: string | null;
  industry_type?: string | null;
  country_code?: string | null;
  tax_registration_id?: string | null;
  locations?: Location[]; // full replacement of linked locations
}
export interface CategoryTreeNode extends Category {
  subcategories: CategoryTreeNode[];
}
