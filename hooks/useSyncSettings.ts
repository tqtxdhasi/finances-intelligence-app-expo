// hooks/useSyncSettings.ts
import { useSettingsStore } from "@/stores/settingsStore";
import { useEffect, useRef } from "react";
import { useUser } from "./useUser";

export function useSyncSettings() {
  const {
    settings: dbSettings,
    updateUserSettings,
    userId,
    loading: userLoading,
  } = useUser();
  const { update, currency, country, theme, accentColor } = useSettingsStore();
  const isInitialSyncDone = useRef(false);
  const isUpdatingFromDB = useRef(false);
  const isUpdatingFromStore = useRef(false);

  // Load DB settings into store on initial load
  useEffect(() => {
    if (!userLoading && dbSettings && !isInitialSyncDone.current) {
      isUpdatingFromDB.current = true;
      update({
        currency: dbSettings.currency,
        country: dbSettings.country,
        theme: dbSettings.theme,
        accentColor: dbSettings.accentColor,
        currencyManuallySet: true,
      });
      isUpdatingFromDB.current = false;
      isInitialSyncDone.current = true;
    }
  }, [dbSettings, userLoading]);

  // Save store changes to DB
  useEffect(() => {
    if (!userId || !isInitialSyncDone.current) return;
    if (isUpdatingFromDB.current) return;

    // Prevent infinite loop
    if (isUpdatingFromStore.current) return;

    const hasChanges =
      currency !== dbSettings?.currency ||
      country !== dbSettings?.country ||
      theme !== dbSettings?.theme ||
      accentColor !== dbSettings?.accentColor;

    if (hasChanges) {
      isUpdatingFromStore.current = true;

      const updates: any = {};
      if (currency !== dbSettings?.currency) updates.currency = currency;
      if (country !== dbSettings?.country) updates.country = country;
      if (theme !== dbSettings?.theme) updates.theme = theme;
      if (accentColor !== dbSettings?.accentColor)
        updates.accentColor = accentColor;

      updateUserSettings(updates).finally(() => {
        isUpdatingFromStore.current = false;
      });
    }
  }, [currency, country, theme, accentColor, userId, dbSettings]);
}
