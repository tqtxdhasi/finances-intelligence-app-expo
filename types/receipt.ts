export interface Receipt {
  id: string;
  merchant_id: string;
  date: string;
  time?: string;
  currency: string;
  total: number;
  thumbnail?: string;
  file_type?: string;
  created_at?: string;
  updated_at?: string;
  items?: ReceiptItem[];
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
  name: string;
  quantity: number;
  unit: string;
  price: number;
  created_at?: string;
}

export interface ReceiptFile {
  uri: string;
  type: string;
  name: string;
}
