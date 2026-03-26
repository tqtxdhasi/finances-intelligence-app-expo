import { Category, Item, Merchant } from "../types/data";

export const dummyCategories: Category[] = [
  {
    id: "1",
    name: "Groceries",
    subcategories: [
      { id: "1a", name: "Dairy", parentId: "1" },
      { id: "1b", name: "Bakery", parentId: "1" },
      { id: "1c", name: "Meat", parentId: "1" },
      { id: "1d", name: "Produce", parentId: "1" },
      { id: "1e", name: "Beverages", parentId: "1" },
    ],
  },
  {
    id: "2",
    name: "Dining Out",
    subcategories: [
      { id: "2a", name: "Restaurants", parentId: "2" },
      { id: "2b", name: "Cafes", parentId: "2" },
      { id: "2c", name: "Fast Food", parentId: "2" },
    ],
  },
  {
    id: "3",
    name: "Transportation",
    subcategories: [
      { id: "3a", name: "Gas", parentId: "3" },
      { id: "3b", name: "Public Transit", parentId: "3" },
      { id: "3c", name: "Ride Share", parentId: "3" },
    ],
  },
  {
    id: "4",
    name: "Utilities",
    subcategories: [
      { id: "4a", name: "Electricity", parentId: "4" },
      { id: "4b", name: "Water", parentId: "4" },
      { id: "4c", name: "Internet", parentId: "4" },
    ],
  },
  {
    id: "5",
    name: "Entertainment",
    subcategories: [
      { id: "5a", name: "Movies", parentId: "5" },
      { id: "5b", name: "Streaming", parentId: "5" },
      { id: "5c", name: "Games", parentId: "5" },
    ],
  },
];

export const dummyMerchants: Merchant[] = [
  {
    id: "1",
    name: "Walmart",
    receiptCount: 45,
    totalSpent: 1245.67,
    locations: [
      { id: "loc1", address: "123 Main St, City, State" },
      { id: "loc2", address: "456 Oak Ave, City, State" },
    ],
  },
  {
    id: "2",
    name: "Target",
    receiptCount: 32,
    totalSpent: 876.43,
    locations: [{ id: "loc3", address: "789 Pine Rd, City, State" }],
  },
  {
    id: "3",
    name: "Starbucks",
    receiptCount: 28,
    totalSpent: 142.5,
    locations: [{ id: "loc4", address: "321 Elm St, City, State" }],
  },
  {
    id: "4",
    name: "Shell Gas Station",
    receiptCount: 24,
    totalSpent: 589.2,
    locations: [{ id: "loc5", address: "111 First Ave, City, State" }],
  },
  {
    id: "5",
    name: "Amazon",
    receiptCount: 18,
    totalSpent: 654.3,
    locations: [{ id: "loc6", address: "410 Terry Ave N, Seattle, WA" }],
  },
  {
    id: "6",
    name: "Whole Foods",
    receiptCount: 15,
    totalSpent: 432.8,
    locations: [{ id: "loc7", address: "123 Market St, City, State" }],
  },
  {
    id: "7",
    name: "Netflix",
    receiptCount: 12,
    totalSpent: 179.88,
    locations: [{ id: "loc8", address: "100 Winchester Cir, Los Gatos, CA" }],
  },
  {
    id: "8",
    name: "Uber",
    receiptCount: 10,
    totalSpent: 145.6,
    locations: [{ id: "loc9", address: "1455 Market St, San Francisco, CA" }],
  },
];

export const dummyItems: Item[] = [
  {
    id: "1",
    name: "Milk 2%",
    normalizedName: "milk",
    occurrenceCount: 42,
    totalSpent: 189.5,
    category: "Dairy",
  },
  {
    id: "2",
    name: "Bread",
    normalizedName: "bread",
    occurrenceCount: 38,
    totalSpent: 114.0,
    category: "Bakery",
  },
  {
    id: "3",
    name: "Eggs",
    normalizedName: "eggs",
    occurrenceCount: 28,
    totalSpent: 84.0,
    category: "Dairy",
  },
  {
    id: "4",
    name: "Chicken Breast",
    normalizedName: "chicken",
    occurrenceCount: 24,
    totalSpent: 156.0,
    category: "Meat",
  },
  {
    id: "5",
    name: "Coffee Beans",
    normalizedName: "coffee",
    occurrenceCount: 18,
    totalSpent: 126.0,
    category: "Beverages",
  },
  {
    id: "6",
    name: "Cheese",
    normalizedName: "cheese",
    occurrenceCount: 16,
    totalSpent: 89.5,
    category: "Dairy",
  },
  {
    id: "7",
    name: "Apples",
    normalizedName: "apples",
    occurrenceCount: 14,
    totalSpent: 42.0,
    category: "Produce",
  },
  {
    id: "8",
    name: "Pasta",
    normalizedName: "pasta",
    occurrenceCount: 12,
    totalSpent: 48.0,
    category: "Groceries",
  },
  {
    id: "9",
    name: "Toilet Paper",
    normalizedName: "toilet-paper",
    occurrenceCount: 10,
    totalSpent: 45.5,
    category: "Household",
  },
  {
    id: "10",
    name: "Laundry Detergent",
    normalizedName: "detergent",
    occurrenceCount: 8,
    totalSpent: 72.0,
    category: "Household",
  },
];
