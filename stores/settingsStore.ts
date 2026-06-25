import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type UsagePurpose = "personal" | "business" | "both" | "other";

// Define settings interface
interface Settings {
  currency: string;
  country: string;
  theme: "light" | "dark";
  accentColor: string;
  currencyManuallySet: boolean;
  usagePurpose: UsagePurpose; // new field
}

interface SettingsStore extends Settings {
  update: (newSettings: Partial<Settings>) => void;
  reset: () => void;
}

// Default settings
const defaultSettings: Settings = {
  currency: "PLN",
  country: "PL",
  theme: "dark",
  accentColor: "#ff9800",
  currencyManuallySet: false,
  usagePurpose: "personal", // default to personal
};

// Create the store with persistence
export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      ...defaultSettings,

      update: (newSettings) =>
        set((state) => ({
          ...state,
          ...newSettings,
        })),

      reset: () => set(defaultSettings),
    }),
    {
      name: "app_settings",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
