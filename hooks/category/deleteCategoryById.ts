// lib/db/categories/deleteCategoryById.ts
import { executeQuery } from "../executeQuery";

export async function deleteCategoryById(categoryId: string): Promise<void> {
  await executeQuery("DELETE FROM categories WHERE id = ?", [categoryId]);
}
