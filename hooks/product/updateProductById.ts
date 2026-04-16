// lib/db/product/updateProductById.ts
import { Product } from "@/types/data";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { executeQuery } from "../executeQuery";
import { useUser } from "../useUser";
import { PRODUCTS_QUERY_KEY } from "./createProduct"; // shared query key

export interface UpdateProductDTO {
  name?: string; // new product name (optional)
  categoryId?: string | null; // new category ID, null to remove, undefined to leave unchanged
  defaultUnit?: string | null; // new default unit, null to remove
  aliases?: string[]; // full replacement list of raw receipt names
}

const generateId = (): string => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

export const updateProductById = async (
  id: string,
  data: UpdateProductDTO,
): Promise<Product> => {
  const { name, categoryId, defaultUnit, aliases } = data;

  // 1. Validate category if provided
  if (categoryId !== undefined) {
    // If categoryId is null, we skip validation (it's allowed to be null)
    if (categoryId !== null) {
      const categoryCheck = await executeQuery(
        "SELECT id FROM categories WHERE id = ?",
        [categoryId],
      );
      if (!Array.isArray(categoryCheck) || categoryCheck.length === 0) {
        throw new Error(`Category with id "${categoryId}" does not exist.`);
      }
    }
  }

  // 2. Build dynamic UPDATE query for product fields
  const updates: string[] = [];
  const params: any[] = [];

  if (name !== undefined) {
    updates.push("name = ?");
    params.push(name);
  }
  if (categoryId !== undefined) {
    updates.push("category_id = ?");
    params.push(categoryId === null ? null : categoryId);
  }
  if (defaultUnit !== undefined) {
    updates.push("default_unit = ?");
    params.push(defaultUnit === null ? null : defaultUnit);
  }

  if (updates.length > 0) {
    params.push(id); // for WHERE clause
    await executeQuery(
      `UPDATE products SET ${updates.join(", ")} WHERE id = ?`,
      params,
    );
  }

  // 3. Handle aliases replacement (if provided)
  if (aliases !== undefined) {
    // Delete existing aliases
    await executeQuery("DELETE FROM product_aliases WHERE product_id = ?", [
      id,
    ]);

    // Insert new aliases (filter empty/whitespace-only strings)
    const validAliases = aliases.filter((a) => a && a.trim().length > 0);
    if (validAliases.length > 0) {
      const aliasValues: any[] = [];
      const placeholders: string[] = [];

      for (const rawName of validAliases) {
        const trimmed = rawName.trim();
        const aliasId = generateId();
        aliasValues.push(aliasId, id, trimmed);
        placeholders.push("(?, ?, ?)");
      }

      await executeQuery(
        `INSERT INTO product_aliases (id, product_id, raw_receipt_name)
         VALUES ${placeholders.join(", ")}`,
        aliasValues,
      );
    }
  }

  // 4. Retrieve and return the updated product
  const result = await executeQuery("SELECT * FROM products WHERE id = ?", [
    id,
  ]);
  if (!Array.isArray(result) || result.length === 0) {
    throw new Error(`Product with id "${id}" not found after update`);
  }

  const row = result[0];
  return {
    id: row.id,
    name: row.name,
    category_id: row.category_id,
    default_unit: row.default_unit,
    created_at: row.created_at,
  };
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  const { userId } = useUser();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: UpdateProductDTO;
    }) => {
      if (!userId) throw new Error("User not authenticated");
      return updateProductById(id, data);
    },
    onSuccess: (_data, variables) => {
      // Invalidate the whole products list
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
      // Also invalidate the individual product query if it exists
      queryClient.invalidateQueries({
        queryKey: [...PRODUCTS_QUERY_KEY, variables.id],
      });
    },
  });
};
