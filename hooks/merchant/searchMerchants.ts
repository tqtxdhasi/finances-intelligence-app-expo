// lib/db/merchants/searchMerchants.ts
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

export async function searchMerchants(
  query: string,
): Promise<MerchantWithStats[]> {
  if (!query.trim()) return [];

  const searchPattern = `%${query}%`;
  const sql = `
    SELECT m.*
    FROM merchants m
    WHERE m.name LIKE ? OR m.alternative_names LIKE ?
    ORDER BY 
      CASE WHEN m.name LIKE ? THEN 1 ELSE 2 END,
      m.name ASC
    LIMIT 20
  `;
  const merchants = await executeQuery(sql, [
    searchPattern,
    searchPattern,
    `${query}%`,
  ]);

  const result: MerchantWithStats[] = [];
  for (const merchant of merchants) {
    const locations = await getLocationsForMerchant(merchant.id);
    result.push({
      ...merchant,
      receiptCount: 0,
      totalSpent: 0,
      locations,
    });
  }
  return result;
}
