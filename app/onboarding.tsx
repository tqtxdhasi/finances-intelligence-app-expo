import AccentColorSelector from "@/components/profile/AccentColorSelector";
import CountrySelector from "@/components/profile/CountrySelector";
import CurrencySelector from "@/components/profile/CurrencySelector";
import ThemeSelector from "@/components/profile/ThemeSelector";
import { useSettingsStore } from "@/stores/settingsStore";
import { getCurrencyForCountry } from "@/utils/getCurrencyForCountry";
import { useTheme } from "@/utils/theme";
import { useRouter } from "expo-router"; // ✅ add this
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface Props {
  onComplete: () => void;
}

export default function OnboardingScreen({ onComplete = () => {} }: Props) {
  const router = useRouter(); // ✅ navigation
  const { update, currency, country, theme, accentColor } = useSettingsStore();
  const { colors, styles: themeStyles } = useTheme();
  const [step, setStep] = useState(0);

  const handleCountryChange = (newCountry: string) => {
    const suggested = getCurrencyForCountry(newCountry);
    update({
      country: newCountry,
      currency: suggested || currency,
      currencyManuallySet: false,
    });
  };

  const handleCurrencyChange = (newCurrency: string) => {
    update({ currency: newCurrency, currencyManuallySet: true });
  };

  const handleThemeChange = (newTheme: "light" | "dark") =>
    update({ theme: newTheme });
  const handleAccentChange = (newColor: string) =>
    update({ accentColor: newColor });

  const nextStep = async () => {
    // ✅ make async
    if (step < 2) {
      setStep(step + 1);
    } else {
      // Mark first launch as done
      await onComplete();
      // Navigate to the main app (tabs)
      router.replace("/"); // or "/(tabs)" if your tabs are inside a group
    }
  };

  const prevStep = () => step > 0 && setStep(step - 1);

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <>
            <Text style={[themeStyles.title, styles.title]}>Welcome!</Text>
            <Text style={[styles.description, { color: colors.textSecondary }]}>
              Set your country and currency.
            </Text>
            <View style={styles.field}>
              <Text style={[styles.label, { color: colors.text }]}>
                Country
              </Text>
              <CountrySelector
                country={country}
                onCountryChange={handleCountryChange}
              />
            </View>
            <View style={styles.field}>
              <Text style={[styles.label, { color: colors.text }]}>
                Currency
              </Text>
              <CurrencySelector
                currency={currency}
                onCurrencyChange={handleCurrencyChange}
              />
            </View>
          </>
        );
      case 1:
        return (
          <>
            <Text style={[themeStyles.title, styles.title]}>Appearance</Text>
            <Text style={[styles.description, { color: colors.textSecondary }]}>
              Choose theme and accent color.
            </Text>
            <View style={styles.field}>
              <Text style={[styles.label, { color: colors.text }]}>Theme</Text>
              <ThemeSelector theme={theme} onThemeChange={handleThemeChange} />
            </View>
            <View style={styles.field}>
              <Text style={[styles.label, { color: colors.text }]}>
                Accent Color
              </Text>
              <AccentColorSelector
                accentColor={accentColor}
                onColorChange={handleAccentChange}
              />
            </View>
          </>
        );
      case 2:
        return (
          <>
            <Text style={[themeStyles.title, styles.title]}>Ready!</Text>
            <Text style={[styles.description, { color: colors.textSecondary }]}>
              You're all set. Start tracking your receipts.
            </Text>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
    >
      <View style={styles.content}>
        {renderStep()}
        <View style={styles.buttonContainer}>
          {step > 0 && (
            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={prevStep}
            >
              <Text style={[styles.buttonText, { color: colors.accent }]}>
                Back
              </Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.accent }]}
            onPress={nextStep}
          >
            <Text style={[styles.buttonText, { color: "#fff" }]}>
              {step === 2 ? "Get Started" : "Next"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: "center", padding: 20 },
  content: { flex: 1, justifyContent: "center" },
  title: { fontSize: 32, marginBottom: 16 },
  description: { fontSize: 16, marginBottom: 32 },
  field: { marginBottom: 24 },
  label: { fontSize: 16, marginBottom: 8 },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 32,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginHorizontal: 8,
  },
  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  buttonText: { fontSize: 16, fontWeight: "600" },
});
