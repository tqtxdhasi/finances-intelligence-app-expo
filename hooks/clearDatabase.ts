// hooks/clearDatabase.ts
import { executeQuery } from "./executeQuery";

export async function clearDatabase(): Promise<void> {
  // Disable foreign key checks temporarily to allow truncation in any order
  await executeQuery("PRAGMA foreign_keys = OFF");

  try {
    // List all tables (order doesn't matter with FK off, but we'll do child→parent for clarity)
    const tables = [
      "receipt_items",
      "receipts",
      "product_aliases",
      "products",
      "merchant_locations",
      "locations",
      "merchants",
      "categories",
      "users",
    ];

    for (const table of tables) {
      await executeQuery(`DELETE FROM ${table}`);
      // Reset auto-increment (SQLite uses sqlite_sequence)
      await executeQuery(`DELETE FROM sqlite_sequence WHERE name = ?`, [table]);
    }
  } finally {
    // Re-enable foreign keys
    await executeQuery("PRAGMA foreign_keys = ON");
  }
}
