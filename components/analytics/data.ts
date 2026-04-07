import { ExpenseData, ProductDetail, TopExpense } from "@/types/analytics";

export const generateDummyData = (days: number): ExpenseData[] => {
  const data: ExpenseData[] = [];
  const today = new Date();
  for (let i = days; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toISOString().split("T")[0],
      total: Math.random() * 200 + 20,
    });
  }
  return data;
};

export const dummyTopCategories: TopExpense[] = [
  { id: "1", name: "Groceries", total: 450.75, percentage: 35 },
  { id: "2", name: "Dining Out", total: 280.5, percentage: 22 },
  { id: "3", name: "Transportation", total: 195.25, percentage: 15 },
  { id: "4", name: "Entertainment", total: 120.0, percentage: 9 },
  { id: "5", name: "Utilities", total: 95.5, percentage: 7 },
];

export const dummyTopProducts: TopExpense[] = [
  { id: "1", name: "Milk", total: 85.5, percentage: 12 },
  { id: "2", name: "Bread", total: 42.25, percentage: 6 },
  { id: "3", name: "Coffee", total: 38.75, percentage: 5 },
  { id: "4", name: "Cheese", total: 32.0, percentage: 4 },
  { id: "5", name: "Pasta", total: 28.5, percentage: 3 },
];

export const dummyProductDetail: ProductDetail = {
  id: "1",
  name: "Milk",
  totalSpent: 85.5,
  totalQuantity: 28.5,
  averagePrice: 3.0,
  averageFrequencyDays: 3.2,
  lastPurchaseDate: "2025-03-22",
  history: [
    { date: "2025-03-22", quantity: 2, price: 6.0, receiptId: "r1" },
    { date: "2025-03-19", quantity: 2, price: 6.0, receiptId: "r2" },
    { date: "2025-03-16", quantity: 2, price: 5.8, receiptId: "r3" },
    { date: "2025-03-13", quantity: 2, price: 6.0, receiptId: "r4" },
    { date: "2025-03-10", quantity: 2, price: 5.9, receiptId: "r5" },
  ],
};
