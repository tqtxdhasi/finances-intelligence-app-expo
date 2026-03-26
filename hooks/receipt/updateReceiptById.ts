// services/updateReceiptById.ts
import { Receipt, UpdateReceiptDTO } from "@/types/receipt";
import { executeQuery } from "../executeQuery";
import { getReceiptById } from "./getReceiptById";
import { generateId } from "./createReceipt";

/**
 * Update an existing receipt and its items
 * Pass only the fields you want to update.
 * For items: items with an id are updated, items without id are inserted,
 * items present in DB but not in the array are deleted.
 */
export const updateReceiptById = async (
  id: string,
  data: UpdateReceiptDTO,
): Promise<Receipt> => {
  // 1. Update receipt main fields
  const updates: string[] = [];
  const values: any[] = [];

  const fields = ["merchant", "date", "time", "currency", "total"] as const;
  for (const field of fields) {
    if (data[field] !== undefined) {
      updates.push(`${field} = ?`);
      values.push(data[field]);
    }
  }

  if (updates.length > 0) {
    const updateQuery = `
      UPDATE receipts 
      SET ${updates.join(", ")}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    await executeQuery(updateQuery, [...values, id]);
  }

  // 2. Update items if provided
  if (data.items !== undefined) {
    // Fetch current items from DB
    const currentItems = await executeQuery(
      "SELECT id FROM receipt_items WHERE receipt_id = ?",
      [id],
    );
    const currentIds = new Set(currentItems.map((item: any) => item.id));
    const newItems = data.items;

    // Separate new items into create, update, delete
    const toDelete: string[] = [];
    const toUpdate: any[] = [];
    const toCreate: any[] = [];

    // Build a map of new items by id (if they have one)
    const newItemsMap = new Map();
    for (const item of newItems) {
      if (item.id) {
        newItemsMap.set(item.id, item);
      } else {
        // Items without id are new
        toCreate.push(item);
      }
    }

    // Determine which existing items are missing in the new list (to delete)
    for (const currentId of currentIds) {
      if (!newItemsMap.has(currentId)) {
        toDelete.push(currentId);
      }
    }

    // Items with id that exist in both sets need to be updated
    for (const [itemId, item] of newItemsMap.entries()) {
      if (currentIds.has(itemId)) {
        toUpdate.push({ ...item, id: itemId });
      } else {
        // id provided but not found – treat as new (generate new id)
        toCreate.push({ ...item, id: undefined });
      }
    }

    // 3. Execute delete operations
    if (toDelete.length > 0) {
      const deleteQuery = `DELETE FROM receipt_items WHERE receipt_id = ? AND id IN (${toDelete.map(() => "?").join(",")})`;
      await executeQuery(deleteQuery, [id, ...toDelete]);
    }

    // 4. Execute update operations
    const now = new Date().toISOString();
    for (const item of toUpdate) {
      const updateItemQuery = `
        UPDATE receipt_items 
        SET name = ?, quantity = ?, unit = ?, price = ?, created_at = ?
        WHERE id = ? AND receipt_id = ?
      `;
      await executeQuery(updateItemQuery, [
        item.name,
        item.quantity,
        item.unit || "pcs",
        item.price,
        now,
        item.id,
        id,
      ]);
    }

    // 5. Execute insert operations
    if (toCreate.length > 0) {
      const insertValues: any[] = [];
      const placeholders: string[] = [];

      for (const item of toCreate) {
        const itemId = generateId();
        insertValues.push(
          itemId,
          id,
          item.name,
          item.quantity,
          item.unit || "pcs",
          item.price,
          now,
        );
        placeholders.push("(?, ?, ?, ?, ?, ?, ?)");
      }

      const insertQuery = `
        INSERT INTO receipt_items 
        (id, receipt_id, name, quantity, unit, price, created_at)
        VALUES ${placeholders.join(", ")}
      `;
      await executeQuery(insertQuery, insertValues);
    }
  }

  // Return the updated receipt
  return getReceiptById(id) as Promise<Receipt>;
};
