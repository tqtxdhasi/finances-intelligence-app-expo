// hooks/products/useProducts.ts
import { useCallback, useState } from "react";
import { generateId } from "./category/createCategory";
import { useUser } from "./useUser";
import { executeQuery } from "./executeQuery";

export interface Product {
  id: string;
  name: string;
  categoryId?: string;
  categoryName?: string;
  createdAt: string;
  // Computed fields
  occurrenceCount: number;
  totalSpent: number;
}

export const useProducts = () => {
  const { userId } = useUser();
  const [loading, setLoading] = useState(false);

  const fetchProducts = useCallback(async (): Promise<Product[]> => {
    if (!userId) return [];

    const query = `
      SELECT 
        p.*,
        c.name as categoryName,
        COALESCE((
          SELECT SUM(ri.quantity) 
          FROM receipt_items ri 
          WHERE ri.product_id = p.id
        ), 0) as occurrenceCount,
        COALESCE((
          SELECT SUM(ri.total_price) 
          FROM receipt_items ri 
          WHERE ri.product_id = p.id
        ), 0) as totalSpent
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      ORDER BY p.name
    `;

    const result = await executeQuery(query, []);
    return (result as any[]) || [];
  }, [userId]);

  const createProduct = useCallback(
    async (data: {
      name: string;
      categoryId?: string;
      aliases?: string[]; // New: list of raw receipt names
    }): Promise<Product> => {
      if (!userId) throw new Error("User not authenticated");

      const productId = generateId();
      const now = new Date().toISOString();

      // Insert product
      await executeQuery(
        `INSERT INTO products (id, name, category_id, created_at)
         VALUES (?, ?, ?, ?)`,
        [
          productId,
          data.name,
          data.categoryId || null,
          now,
        ],
      );

      // Insert aliases if provided
      if (data.aliases && data.aliases.length > 0) {
        for (const rawName of data.aliases) {
          if (rawName.trim()) {
            const aliasId = generateId();
            await executeQuery(
              `INSERT INTO product_aliases (id, product_id, raw_receipt_name)
               VALUES (?, ?, ?)`,
              [
                aliasId,
                productId,
                rawName.trim(),
              ],
            );
          }
        }
      }

      return {
        id: productId,
        name: data.name,
        categoryId: data.categoryId,
        createdAt: now,
        occurrenceCount: 0,
        totalSpent: 0,
      };
    },
    [userId],
  );

  const updateProduct = useCallback(
    async (
      id: string,
      updates: Partial<
        Omit<Product, "id" | "createdAt" | "occurrenceCount" | "totalSpent">
      >,
    ) => {
      const fields = [];
      const values = [];

      if (updates.name !== undefined) {
        fields.push("name = ?");
        values.push(updates.name);
      }
      if (updates.categoryId !== undefined) {
        fields.push("category_id = ?");
        values.push(updates.categoryId);
      }

      if (fields.length === 0) return;

      values.push(id);
      await executeQuery(
        `UPDATE products SET ${fields.join(", ")} WHERE id = ?`,
        values,
      );
    },
    [],
  );

  const deleteProduct = useCallback(
    async (id: string) => {
      if (!userId) return;
      // Note: product_aliases will cascade delete automatically
      await executeQuery("DELETE FROM products WHERE id = ?", [id]);
    },
    [userId],
  );

  return {
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    loading,
  };
};
