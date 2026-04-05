// lib/db/merchantQueries.ts
import { Location, Merchant } from "@/types/data";
import { executeQuery } from "../executeQuery";

export interface MerchantWithLocations extends Merchant {
  locations: Location[];
}

export async function searchMerchants(
  query: string,
): Promise<MerchantWithLocations[]> {
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

  // Attach locations for each merchant
  const result: MerchantWithLocations[] = [];
  for (const merchant of merchants) {
    const locationsSql = `
      SELECT l.* FROM locations l
      JOIN merchant_locations ml ON ml.location_id = l.id
      WHERE ml.merchant_id = ?
      ORDER BY l.city, l.location_address
    `;
    const locations = await executeQuery(locationsSql, [merchant.id]);
    result.push({ ...merchant, locations: locations || [] });
  }
  return result;
}

export async function getRecentMerchants(
  limit = 10,
): Promise<MerchantWithLocations[]> {
  const sql = `
    SELECT m.*, COUNT(r.id) as receiptCount
    FROM merchants m
    LEFT JOIN receipts r ON r.merchant_id = m.id
    GROUP BY m.id
    ORDER BY MAX(r.date) DESC, receiptCount DESC
    LIMIT ?
  `;
  const merchants = await executeQuery(sql, [limit]);
  // Same location attachment as above
  const result: MerchantWithLocations[] = [];
  for (const merchant of merchants) {
    const locations = await executeQuery(
      `SELECT l.* FROM locations l JOIN merchant_locations ml ON ml.location_id = l.id WHERE ml.merchant_id = ?`,
      [merchant.id],
    );
    result.push({ ...merchant, locations: locations || [] });
  }
  return result;
}
