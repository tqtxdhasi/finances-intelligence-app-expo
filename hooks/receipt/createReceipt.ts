import { CreateReceiptDTO, Receipt } from "@/types/receipt";
import { executeQuery } from "../executeQuery";
import { getReceiptById } from "./getReceiptById";

export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};
/**
 * Create a new receipt with all its items
 */
export const createReceipt = async (
  data: CreateReceiptDTO,
): Promise<Receipt> => {
  const receiptId = generateId();
  const now = new Date().toISOString();

  // Calculate total if not provided
  const total =
    data.total ||
    data.items.reduce((sum, item) => {
      return sum + item.quantity * item.price;
    }, 0);

  // Insert receipt
  const receiptQuery = `
    INSERT INTO receipts (
      id, merchant, date, time, currency, total, thumbnail, file_type, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  await executeQuery(receiptQuery, [
    receiptId,
    data.merchant,
    data.date,
    data.time || null,
    data.currency || "USD",
    total,
    data.file?.uri || null,
    data.file?.type || null,
    now,
    now,
  ]);

  // Insert items
  if (data.items.length > 0) {
    const itemValues: any[] = [];
    const placeholders: string[] = [];

    data.items.forEach((item) => {
      const itemId = generateId();
      itemValues.push(
        itemId,
        receiptId,
        item.name,
        item.quantity,
        item.unit || "pcs",
        item.price,
        now,
      );
      placeholders.push("(?, ?, ?, ?, ?, ?, ?)");
    });

    const itemsQuery = `
      INSERT INTO receipt_items 
      (id, receipt_id, name, quantity, unit, price, created_at)
      VALUES ${placeholders.join(", ")}
    `;

    await executeQuery(itemsQuery, itemValues);
  }

  // Return created receipt with items
  return getReceiptById(receiptId) as Promise<Receipt>;
};
