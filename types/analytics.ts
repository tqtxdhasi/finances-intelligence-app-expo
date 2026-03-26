export interface ExpenseData {
  date: string;
  total: number;
}

export interface TopExpense {
  id: string;
  name: string;
  total: number;
  percentage: number;
}

export interface ProductDetail {
  id: string;
  name: string;
  totalSpent: number;
  totalQuantity: number;
  averagePrice: number;
  averageFrequencyDays: number;
  lastPurchaseDate: string;
  history: {
    date: string;
    quantity: number;
    price: number;
    receiptId: string;
  }[];
}
