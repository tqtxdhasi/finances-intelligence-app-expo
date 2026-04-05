// lib/db/merchants/getRecentMerchants.ts
import { Location } from "@/types/data";
import { executeQuery } from "../executeQuery";
import type { MerchantWithStats } from "./getAllMerchantsWithStats";

async function getLocationsForMerchant(
  merchantId: string,
): Promise<Location[]> {
  const sql = `
    SELECT l.*
    FROM locations l
    JOIN merchant_locations ml ON ml.location_id = l.id
    WHERE ml.merchant_id = ?
    ORDER BY l.city, l.location_address
  `;
  return await executeQuery(sql, [merchantId]);
}

export async function getRecentMerchants(
  limit = 10,
): Promise<MerchantWithStats[]> {
  const sql = `
    SELECT m.*, COUNT(r.id) as receiptCount, COALESCE(SUM(r.total_amount), 0) as totalSpent
    FROM merchants m
    LEFT JOIN receipts r ON r.merchant_id = m.id
    GROUP BY m.id
    ORDER BY MAX(r.date) DESC, receiptCount DESC
    LIMIT ?
  `;
  const merchants = await executeQuery(sql, [limit]);

  const result: MerchantWithStats[] = [];
  for (const merchant of merchants) {
    const locations = await getLocationsForMerchant(merchant.id);
    result.push({ ...merchant, locations });
  }
  return result;
}
