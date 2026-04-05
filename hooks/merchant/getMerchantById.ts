// lib/db/merchants/getMerchantById.ts
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

export async function getMerchantById(
  id: string,
): Promise<MerchantWithStats | null> {
  const merchantQuery = `
    SELECT 
      m.*, 
      COUNT(DISTINCT r.id) AS receiptCount, 
      COALESCE(SUM(r.total_amount), 0) AS totalSpent
    FROM merchants m
    LEFT JOIN receipts r ON m.id = r.merchant_id
    WHERE m.id = ?
    GROUP BY m.id
  `;
  const merchants = await executeQuery(merchantQuery, [id]);
  if (!merchants || merchants.length === 0) return null;

  const merchant = merchants[0];
  const locations = await getLocationsForMerchant(id);
  return { ...merchant, locations };
}
