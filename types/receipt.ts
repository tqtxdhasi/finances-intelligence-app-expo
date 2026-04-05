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

// types/receipt.ts
export interface CreateReceiptDTO {
  userId: string; // required – from your auth system
  merchantId: string; // instead of merchant name
  locationId?: string; // optional
  date: string; // ISO datetime string
  subtotalAmount?: number; // before tax
  taxAmount?: number; // default 0
  totalAmount: number; // final total
  currency: string; // e.g., "USD"
  paymentType?: string; // e.g., "credit_card"
  items: {
    rawName: string; // original item name from receipt
    quantity: number;
    unitPrice: number; // price per unit
    totalPrice: number; // quantity * unitPrice - discount
    discountAmount?: number;
    unitOfMeasure?: string; // "pcs", "kg", etc.
    // optionally productId or categoryId can be resolved later
  }[];
  imagePath?: string; // URI of the uploaded file
}

export interface UpdateReceiptDTO {
  merchant?: string;
  date?: string;
  time?: string;
  currency?: string;
  total?: number;
  items?: {
    id?: string;
    name: string;
    quantity: number;
    unit: string;
    price: number;
  }[];
}

export interface ReceiptsListResponse {
  receipts: Receipt[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface QueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: "date" | "merchant" | "total" | string; // Allow string but restrict in usage
  sortOrder?: "ASC" | "DESC" | string;
  dateFrom?: string;
  dateTo?: string;
  minTotal?: number;
  maxTotal?: number;
  currency?: string;
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

export interface ReceiptFile {
  uri: string;
  type: string;
  name: string;
}
