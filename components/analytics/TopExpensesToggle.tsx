import { useTheme } from "@/utils/theme";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface TopExpensesToggleProps {
  type: "category" | "product";
  onTypeChange: (type: "category" | "product") => void;
}

export const TopExpensesToggle: React.FC<TopExpensesToggleProps> = ({
  type,
  onTypeChange,
}) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.toggleContainer, { backgroundColor: colors.surface }]}>
      <TouchableOpacity
        style={[
          styles.toggleButton,
          type === "category" && { backgroundColor: colors.accent },
        ]}
        onPress={() => onTypeChange("category")}
      >
        <Text
          style={[
            styles.toggleText,
            { color: colors.textSecondary },
            type === "category" && { color: colors.text, fontWeight: "bold" },
          ]}
        >
          By Category
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.toggleButton,
          type === "product" && { backgroundColor: colors.accent },
        ]}
        onPress={() => onTypeChange("product")}
      >
        <Text
          style={[
            styles.toggleText,
            { color: colors.textSecondary },
            type === "product" && { color: colors.text, fontWeight: "bold" },
          ]}
        >
          By Product
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  toggleContainer: {
    flexDirection: "row",
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 8,
  },
  toggleText: {
    fontSize: 14,
  },
});
