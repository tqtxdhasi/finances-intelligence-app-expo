import { Category } from "@/types/data";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { executeQuery } from "../executeQuery";

export interface GetAllCategoriesParams {
  parentId?: string | null;
  sortBy?: "name" | "level" | "created_at";
  sortOrder?: "ASC" | "DESC";
}

export const CATEGORIES_QUERY_KEY = ["categories"] as const;

export const useCategories = (params?: GetAllCategoriesParams) => {
  return useQuery({
    queryKey: [...CATEGORIES_QUERY_KEY, params || {}],
    queryFn: () => getAllCategories(params || {}),
    // These options are already set globally, but you can override
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Helper to invalidate cache (useful after mutations)
export const useInvalidateCategories = () => {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY });
  };
};

// Helper to update cache manually (optimistic updates)
export const useUpdateCategoriesCache = () => {
  const queryClient = useQueryClient();

  return (updater: (old: Category[] | undefined) => Category[]) => {
    queryClient.setQueryData(CATEGORIES_QUERY_KEY, updater);
  };
};

export async function getAllCategories(
  params: GetAllCategoriesParams = {},
): Promise<Category[]> {
  const { parentId, sortBy = "name", sortOrder = "ASC" } = params;

  const conditions = parentId !== undefined ? ["parent_id = ?"] : [];
  const queryParams = parentId !== undefined ? [parentId] : [];
  const whereClause = conditions.length
    ? `WHERE ${conditions.join(" AND ")}`
    : "";
  const safeSortBy = ["name", "level", "created_at"].includes(sortBy)
    ? sortBy
    : "name";
  const safeSortOrder = sortOrder.toUpperCase() === "ASC" ? "ASC" : "DESC";

  const query = `
    SELECT id, taxonomy_id, name, parent_id, level, created_at
    FROM categories
    ${whereClause}
    ORDER BY ${safeSortBy} ${safeSortOrder}
  `;

  const rows = await executeQuery(query, queryParams);
  return rows.map((row: any) => ({
    id: row.id,
    taxonomy_id: row.taxonomy_id,
    name: row.name,
    parent_id: row.parent_id,
    level: row.level,
    created_at: row.created_at,
  }));
}
