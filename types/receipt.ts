export interface Receipt {
  id: string;
  merchant: string;
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

export interface ReceiptItem {
  id: string;
  receipt_id: string;
  name: string;
  quantity: number;
  unit: string;
  price: number;
  created_at?: string;
}

export interface CreateReceiptDTO {
  merchant: string;
  date: string;
  time: string;
  currency: string;
  total: number;
  items: {
    name: string;
    quantity: number;
    unit: string;
    price: number;
  }[];
  file?: {
    uri: string;
    type: string;
    name: string;
  } | null;
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
export interface Item {
  id: string;
  name: string;
  quantity: string;
  unit: string;
  price: string;
  category?: string;
}

export interface ReceiptFile {
  uri: string;
  type: string;
  name: string;
}
