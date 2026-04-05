// components/add/CurrencyField.tsx
import { useTheme } from "@/utils/theme";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import CurrencyModal from "./CurrencyModal";

interface Props {
  currency: string;
  onCurrencyChange: (currency: string) => void;
  preferredCurrency?: string;
}

export default function CurrencyField({
  currency,
  onCurrencyChange,
  preferredCurrency = "USD",
}: Props) {
  const { colors } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);

  const selectCurrency = (newCurrency: string) => {
    onCurrencyChange(newCurrency);
    setModalVisible(false);
  };

  return (
    <>
      <View>
        <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
          Currency
        </Text>
        <TouchableOpacity
          style={[styles.selector, { backgroundColor: colors.surfaceLight }]}
          onPress={() => setModalVisible(true)}
        >
          <Text style={[styles.selectorText, { color: colors.text }]}>
            {currency}
          </Text>
          <Ionicons
            name="chevron-down"
            size={20}
            color={colors.textSecondary}
          />
        </TouchableOpacity>
      </View>

      <CurrencyModal
        visible={modalVisible}
        selectedCurrency={currency}
        onSelectCurrency={selectCurrency}
        onClose={() => setModalVisible(false)}
        preferredCurrency={preferredCurrency}
      />
    </>
  );
}

const styles = StyleSheet.create({
  inputLabel: {
    fontSize: 14,
    marginBottom: 8,
    marginTop: 12,
  },
  selector: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectorText: {
    fontSize: 16,
  },
});
