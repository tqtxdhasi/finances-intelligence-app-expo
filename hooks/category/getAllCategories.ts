import { Category } from "@/types/data";
import { executeQuery } from "../executeQuery";

export interface GetAllCategoriesParams {
  parentId?: string | null; // if provided, fetch only direct children
  sortBy?: "name" | "level" | "created_at";
  sortOrder?: "ASC" | "DESC";
}

export const getAllCategories = async (
  params: GetAllCategoriesParams = {},
): Promise<Category[]> => {
  const { parentId, sortBy = "name", sortOrder = "ASC" } = params;

  const conditions: string[] = [];
  const queryParams: any[] = [];

  if (parentId !== undefined) {
    conditions.push("parent_id = ?");
    queryParams.push(parentId);
  }

  const whereClause = conditions.length
    ? `WHERE ${conditions.join(" AND ")}`
    : "";

  const allowedSortFields = ["name", "level", "created_at"];
  const safeSortBy = allowedSortFields.includes(sortBy) ? sortBy : "name";
  const safeSortOrder = sortOrder.toUpperCase() === "ASC" ? "ASC" : "DESC";

  const query = `
    SELECT * FROM categories
    ${whereClause}
    ORDER BY ${safeSortBy} ${safeSortOrder}
  `;

  const results = await executeQuery(query, queryParams);
  return results.map((row: any) => ({
    id: row.id,
    taxonomy_id: row.taxonomy_id,
    name: row.name,
    parentId: row.parent_id,
    level: row.level,
    createdAt: row.created_at,
  }));
};
