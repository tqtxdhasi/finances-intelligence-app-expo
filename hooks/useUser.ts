// hooks/useUser.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { executeQuery } from "./executeQuery";

const USER_ID_KEY = "@receipt_user_id";

export interface UserSettings {
  currency: string;
  country: string;
  theme: "light" | "dark";
  accentColor: string;
}

export function useUser() {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<UserSettings | null>(null);

  useEffect(() => {
    const initUser = async () => {
      try {
        let id = await AsyncStorage.getItem(USER_ID_KEY);

        if (!id) {
          // Generate new ID
          id = `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
          await AsyncStorage.setItem(USER_ID_KEY, id);

          // Default settings
          const defaultCurrency = "PLN";
          const defaultCountry = "PL";
          const defaultTheme = "dark";
          const defaultAccentColor = "#ff9800";

          // Insert into D1
          await executeQuery(
            `INSERT OR IGNORE INTO users (id, email, name, default_currency, default_country, theme, accent_color, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              id,
              `${id}@local.receipts.app`,
              "Default User",
              defaultCurrency,
              defaultCountry,
              defaultTheme,
              defaultAccentColor,
              new Date().toISOString(),
              new Date().toISOString(),
            ],
          );

          setSettings({
            currency: defaultCurrency,
            country: defaultCountry,
            theme: defaultTheme,
            accentColor: defaultAccentColor,
          });

          console.log("✅ New user created:", id);
        } else {
          // Fetch existing user settings from DB
          const result = await executeQuery(
            `SELECT default_currency, default_country, theme, accent_color 
             FROM users WHERE id = ?`,
            [id],
          );

          if (result && result.length > 0) {
            setSettings({
              currency: result[0].default_currency,
              country: result[0].default_country,
              theme: result[0].theme || "dark",
              accentColor: result[0].accent_color || "#ff9800",
            });
          }
          console.log("👤 Existing user:", id);
        }

        setUserId(id);
      } catch (error) {
        console.error("Failed to initialize user:", error);
      } finally {
        setLoading(false);
      }
    };

    initUser();
  }, []);

  const updateUserSettings = async (newSettings: Partial<UserSettings>) => {
    if (!userId) return;

    try {
      const updates: string[] = [];
      const values: any[] = [];

      if (newSettings.currency !== undefined) {
        updates.push("default_currency = ?");
        values.push(newSettings.currency);
      }
      if (newSettings.country !== undefined) {
        updates.push("default_country = ?");
        values.push(newSettings.country);
      }
      if (newSettings.theme !== undefined) {
        updates.push("theme = ?");
        values.push(newSettings.theme);
      }
      if (newSettings.accentColor !== undefined) {
        updates.push("accent_color = ?");
        values.push(newSettings.accentColor);
      }

      if (updates.length > 0) {
        updates.push("updated_at = ?");
        values.push(new Date().toISOString());
        values.push(userId);

        await executeQuery(
          `UPDATE users SET ${updates.join(", ")} WHERE id = ?`,
          values,
        );

        setSettings((prev) => (prev ? { ...prev, ...newSettings } : null));
        console.log("✅ User settings updated in DB:", newSettings);
      }
    } catch (error) {
      console.error("Failed to update user settings:", error);
    }
  };

  return { userId, loading, settings, updateUserSettings };
}
