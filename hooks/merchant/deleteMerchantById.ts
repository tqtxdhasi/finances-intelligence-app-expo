// lib/db/merchants/deleteMerchantById.ts

import { executeQuery } from "../executeQuery";

export async function deleteMerchantById(merchantId: string): Promise<void> {
  if (!merchantId || merchantId.trim() === "") {
    throw new Error("deleteMerchantById requires a non-empty merchantId");
  }

  try {
    await executeQuery("DELETE FROM merchants WHERE id = ?", [merchantId]);
    console.log(`Merchant ${merchantId} deleted successfully`);
  } catch (error) {
    console.error(`Failed to delete merchant ${merchantId}:`, error);
    // Re-throw a clean error so the caller can handle it
    throw new Error(
      error instanceof Error
        ? error.message
        : "Unknown database error during merchant deletion",
    );
  }
}
