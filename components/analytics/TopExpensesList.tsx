import { TopExpense } from "@/types/analytics";
import { useTheme } from "@/utils/theme";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface TopExpensesListProps {
  title: string;
  expenses: TopExpense[];
  isProduct?: boolean;
  onProductPress?: (product: TopExpense) => void;
}

export const TopExpensesList: React.FC<TopExpensesListProps> = ({
  title,
  expenses,
  isProduct = false,
  onProductPress,
}) => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      {expenses.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={[styles.expenseItem, { backgroundColor: colors.surface }]}
          onPress={() => isProduct && onProductPress?.(item)}
        >
          <View style={styles.expenseInfo}>
            <Text style={[styles.expenseName, { color: colors.text }]}>
              {item.name}
            </Text>
            <View
              style={[
                styles.progressBarContainer,
                { backgroundColor: colors.surfaceLight },
              ]}
            >
              <View
                style={[
                  styles.progressBar,
                  {
                    width: `${item.percentage}%`,
                    backgroundColor: colors.accent,
                  },
                ]}
              />
            </View>
          </View>
          <View style={styles.expenseAmounts}>
            <Text style={[styles.expenseTotal, { color: colors.accent }]}>
              ${item.total.toFixed(2)}
            </Text>
            <Text
              style={[styles.expensePercentage, { color: colors.textMuted }]}
            >
              {item.percentage}%
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  expenseItem: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  expenseInfo: {
    flex: 1,
  },
  expenseName: {
    fontSize: 16,
    marginBottom: 8,
  },
  progressBarContainer: {
    height: 4,
    borderRadius: 2,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    borderRadius: 2,
  },
  expenseAmounts: {
    alignItems: "flex-end",
  },
  expenseTotal: {
    fontSize: 16,
    fontWeight: "bold",
  },
  expensePercentage: {
    fontSize: 12,
    marginTop: 4,
  },
});
