import { useTheme } from "@/utils/theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface Props {
  merchantName: string;
  onMerchantPress: () => void;
  date: string;
  onDatePress: () => void;
  time: string;
  onTimePress: () => void;
  originalCurrency: string;
  onCurrencyPress: () => void;
  originalTotal: string;
}

export default function BasicInfoSection({
  merchantName,
  onMerchantPress,
  date,
  onDatePress,
  time,
  onTimePress,
  originalCurrency,
  onCurrencyPress,
  originalTotal,
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

      <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
        Merchant *
      </Text>
      <TouchableOpacity
        style={[styles.selector, { backgroundColor: colors.surfaceLight }]}
        onPress={onMerchantPress}
      >
        <Text style={[styles.selectorText, { color: colors.text }]}>
          {merchantName || "Select Merchant"}
        </Text>
        <Ionicons name="chevron-down" size={20} color={colors.textSecondary} />
      </TouchableOpacity>

      <View style={styles.row}>
        <View style={styles.halfColumn}>
          <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
            Date *
          </Text>
          <TouchableOpacity
            style={[styles.selector, { backgroundColor: colors.surfaceLight }]}
            onPress={onDatePress}
          >
            <Text style={[styles.selectorText, { color: colors.text }]}>
              {date}
            </Text>
            <Ionicons
              name="calendar-outline"
              size={20}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.halfColumn}>
          <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
            Time *
          </Text>
          <TouchableOpacity
            style={[styles.selector, { backgroundColor: colors.surfaceLight }]}
            onPress={onTimePress}
          >
            <Text style={[styles.selectorText, { color: colors.text }]}>
              {time || "Select time"}
            </Text>
            <Ionicons
              name="time-outline"
              size={20}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        </View>
      </View>

      <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
        Currency
      </Text>
      <TouchableOpacity
        style={[styles.selector, { backgroundColor: colors.surfaceLight }]}
        onPress={onCurrencyPress}
      >
        <Text style={[styles.selectorText, { color: colors.text }]}>
          {originalCurrency}
        </Text>
        <Ionicons name="chevron-down" size={20} color={colors.textSecondary} />
      </TouchableOpacity>

      <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
        Total
      </Text>
      <View style={styles.totalContainer}>
        <View
          style={[styles.totalCurrency, { backgroundColor: colors.accent }]}
        >
          <Text style={[styles.totalCurrencyText, { color: colors.text }]}>
            {originalCurrency}
          </Text>
        </View>
        <TextInput
          style={[
            styles.input,
            styles.totalInput,
            {
              backgroundColor: colors.surfaceLight,
              color: colors.text,
            },
          ]}
          placeholder="0.00"
          placeholderTextColor={colors.textMuted}
          keyboardType="decimal-pad"
          value={originalTotal}
          editable={false}
        />
      </View>
      <Text style={[styles.autoCalcText, { color: colors.textMuted }]}>
        Auto-calculated from items
      </Text>
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
  row: {
    flexDirection: "row",
    gap: 12,
    marginTop: 0,
  },
  halfColumn: {
    flex: 1,
  },
  totalContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  totalCurrency: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
  },
  totalCurrencyText: {
    fontWeight: "bold",
    fontSize: 16,
  },
  input: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  totalInput: {
    flex: 1,
  },
  autoCalcText: {
    fontSize: 12,
    marginTop: 8,
    fontStyle: "italic",
  },
});
