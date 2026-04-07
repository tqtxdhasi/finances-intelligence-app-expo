// hooks/useProducts.ts
import { Product } from "@/types/data";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { generateId } from "../category/createCategory";
import { executeQuery } from "../executeQuery";
import { useUser } from "../useUser";

export const PRODUCTS_QUERY_KEY = ["products"] as const;

// --- Fetch all products ---
async function fetchAllProducts(userId: string | null): Promise<Product[]> {
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
}

// --- Hook to read products with caching ---
export const useProducts = () => {
  const { userId } = useUser();
  return useQuery({
    queryKey: PRODUCTS_QUERY_KEY,
    queryFn: () => fetchAllProducts(userId),
    enabled: !!userId, // only run if userId exists
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// --- Helper to invalidate products cache (after mutations) ---
export const useInvalidateProducts = () => {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
  };
};

// --- Create product mutation ---
export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  const { userId } = useUser();

  return useMutation({
    mutationFn: async (data: {
      name: string;
      categoryId?: string;
      aliases?: string[];
    }): Promise<Product> => {
      if (!userId) throw new Error("User not authenticated");

      const productId = generateId();
      const now = new Date().toISOString();

      // Insert product
      await executeQuery(
        `INSERT INTO products (id, name, category_id, created_at)
         VALUES (?, ?, ?, ?)`,
        [productId, data.name, data.categoryId || null, now],
      );

      // Insert aliases
      if (data.aliases && data.aliases.length > 0) {
        for (const rawName of data.aliases) {
          if (rawName.trim()) {
            const aliasId = generateId();
            await executeQuery(
              `INSERT INTO product_aliases (id, product_id, raw_receipt_name)
               VALUES (?, ?, ?)`,
              [aliasId, productId, rawName.trim()],
            );
          }
        }
      }

      return {
        id: productId,
        name: data.name,
        category_id: data.categoryId,
        created_at: now,
        occurrenceCount: 0,
        totalSpent: 0,
      };
    },
    onSuccess: () => {
      // Invalidate and refetch products list
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
    },
  });
};
// hooks/useProducts.ts (add this helper)
export const useProductById = (id: string) => {
  return useQuery({
    queryKey: [...PRODUCTS_QUERY_KEY, id],
    queryFn: async () => {
      const products = await fetchAllProducts(id);
      const product = products.find((p) => p.id === id);
      if (!product) throw new Error("Product not found");
      return product;
    },
    enabled: !!id,
  });
};
// --- Update product mutation ---
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<Pick<Product, "name" | "category_id">>;
    }) => {
      const fields = [];
      const values = [];

      if (updates.name !== undefined) {
        fields.push("name = ?");
        values.push(updates.name);
      }
      if (updates.category_id !== undefined) {
        fields.push("category_id = ?");
        values.push(updates.category_id);
      }

      if (fields.length === 0) return;

      values.push(id);
      await executeQuery(
        `UPDATE products SET ${fields.join(", ")} WHERE id = ?`,
        values,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
    },
  });
};

// --- Delete product mutation ---
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  const { userId } = useUser();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!userId) return;
      await executeQuery("DELETE FROM products WHERE id = ?", [id]);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
    },
  });
};
