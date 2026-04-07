// lib/db/product/createProduct.ts
import { CreateProductDTO, Product } from "@/types/data";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { executeQuery } from "../executeQuery";
import { useUser } from "../useUser";

// ----------------------------------------------------------------------
// Constants & Helpers
// ----------------------------------------------------------------------
export const PRODUCTS_QUERY_KEY = ["products"] as const;

const generateId = (): string => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

// ----------------------------------------------------------------------
// Low‑level service function (pure database logic)
// ----------------------------------------------------------------------
/**
 * Creates a new product in the database.
 * - Validates category if provided.
 * - Supports optional default unit of measure.
 * - Bulk inserts product aliases.
 * - Returns the created product.
 */
const createProduct = async (
  data: CreateProductDTO,
): Promise<Product> => {
  const productId = generateId();
  const now = new Date().toISOString();
  const { name, categoryId, defaultUnit, aliases = [] } = data;

  // 1. Validate category if provided
  if (categoryId) {
    const categoryCheck = await executeQuery(
      "SELECT id FROM categories WHERE id = ?",
      [categoryId],
    );
    if (!Array.isArray(categoryCheck) || categoryCheck.length === 0) {
      throw new Error(`Category with id "${categoryId}" does not exist.`);
    }
  }

  // 2. Insert the product
  await executeQuery(
    `INSERT INTO products (id, name, category_id, default_unit, created_at)
     VALUES (?, ?, ?, ?, ?)`,
    [productId, name, categoryId || null, defaultUnit || null, now],
  );

  // 3. Bulk insert product aliases (if any)
  if (aliases.length > 0) {
    const aliasValues: any[] = [];
    const placeholders: string[] = [];

    for (const rawName of aliases) {
      const trimmed = rawName.trim();
      if (!trimmed) continue;
      const aliasId = generateId();
      aliasValues.push(aliasId, productId, trimmed);
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

  // 4. Retrieve and return the created product
  const result = await executeQuery("SELECT * FROM products WHERE id = ?", [
    productId,
  ]);
  if (!Array.isArray(result) || result.length === 0) {
    throw new Error("Failed to retrieve created product");
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

// ----------------------------------------------------------------------
// React Query hook (for use in components)
// ----------------------------------------------------------------------
/**
 * Mutation hook to create a product.
 * Automatically invalidates the products cache on success.
 */
export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  const { userId } = useUser();

  return useMutation({
    mutationFn: async (data: CreateProductDTO): Promise<Product> => {
      if (!userId) throw new Error("User not authenticated");
      return createProduct(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
    },
  });
};
