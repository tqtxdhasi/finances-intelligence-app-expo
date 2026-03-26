import { Receipt } from "@/types/receipt";
import { executeQuery } from "../executeQuery";

export const getReceiptById = async (id: string): Promise<Receipt | null> => {
  // Get receipt
  const receiptQuery = "SELECT * FROM receipts WHERE id = ?";
  const receipts = await executeQuery(receiptQuery, [id]);

  if (!receipts.length) return null;

  const receipt = receipts[0];

  // Get items
  const itemsQuery = `
    SELECT * FROM receipt_items 
    WHERE receipt_id = ? 
    ORDER BY created_at ASC
  `;
  const items = await executeQuery(itemsQuery, [id]);

  receipt.items = items;

  return receipt as Receipt;
};
