import { Category, CreateCategoryDTO } from "@/types/data";
import { executeQuery } from "../executeQuery";

export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const createCategory = async (
  data: CreateCategoryDTO,
): Promise<Category> => {
  const { name, parentId } = data;
  const id = generateId();
  const now = new Date().toISOString();

  // Determine level
  let level = 0;
  if (parentId) {
    const parentResult = await executeQuery(
      "SELECT level FROM categories WHERE id = ?",
      [parentId],
    );
    if (parentResult.length > 0) {
      level = parentResult[0].level + 1;
    } else {
      throw new Error("Parent category not found");
    }
  }

  const query = `
    INSERT INTO categories (id, name, parent_id, level, created_at)
    VALUES (?, ?, ?, ?, ?)
  `;
  await executeQuery(query, [id, name, parentId || null, level, now]);

  // Fetch the created category
  const created = await executeQuery("SELECT * FROM categories WHERE id = ?", [
    id,
  ]);
  if (created.length === 0) {
    throw new Error("Failed to create category");
  }
  const row = created[0];
  return {
    id: row.id,
    taxonomy_id: row.taxonomy_id,
    name: row.name,
    parentId: row.parent_id,
    level: row.level,
    createdAt: row.created_at,
  };
};
