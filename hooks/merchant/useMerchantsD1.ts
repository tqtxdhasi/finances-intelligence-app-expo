// hooks/useMerchantsD1.ts
import { Location, Merchant } from "@/types/data";
import { useEffect, useState } from "react";
import { executeQuery } from "../executeQuery";

interface MerchantWithStats extends Merchant {
  receiptCount: number;
  totalSpent: number;
  locations: Location[];
}

export const useMerchantsD1 = () => {
  const [merchants, setMerchants] = useState<MerchantWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchMerchants = async () => {
    setLoading(true);
    setError(null);
    try {
      // Single query: merchant stats + aggregated locations as JSON
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

      // Parse JSON locations for each merchant
      const merchantsWithParsedLocations: MerchantWithStats[] = rows.map(
        (row: any) => {
          let locations: Location[] = [];
          try {
            const parsed = JSON.parse(row.locations_json);
            // If no locations, json_group_array returns '[]' -> parsed is []
            // But if there are locations, parsed is an array of objects.
            // However, if a merchant has no locations, the LEFT JOIN produces a single row with NULL location fields.
            // json_group_array will produce '[null]' in that case. We need to filter out nulls.
            if (Array.isArray(parsed)) {
              locations = parsed.filter(
                (loc: any) => loc !== null && loc.id !== null,
              );
            }
          } catch (e) {
            console.warn(
              "Failed to parse locations JSON for merchant",
              row.id,
              e,
            );
            locations = [];
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
        },
      );

      setMerchants(merchantsWithParsedLocations);
    } catch (err) {
      console.error("Failed to fetch merchants:", err);
      setError(err instanceof Error ? err : new Error("Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMerchants();
  }, []);

  const deleteMerchant = async (merchantId: string) => {
    try {
      // Due to foreign key constraints with ON DELETE CASCADE, deleting the merchant
      // will automatically delete related user_merchants, merchant_locations, and receipts.
      await executeQuery("DELETE FROM merchants WHERE id = ?", [merchantId]);
      await fetchMerchants(); // refresh list
    } catch (err) {
      console.error("Failed to delete merchant:", err);
      throw err;
    }
  };

  return { merchants, loading, error, refetch: fetchMerchants, deleteMerchant };
};
