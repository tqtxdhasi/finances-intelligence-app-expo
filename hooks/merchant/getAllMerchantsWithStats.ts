// lib/db/merchants/getAllMerchantsWithStats.ts
import { Location, Merchant } from "@/types/data";
import { executeQuery } from "../executeQuery";

export interface MerchantWithStats extends Merchant {
  receiptCount: number;
  totalSpent: number;
  locations: Location[];
}

export async function getAllMerchantsWithStats(): Promise<MerchantWithStats[]> {
  const sql = `
    SELECT 
      m.id,
      m.name,
      m.alternative_names,
      m.domain,
      m.merchant_logo,
      m.industry_type,
      m.country_code,
      m.tax_registration_id,
      m.created_at,
      m.updated_at,
      COUNT(DISTINCT r.id) AS receiptCount,
      COALESCE(SUM(r.total_amount), 0) AS totalSpent,
      COALESCE(
        json_group_array(
          DISTINCT json_object(
            'id', l.id,
            'location_address', l.location_address,
            'city', l.city,
            'province', l.province,
            'country_code', l.country_code,
            'zip', l.zip,
            'latitude', l.latitude,
            'longitude', l.longitude
          )
        ),
        '[]'
      ) AS locations_json
    FROM merchants m
    LEFT JOIN receipts r ON m.id = r.merchant_id
    LEFT JOIN merchant_locations ml ON m.id = ml.merchant_id
    LEFT JOIN locations l ON ml.location_id = l.id
    GROUP BY m.id
    ORDER BY m.name ASC
  `;

  const rows = await executeQuery(sql);

  return rows.map((row: any) => {
    let locations: Location[] = [];
    try {
      const parsed = JSON.parse(row.locations_json);
      if (Array.isArray(parsed)) {
        locations = parsed.filter(
          (loc: any) => loc !== null && loc.id !== null,
        );
      }
    } catch (e) {
      console.warn("Failed to parse locations JSON for merchant", row.id, e);
    }
    return {
      id: row.id,
      name: row.name,
      alternative_names: row.alternative_names,
      domain: row.domain,
      merchant_logo: row.merchant_logo,
      industry_type: row.industry_type,
      country_code: row.country_code,
      tax_registration_id: row.tax_registration_id,
      created_at: row.created_at,
      updated_at: row.updated_at,
      receiptCount: row.receiptCount,
      totalSpent: row.totalSpent,
      locations,
    };
  });
}
