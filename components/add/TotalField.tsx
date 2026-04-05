// components/add/TotalField.tsx
import { useTheme } from "@/utils/theme";
import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

interface Props {
  total: string;
}

export default function TotalField({ total }: Props) {
  const { colors } = useTheme();

  return (
    <View>
      <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
        Total
      </Text>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: colors.surface,
            color: colors.text,
          },
        ]}
        placeholder="0.00"
        placeholderTextColor={colors.textMuted}
        keyboardType="decimal-pad"
        value={total}
        editable={false}
      />
      <Text style={[styles.autoCalcText, { color: colors.textMuted }]}>
        Auto-calculated from items
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  inputLabel: {
    fontSize: 14,
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  autoCalcText: {
    fontSize: 12,
    marginTop: 8,
    fontStyle: "italic",
  },
});
