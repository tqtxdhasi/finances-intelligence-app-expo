// hooks/merchant/updateMerchantById.ts
import { UpdateMerchantDTO } from "@/types/data";
import { executeQuery } from "../executeQuery";

export async function updateMerchantById(
  id: string,
  data: UpdateMerchantDTO,
): Promise<void> {
  // Update merchant basic info
  if (Object.keys(data).some((key) => key !== "locations")) {
    const updateFields = [];
    const updateValues = [];

    if (data.name !== undefined) {
      updateFields.push("name = ?");
      updateValues.push(data.name);
    }
    if (data.alternative_names !== undefined) {
      updateFields.push("alternative_names = ?");
      updateValues.push(data.alternative_names);
    }
    if (data.domain !== undefined) {
      updateFields.push("domain = ?");
      updateValues.push(data.domain);
    }
    if (data.merchant_logo !== undefined) {
      updateFields.push("merchant_logo = ?");
      updateValues.push(data.merchant_logo);
    }
    if (data.industry_type !== undefined) {
      updateFields.push("industry_type = ?");
      updateValues.push(data.industry_type);
    }
    if (data.country_code !== undefined) {
      updateFields.push("country_code = ?");
      updateValues.push(data.country_code);
    }
    if (data.tax_registration_id !== undefined) {
      updateFields.push("tax_registration_id = ?");
      updateValues.push(data.tax_registration_id);
    }

    if (updateFields.length > 0) {
      updateValues.push(id);
      const updateSql = `
        UPDATE merchants 
        SET ${updateFields.join(", ")}, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `;
      await executeQuery(updateSql, updateValues);
    }
  }

  // Update locations if provided
  if (data.locations !== undefined) {
    // First, get existing location associations
    const existingLocations = await executeQuery(
      "SELECT location_id FROM merchant_locations WHERE merchant_id = ?",
      [id],
    );

    const existingLocationIds = existingLocations.map(
      (row: any) => row.location_id,
    );

    // Process each location
    for (const location of data.locations) {
      if (location.id && !location.id.toString().startsWith("temp_")) {
        // Update existing location
        await executeQuery(
          `UPDATE locations 
           SET location_address = ?, city = ?, province = ?,
               country_code = ?, zip = ?, external_place_id = ?, latitude = ?,
               longitude = ?, updated_at = CURRENT_TIMESTAMP
           WHERE id = ?`,
          [
            location.location_address,
            location.city,
            location.province || null,
            location.country_code,
            location.zip,
            location.external_place_id || null,
            location.latitude || null,
            location.longitude || null,
            location.id,
          ],
        );

        // Remove from existingLocationIds to keep track of which ones to delete
        const index = existingLocationIds.indexOf(location.id);
        if (index !== -1) {
          existingLocationIds.splice(index, 1);
        }
      } else {
        // Insert new location
        const newLocationId = `${Date.now()}_${Math.random()}`;
        await executeQuery(
          `INSERT INTO locations (
             id,  location_address, city, province,
             country_code, zip, external_place_id, latitude, longitude
           ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            newLocationId,
            location.location_address,
            location.city,
            location.province || null,
            location.country_code,
            location.zip,
            location.external_place_id || null,
            location.latitude || null,
            location.longitude || null,
          ],
        );

        // Associate with merchant
        await executeQuery(
          "INSERT INTO merchant_locations (merchant_id, location_id) VALUES (?, ?)",
          [id, newLocationId],
        );
      }
    }

    // Delete removed locations
    for (const locationId of existingLocationIds) {
      await executeQuery(
        "DELETE FROM merchant_locations WHERE merchant_id = ? AND location_id = ?",
        [id, locationId],
      );
      // Optionally delete the location if not associated with other merchants
      await executeQuery(
        "DELETE FROM locations WHERE id = ? AND NOT EXISTS (SELECT 1 FROM merchant_locations WHERE location_id = ?)",
        [locationId, locationId],
      );
    }
  }
}
