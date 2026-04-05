// app/profile.tsx (or wherever ProfileScreen is)
import AccentColorSelector from "@/components/profile/AccentColorSelector";
import CountrySelector from "@/components/profile/CountrySelector";
import CurrencySelector from "@/components/profile/CurrencySelector";
import ResetButton from "@/components/profile/ResetButton";
import ThemeSelector from "@/components/profile/ThemeSelector";
import { clearDatabase } from "@/hooks/clearDatabase";
import { useUser } from "@/hooks/useUser"; // Add this import
import { useSettingsStore } from "@/stores/settingsStore";
import { useTheme } from "@/utils/theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import currencyCodes from "currency-codes";
import { useRouter } from "expo-router";
import React from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export function getCurrencyForCountry(countryCode: string): string | undefined {
  const currencies = currencyCodes.data;
  const matched = currencies.find((curr) =>
    curr.countries?.includes(countryCode),
  );
  return matched?.code;
}

export default function ProfileScreen() {
  const router = useRouter();
  const { updateUserSettings, userId } = useUser(); // Add this
  const {
    accentColor,
    currency,
    country,
    theme,
    currencyManuallySet,
    update,
    reset: resetSettings,
  } = useSettingsStore();
  const { colors, styles: themeStyles } = useTheme();

  // Sync store changes to database immediately
  const handleUpdate = async (
    newSettings: Partial<{
      currency: string;
      country: string;
      theme: "light" | "dark";
      accentColor: string;
      currencyManuallySet?: boolean;
    }>,
  ) => {
    // Update local store first
    update(newSettings);

    // Then sync to database if user exists
    if (userId) {
      const dbUpdates: any = {};
      if (newSettings.currency !== undefined)
        dbUpdates.currency = newSettings.currency;
      if (newSettings.country !== undefined)
        dbUpdates.country = newSettings.country;
      if (newSettings.theme !== undefined) dbUpdates.theme = newSettings.theme;
      if (newSettings.accentColor !== undefined)
        dbUpdates.accentColor = newSettings.accentColor;

      if (Object.keys(dbUpdates).length > 0) {
        await updateUserSettings(dbUpdates);
      }
    }
  };

  const handleCountryChange = (newCountry: string) => {
    if (!currencyManuallySet) {
      const suggestedCurrency = getCurrencyForCountry(newCountry);
      if (suggestedCurrency) {
        handleUpdate({ country: newCountry, currency: suggestedCurrency });
        return;
      }
    }
    handleUpdate({ country: newCountry });
  };

  const handleCurrencyChange = (newCurrency: string) => {
    handleUpdate({ currency: newCurrency, currencyManuallySet: true });
  };

  const handleThemeChange = (newTheme: "light" | "dark") => {
    handleUpdate({ theme: newTheme });
  };

  const handleAccentColorChange = (newColor: string) => {
    handleUpdate({ accentColor: newColor });
  };

  const handleResetSettings = async () => {
    // Reset to defaults
    const defaultSettings = {
      currency: "PLN",
      country: "PL",
      theme: "dark" as const,
      accentColor: "#ff9800",
      currencyManuallySet: false,
    };

    // Update local store
    resetSettings();

    // Sync defaults to database
    if (userId) {
      await updateUserSettings({
        currency: defaultSettings.currency,
        country: defaultSettings.country,
        theme: defaultSettings.theme,
        accentColor: defaultSettings.accentColor,
      });
    }
  };

  // Reset everything (user + settings) and go back to onboarding
  const handleResetApp = async () => {
    Alert.alert(
      "Reset App",
      "This will clear all your data and restart the app. You will start as a new user. Are you sure?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: async () => {
            try {
              // Clear AsyncStorage keys
              await AsyncStorage.removeItem("@receipt_user_id");
              await AsyncStorage.removeItem("@app_first_launch");
              await AsyncStorage.removeItem("app_settings"); // Clear settings store

              // Clear all database tables
              await clearDatabase();

              // Reset settings store
              resetSettings();

              // Navigate to onboarding
              router.replace("/onboarding");
            } catch (error: any) {
              Alert.alert("Error", `Reset failed: ${error.message}`);
            }
          },
        },
      ],
    );
  };

  return (
    <ScrollView style={[themeStyles.container, styles.container]}>
      <View style={styles.header}>
        <Text style={[themeStyles.title, styles.headerTitle]}>Settings</Text>
      </View>

      {/* Theme Section */}
      <View style={[themeStyles.card, styles.section]}>
        <Text style={[themeStyles.title, styles.sectionTitle]}>Theme</Text>
        <ThemeSelector theme={theme} onThemeChange={handleThemeChange} />
      </View>

      {/* Accent Color Section */}
      <View style={[themeStyles.card, styles.section]}>
        <Text style={[themeStyles.title, styles.sectionTitle]}>
          Accent Color
        </Text>
        <AccentColorSelector
          accentColor={accentColor}
          onColorChange={handleAccentColorChange}
        />
      </View>

      {/* Currency Section */}
      <View style={[themeStyles.card, styles.section]}>
        <Text style={[themeStyles.title, styles.sectionTitle]}>Currency</Text>
        <CurrencySelector
          currency={currency}
          onCurrencyChange={handleCurrencyChange}
        />
      </View>

      {/* Country Section */}
      <View style={[themeStyles.card, styles.section]}>
        <Text style={[themeStyles.title, styles.sectionTitle]}>Country</Text>
        <CountrySelector
          country={country}
          onCountryChange={handleCountryChange}
        />
      </View>

      {/* Reset Settings Button (settings only) */}
      <ResetButton onReset={handleResetSettings} />

      {/* Reset App Button (full wipe) */}
      <TouchableOpacity
        style={[styles.resetAppButton, { borderColor: colors.border }]}
        onPress={handleResetApp}
      >
        <Text
          style={[styles.resetAppText, { color: colors.error || "#ff4444" }]}
        >
          Reset App (Clear all data)
        </Text>
      </TouchableOpacity>

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
    marginTop: 16,
  },
  headerTitle: {
    fontSize: 32,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  resetAppButton: {
    marginTop: 30,
    marginBottom: 20,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  resetAppText: {
    fontSize: 16,
    fontWeight: "600",
  },
  bottomSpacer: {
    height: 40,
  },
});
