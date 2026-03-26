import { useTheme } from "@/utils/theme";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface TotalCardProps {
  total: number;
}

export const TotalCard: React.FC<TotalCardProps> = ({ total }) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.totalCard, { backgroundColor: colors.surface }]}>
      <Text style={[styles.totalLabel, { color: colors.textSecondary }]}>
        Total Expenses
      </Text>
      <Text style={[styles.totalAmount, { color: colors.accent }]}>
        ${total.toFixed(2)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  totalCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    alignItems: "center",
  },
  totalLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  totalAmount: {
    fontSize: 36,
    fontWeight: "bold",
  },
});
