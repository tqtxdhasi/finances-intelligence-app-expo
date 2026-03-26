import { useTheme } from "@/utils/theme";
import { Ionicons } from "@expo/vector-icons";
import currencyCodes from "currency-codes";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import CurrencyModal from "./CurrencyModal";

interface Props {
  currency: string;
  onCurrencyChange: (code: string) => void;
}

export default function CurrencySelector({
  currency,
  onCurrencyChange,
}: Props) {
  const [modalVisible, setModalVisible] = useState(false);
  const { colors, styles: themeStyles } = useTheme();
  const currencyInfo = currencyCodes.code(currency);
  const displayText = currencyInfo
    ? `${currencyInfo.code} (${currencyInfo.currency})`
    : currency;

  return (
    <>
      <TouchableOpacity
        style={[styles.selector, { borderColor: colors.border }]}
        onPress={() => setModalVisible(true)}
      >
        <Text style={[themeStyles.subtitle, styles.selectorText]}>
          {displayText}
        </Text>
        <Ionicons name="chevron-down" size={20} color={colors.textSecondary} />
      </TouchableOpacity>

      <CurrencyModal
        visible={modalVisible}
        selectedCurrency={currency}
        onSelectCurrency={(code: any) => {
          onCurrencyChange(code);
          setModalVisible(false);
        }}
        onClose={() => setModalVisible(false)}
        preferredCurrency={currency} // put current currency on top
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
