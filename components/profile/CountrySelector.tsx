import { useTheme } from "@/utils/theme";
import { Ionicons } from "@expo/vector-icons";
import countries from "i18n-iso-countries";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import CountryModal from "./CountryModal";

interface Props {
  country: string; // country code
  onCountryChange: (code: string) => void;
}

export default function CountrySelector({ country, onCountryChange }: Props) {
  const [modalVisible, setModalVisible] = useState(false);
  const { colors, styles: themeStyles } = useTheme();

  const countryName = countries.getName(country, "en") || country;

  return (
    <>
      <TouchableOpacity
        style={[styles.selector, { borderColor: colors.border }]}
        onPress={() => setModalVisible(true)}
      >
        <Text style={[themeStyles.subtitle, styles.selectorText]}>
          {countryName} ({country})
        </Text>
        <Ionicons name="chevron-down" size={20} color={colors.textSecondary} />
      </TouchableOpacity>

      <CountryModal
        visible={modalVisible}
        selectedCountry={country}
        onSelectCountry={(code) => {
          onCountryChange(code);
          setModalVisible(false);
        }}
        onClose={() => setModalVisible(false)}
        preferredCountry={country}
      />
    </>
  );
}

const styles = StyleSheet.create({
  selector: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderRadius: 8,
  },
  selectorText: {
    fontSize: 16,
  },
});
