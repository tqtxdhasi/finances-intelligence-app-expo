// lib/db/product/getProductById.ts
import { Product } from "@/types/data";
import { useQuery } from "@tanstack/react-query";
import { executeQuery } from "../executeQuery";
import { PRODUCTS_QUERY_KEY } from "./getAllProducts"; // reuse the same base key

// ----------------------------------------------------------------------
// Extended type that includes aliases
// ----------------------------------------------------------------------
export interface ProductWithAliases extends Product {
  aliases: string[]; // raw_receipt_name values
}

// ----------------------------------------------------------------------
// Low‑level service function
// ----------------------------------------------------------------------
export const getProductById = async (
  id: string,
): Promise<ProductWithAliases | null> => {
  // 1. Fetch product details
  const productQuery = `
    SELECT 
      p.*,
      c.name as category
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.id = ?
  `;
  const productResult = await executeQuery(productQuery, [id]);
  if (!Array.isArray(productResult) || productResult.length === 0) {
    return null;
  }
  const productRow = productResult[0];

  // 2. Fetch aliases
  const aliasesQuery = `
    SELECT raw_receipt_name
    FROM product_aliases
    WHERE product_id = ?
    ORDER BY raw_receipt_name
  `;
  const aliasesResult = await executeQuery(aliasesQuery, [id]);
  const aliases = Array.isArray(aliasesResult)
    ? aliasesResult.map((row: any) => row.raw_receipt_name)
    : [];

  // 3. Combine and return
  return {
    id: productRow.id,
    name: productRow.name,
    category_id: productRow.category_id,
    default_unit: productRow.default_unit,
    created_at: productRow.created_at,
    category: productRow.category,
    occurrenceCount: 0, // not needed for single product, but keep for type compatibility
    totalSpent: 0,
    aliases,
  };
};

// ----------------------------------------------------------------------
// React Query hook
// ----------------------------------------------------------------------
export const useProductById = (id: string | null) => {
  return useQuery({
    queryKey: [...PRODUCTS_QUERY_KEY, id],
    queryFn: async () => {
      if (!id) return null;
      const product = await getProductById(id);
      if (!product) throw new Error(`Product with id ${id} not found`);
      return product;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};
