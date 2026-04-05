// components/add/BasicInfoSection.tsx
import { useTheme } from "@/utils/theme";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import MerchantField from "./MerchantField";
import DateField from "./DateField";
import TimeField from "./TimeField";
import CurrencyField from "./CurrencyField";
import TotalField from "./TotalField";

interface Props {
  merchantName: string;
  merchantAddress: string;
  onMerchantSelect: (merchant: {
    id: string;
    name: string;
    address: string;
    locationId?: string;
  }) => void;
  date: string;
  onDateChange: (date: string) => void;
  time: string;
  onTimeChange: (time: string) => void;
  originalCurrency: string;
  onCurrencyChange: (currency: string) => void;
  originalTotal: string;
  preferredCurrency?: string;
}

export default function BasicInfoSection({
  merchantName,
  merchantAddress,
  onMerchantSelect,
  date,
  onDateChange,
  time,
  onTimeChange,
  originalCurrency,
  onCurrencyChange,
  originalTotal,
  preferredCurrency = "USD",
}: Props) {
  const { colors, styles: themeStyles } = useTheme();

  return (
    <View
      style={[
        styles.section,
        { backgroundColor: colors.surface, borderColor: colors.border },
      ]}
    >
      <Text style={[themeStyles.title, styles.sectionTitle]}>
        Basic Information
      </Text>

      <MerchantField
        merchantName={merchantName}
        merchantAddress={merchantAddress}
        onMerchantSelect={onMerchantSelect}
      />

      <View style={styles.row}>
        <View style={styles.halfColumn}>
          <DateField date={date} onDateChange={onDateChange} />
        </View>
        <View style={styles.halfColumn}>
          <TimeField time={time} onTimeChange={onTimeChange} />
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.halfColumn}>
          <CurrencyField
            currency={originalCurrency}
            onCurrencyChange={onCurrencyChange}
            preferredCurrency={preferredCurrency}
          />
        </View>
        <View style={styles.halfColumn}>
          <TotalField total={originalTotal} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
    gap: 12,
    marginTop: 0,
  },
  halfColumn: {
    flex: 1,
  },
});
