import AccentColorSelector from "@/components/profile/AccentColorSelector";
import CountrySelector from "@/components/profile/CountrySelector";
import CurrencySelector from "@/components/profile/CurrencySelector";
import ResetButton from "@/components/profile/ResetButton";
import ThemeSelector from "@/components/profile/ThemeSelector";
import { useSettingsStore } from "@/stores/settingsStore";
import { useTheme } from "@/utils/theme";
import currencyCodes from "currency-codes";
import React from "react";

import { ScrollView, StyleSheet, Text, View } from "react-native";
export function getCurrencyForCountry(countryCode: string): string | undefined {
  const currencies = currencyCodes.data;
  // Find the first currency that lists this country in its `countries` array
  const matched = currencies.find((curr) =>
    curr.countries?.includes(countryCode),
  );
  return matched?.code;
}
export default function ProfileScreen() {
  const {
    accentColor,
    currency,
    country,
    theme,
    currencyManuallySet,
    update,
    reset,
  } = useSettingsStore();
  const { colors, styles: themeStyles } = useTheme();

  // Handle country change: update country, and optionally update currency
  const handleCountryChange = (newCountry: string) => {
    // If currency has not been manually set, try to suggest a currency for the new country
    if (!currencyManuallySet) {
      const suggestedCurrency = getCurrencyForCountry(newCountry);
      if (suggestedCurrency) {
        update({ country: newCountry, currency: suggestedCurrency });
        return;
      }
    }
    // Otherwise, just update the country
    update({ country: newCountry });
  };

  // Handle manual currency change: update currency and mark it as manually set
  const handleCurrencyChange = (newCurrency: string) => {
    update({ currency: newCurrency, currencyManuallySet: true });
  };

  // Handle reset: this will also reset currencyManuallySet to false
  const handleReset = () => {
    reset();
  };

  return (
    <ScrollView style={[themeStyles.container, styles.container]}>
      <View style={styles.header}>
        <Text style={[themeStyles.title, styles.headerTitle]}>Settings</Text>
      </View>

      {/* Theme Section */}
      <View style={[themeStyles.card, styles.section]}>
        <Text style={[themeStyles.title, styles.sectionTitle]}>Theme</Text>
        <ThemeSelector
          theme={theme}
          onThemeChange={(t) => update({ theme: t })}
        />
      </View>

      {/* Accent Color Section */}
      <View style={[themeStyles.card, styles.section]}>
        <Text style={[themeStyles.title, styles.sectionTitle]}>
          Accent Color
        </Text>
        <AccentColorSelector
          accentColor={accentColor}
          onColorChange={(color) => update({ accentColor: color })}
        />
      </View>

      {/* Currency Section */}
      <View style={[themeStyles.card, styles.section]}>
        <Text style={[themeStyles.title, styles.sectionTitle]}>Currency</Text>
        <CurrencySelector
          currency={currency}
          onCurrencyChange={handleCurrencyChange} // wrapped handler
        />
      </View>

      {/* Country Section */}
      <View style={[themeStyles.card, styles.section]}>
        <Text style={[themeStyles.title, styles.sectionTitle]}>Country</Text>
        <CountrySelector
          country={country}
          onCountryChange={handleCountryChange} // wrapped handler
        />
      </View>

      {/* Reset Button */}
      <ResetButton onReset={handleReset} />
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
});
