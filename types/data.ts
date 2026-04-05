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

export interface UserMerchant {
  user_id: string;
  merchant_id: string;
  visit_count: number;
  total_spent: number;
  last_visited_at: string;
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

export interface OffCategoryMapping {
  off_tag: string;
  category_id: string;
  confidence: number;
}

export interface ProductAlias {
  id: string;
  product_id: string;
  raw_receipt_name: string;
  usage_count: number;
  last_used_at: string;
  user_id?: string | null;
}

export interface Receipt {
  id: string;
  user_id: string;
  merchant_id: string;
  location_id?: string | null;
  date: string;
  subtotal_amount?: number | null;
  total_amount: number;
  tax_amount?: number | null;
  items_count?: number | null;
  currency: string;
  payment_type?: string | null;
  image_path?: string | null;
  created_at: string;
}

export interface ReceiptItem {
  id: string;
  receipt_id: string;
  product_id?: string | null;
  category_id?: string | null;
  raw_name?: string | null;
  quantity: number;
  unit_price: number;
  total_price: number;
  unit_of_measure?: string | null;
  normalized_quantity?: number | null;
  normalized_unit?: string | null;
  discount_amount?: number | null;
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
