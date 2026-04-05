// lib/db/merchants/deleteMerchantById.ts

import { executeQuery } from "../executeQuery";

export async function deleteMerchantById(merchantId: string): Promise<void> {
  await executeQuery("DELETE FROM merchants WHERE id = ?", [merchantId]);
}
