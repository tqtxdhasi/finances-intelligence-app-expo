// hooks/deleteProductById.ts

import { executeQuery } from "../executeQuery";

export async function deleteProductById(id: string): Promise<void> {
  await executeQuery("DELETE FROM products WHERE id = ?", [id]);
}
