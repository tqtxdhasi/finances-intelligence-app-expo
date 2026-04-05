// hooks/useCreateReceipt.ts
import { Receipt } from "@/types/data";
import { CreateReceiptDTO } from "@/types/receipt";
import { useCallback, useState } from "react";
import { Alert } from "react-native";
import { generateId } from "../category/createCategory";
import { executeQuery } from "../executeQuery";

// Debug helper to check foreign keys
const validateForeignKeys = async (data: CreateReceiptDTO) => {
  console.log("🔍 Validating foreign keys:", {
    userId: data.userId,
    merchantId: data.merchantId,
    locationId: data.locationId,
  });

  // Check if user exists
  try {
    const userCheck = await executeQuery("SELECT id FROM users WHERE id = ?", [
      data.userId,
    ]);
    console.log("User check result:", userCheck);

    // FIX: Check if result is an array directly
    const userExists = Array.isArray(userCheck) && userCheck.length > 0;
    console.log(
      `👤 User ${data.userId}: ${userExists ? "✅ exists" : "❌ missing"}`,
    );

    // ONLY create if user doesn't exist
    if (!userExists) {
      console.log("🆕 Creating missing user...");
      const now = new Date().toISOString();
      await executeQuery(
        `INSERT INTO users (id, email, name, default_country, created_at, updated_at) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [data.userId, "user@example.com", "App User", "PL", now, now], // Added default_country
      );
      console.log("✅ User created successfully");
    }
  } catch (error) {
    console.error("❌ Error checking/creating user:", error);
    throw new Error(`User validation failed: ${error}`);
  }

  // Check if merchant exists
  try {
    const merchantCheck = await executeQuery(
      "SELECT id FROM merchants WHERE id = ?",
      [data.merchantId],
    );
    console.log("Merchant check result:", merchantCheck);

    // FIX: Check if result is an array directly
    const merchantExists =
      Array.isArray(merchantCheck) && merchantCheck.length > 0;
    console.log(
      `🏪 Merchant ${data.merchantId}: ${merchantExists ? "✅ exists" : "❌ missing"}`,
    );

    // ONLY create if merchant doesn't exist
    if (!merchantExists) {
      console.log("🆕 Creating missing merchant...");
      const now = new Date().toISOString();
      await executeQuery(
        `INSERT INTO merchants (id, name, created_at, updated_at) 
         VALUES (?, ?, ?, ?)`,
        [data.merchantId, "Unknown Merchant", now, now],
      );
      console.log("✅ Merchant created successfully");
    }
  } catch (error) {
    console.error("❌ Error checking/creating merchant:", error);
    throw new Error(`Merchant validation failed: ${error}`);
  }

  // Check if location exists (if provided)
  if (data.locationId) {
    try {
      const locationCheck = await executeQuery(
        "SELECT id FROM locations WHERE id = ?",
        [data.locationId],
      );
      console.log("Location check result:", locationCheck);

      // FIX: Check if result is an array directly
      const locationExists =
        Array.isArray(locationCheck) && locationCheck.length > 0;
      console.log(
        `📍 Location ${data.locationId}: ${locationExists ? "✅ exists" : "❌ missing"}`,
      );

      // ONLY create if location doesn't exist
      if (!locationExists) {
        console.log("🆕 Creating missing location...");
        const now = new Date().toISOString();
        await executeQuery(
          `INSERT INTO locations (id, merchant_id, name, created_at, updated_at) 
           VALUES (?, ?, ?, ?, ?)`,
          [data.locationId, data.merchantId, "Unknown Location", now, now],
        );
        console.log("✅ Location created successfully");
      }
    } catch (error) {
      console.error("❌ Error checking/creating location:", error);
      throw new Error(`Location validation failed: ${error}`);
    }
  }

  return true;
};

// Main create receipt function
const createReceiptService = async (
  data: CreateReceiptDTO,
): Promise<Receipt> => {
  const receiptId = generateId();
  const now = new Date().toISOString();

  // Validate/Create missing foreign keys
  await validateForeignKeys(data);

  console.log("📝 Creating receipt with data:", {
    receiptId,
    userId: data.userId,
    merchantId: data.merchantId,
    locationId: data.locationId || null,
    itemCount: data.items.length,
    totalAmount: data.totalAmount,
  });

  // 1. Insert the receipt
  const receiptQuery = `
    INSERT INTO receipts (
      id, user_id, merchant_id, location_id, date,
      subtotal_amount, tax_amount, total_amount, currency,
      payment_type, image_path, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  try {
    await executeQuery(receiptQuery, [
      receiptId,
      data.userId,
      data.merchantId,
      data.locationId || null,
      data.date,
      data.subtotalAmount ?? null,
      data.taxAmount ?? 0,
      data.totalAmount,
      data.currency,
      data.paymentType || null,
      data.imagePath || null,
      now,
      now,
    ]);
    console.log("✅ Receipt inserted successfully");
  } catch (error) {
    console.error("❌ Failed to insert receipt:", error);
    throw new Error(`Failed to insert receipt: ${error}`);
  }

  // 2. Insert receipt items
  if (data.items.length > 0) {
    const itemValues: any[] = [];
    const placeholders: string[] = [];

    for (const item of data.items) {
      const itemId = generateId();
      itemValues.push(
        itemId,
        receiptId,
        null, // product_id
        null, // category_id
        item.rawName,
        item.quantity,
        item.unitPrice,
        item.totalPrice,
        item.unitOfMeasure || null,
        null, // normalized_quantity
        null, // normalized_unit
        item.discountAmount ?? 0,
      );
      placeholders.push("(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    }

    const itemsQuery = `
      INSERT INTO receipt_items 
      (id, receipt_id, product_id, category_id, raw_name, quantity,
       unit_price, total_price, unit_of_measure, normalized_quantity,
       normalized_unit, discount_amount)
      VALUES ${placeholders.join(", ")}
    `;

    try {
      await executeQuery(itemsQuery, itemValues);
      console.log(
        `✅ ${data.items.length} receipt items inserted successfully`,
      );
    } catch (error) {
      console.error("❌ Failed to insert receipt items:", error);
      throw new Error(`Failed to insert receipt items: ${error}`);
    }
  }

  // 3. Get and return the full receipt
  const getReceiptQuery = `
    SELECT * FROM receipts WHERE id = ?
  `;

  const result = await executeQuery(getReceiptQuery, [receiptId]);

  if (!result || !Array.isArray(result) || result.length === 0) {
    throw new Error("Failed to retrieve created receipt");
  }

  const newReceipt = result[0] as Receipt;

  console.log("🎉 Receipt created successfully:", receiptId);
  return newReceipt;
};

// Hook for using in components
export const useCreateReceipt = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createReceipt = useCallback(async (data: CreateReceiptDTO) => {
    setLoading(true);
    setError(null);

    try {
      // Validate required fields
      if (!data.userId) {
        throw new Error("User ID is required");
      }
      if (!data.merchantId) {
        throw new Error("Merchant ID is required");
      }
      if (!data.date) {
        throw new Error("Date is required");
      }
      if (!data.items || data.items.length === 0) {
        throw new Error("At least one item is required");
      }

      // Create the receipt
      const receipt = await createReceiptService(data);

      Alert.alert("Success", "Receipt created successfully!");
      return receipt;
    } catch (err: any) {
      console.error("Failed to create receipt:", err);
      const errorMessage = err.message || "Failed to create receipt";
      setError(errorMessage);
      Alert.alert("Error", errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    createReceipt,
    loading,
    error,
  };
};
