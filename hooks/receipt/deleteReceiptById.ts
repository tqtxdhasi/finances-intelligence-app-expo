import { executeQuery } from "../executeQuery";


/**
 * Delete a receipt and all its items (cascade delete)
 */
export const deleteReceiptById = async (id: string): Promise<boolean> => {
  const deleteQuery = "DELETE FROM receipts WHERE id = ?";
  const result = await executeQuery(deleteQuery, [id]);
  return result.changes > 0;
};
