// lib/db/product/updateProductById.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { executeQuery } from "../executeQuery";
import { PRODUCTS_QUERY_KEY } from "../product/createProduct";
import { useUser } from "../useUser";

// ----------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------
export interface UpdateProductData {
  name?: string;
  category_id?: string | null;
  default_unit?: string | null;
  aliases?: string[]; // full list of aliases (replaces existing)
}

// ----------------------------------------------------------------------
// Low‑level service function (handles both product fields and aliases)
// ----------------------------------------------------------------------
export const updateProductById = async (
  id: string,
  updates: UpdateProductData,
): Promise<void> => {
  // 1. Update product fields
  const fields: string[] = [];
  const values: any[] = [];

  if (updates.name !== undefined) {
    fields.push("name = ?");
    values.push(updates.name);
  }
  if (updates.category_id !== undefined) {
    fields.push("category_id = ?");
    values.push(updates.category_id);
  }
  if (updates.default_unit !== undefined) {
    fields.push("default_unit = ?");
    values.push(updates.default_unit);
  }

  if (fields.length > 0) {
    values.push(id);
    await executeQuery(
      `UPDATE products SET ${fields.join(", ")} WHERE id = ?`,
      values,
    );
  }

  // 2. Handle aliases (replace entire set)
  if (updates.aliases !== undefined) {
    // Delete all existing aliases for this product
    await executeQuery("DELETE FROM product_aliases WHERE product_id = ?", [
      id,
    ]);

    // Insert new aliases
    if (updates.aliases.length > 0) {
      const aliasValues: any[] = [];
      const placeholders: string[] = [];

      for (const rawName of updates.aliases) {
        const trimmed = rawName.trim();
        if (!trimmed) continue;
        const aliasId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        aliasValues.push(aliasId, id, trimmed);
        placeholders.push("(?, ?, ?)");
      }

      if (placeholders.length) {
        await executeQuery(
          `INSERT INTO product_aliases (id, product_id, raw_receipt_name)
           VALUES ${placeholders.join(", ")}`,
          aliasValues,
        );
      }
    }
  }
};

// ----------------------------------------------------------------------
// React Query hook
// ----------------------------------------------------------------------
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  const { userId } = useUser();

  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: UpdateProductData;
    }) => {
      if (!userId) throw new Error("User not authenticated");
      await updateProductById(id, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
    },
  });
};
