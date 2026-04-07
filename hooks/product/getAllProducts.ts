// lib/db/product/getAllProducts.ts
import { Product } from "@/types/data";
import { useQuery } from "@tanstack/react-query";
import { executeQuery } from "../executeQuery";
import { useUser } from "../useUser";

// ----------------------------------------------------------------------
// Constants
// ----------------------------------------------------------------------
export const PRODUCTS_QUERY_KEY = ["products"] as const;

// ----------------------------------------------------------------------
// Low‑level service function
// ----------------------------------------------------------------------
/**
 * Fetches all products for a given user, including:
 * - category name
 * - occurrence count (total quantity from receipt_items)
 * - total amount spent on this product
 */
export const getAllProducts = async (
  userId: string | null,
): Promise<Product[]> => {
  if (!userId) return [];

  const query = `
    SELECT 
      p.*,
      c.name as category,
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
};

// ----------------------------------------------------------------------
// React Query hook
// ----------------------------------------------------------------------
export const useGetAllProducts = () => {
  const { userId } = useUser();

  return useQuery({
    queryKey: PRODUCTS_QUERY_KEY,
    queryFn: () => getAllProducts(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
