import { Category } from "@/types/data";
import { useTheme } from "@/utils/theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface CategoryListItemProps {
  category: Category;
  level: number;
  isExpanded: boolean;
  onToggle: (id: string) => void;
  hasSubcategories: boolean;
}

export const CategoryListItem: React.FC<CategoryListItemProps> = ({
  category,
  level,
  isExpanded,
  onToggle,
  hasSubcategories,
}) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.categoryItem,
        { paddingLeft: 0 + level * 20, borderBottomColor: colors.border },
      ]}
      onPress={() => hasSubcategories && onToggle(category.id)}
    >
      <View style={styles.categoryContent}>
        {hasSubcategories && (
          <Ionicons
            name={isExpanded ? "chevron-down" : "chevron-forward"}
            size={20}
            color={colors.textSecondary}
            style={styles.chevron}
          />
        )}
        <Ionicons
          name={
            hasSubcategories && isExpanded ? "folder-open" : "folder-outline"
          }
          size={20}
          color={colors.accent}
        />
        <Text
          style={[styles.categoryName, { color: colors.text }]}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {category.name}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  categoryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  categoryContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginRight: 12,
  },
  chevron: {
    width: 20,
  },
  categoryName: {
    fontSize: 15,
    flex: 1,
    flexWrap: "wrap",
  },
  categoryActions: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  actionButton: {
    padding: 4,
  },
});
