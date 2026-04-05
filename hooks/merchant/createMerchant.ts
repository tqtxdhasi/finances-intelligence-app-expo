import { CreateMerchantDTO, Merchant } from "@/types/data";
import { executeQuery } from "../executeQuery";
import { getMerchantById } from "./getMerchantById";

const generateId = () => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

export const createMerchant = async (
  data: CreateMerchantDTO,
): Promise<Merchant> => {
  const merchantId = generateId();
  const now = new Date().toISOString();

  // 1. Insert merchant
  const merchantQuery = `
    INSERT INTO merchants (
      id, name, alternative_names, domain,
      merchant_logo, industry_type, country_code, tax_registration_id,
      created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  await executeQuery(merchantQuery, [
    merchantId,
    data.name,
    data.alternative_names || null,
    data.domain || null,
    data.merchant_logo || null,
    data.industry_type || null,
    data.country_code || null,
    data.tax_registration_id || null,
    now,
    now,
  ]);

  // 2. Insert locations (if any) and link via merchant_locations
  if (data.locations && data.locations.length > 0) {
    for (const loc of data.locations) {
      const locationId = generateId();

      // Insert into locations table (no merchant_id here)
      const locationQuery = `
        INSERT INTO locations (
          id, location_address, city, province,
          country_code, zip, external_place_id, latitude, longitude,
          created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      await executeQuery(locationQuery, [
        locationId,
        loc.location_address,
        loc.city,
        loc.province || null,
        loc.country_code,
        loc.zip,
        loc.external_place_id || null,
        loc.latitude || null,
        loc.longitude || null,
        now,
        now,
      ]);

      // Link merchant <-> location in junction table
      const linkQuery = `
        INSERT INTO merchant_locations (merchant_id, location_id)
        VALUES (?, ?)
      `;
      await executeQuery(linkQuery, [merchantId, locationId]);
    }
  }

  // 3. Return full merchant object (including its locations)
  return getMerchantById(merchantId);
};
