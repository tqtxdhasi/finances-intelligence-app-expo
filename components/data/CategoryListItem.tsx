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
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
  hasSubcategories: boolean;
}

export const CategoryListItem: React.FC<CategoryListItemProps> = ({
  category,
  level,
  isExpanded,
  onToggle,
  onEdit,
  onDelete,
  hasSubcategories,
}) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.categoryItem,
        { paddingLeft: 16 + level * 20, borderBottomColor: colors.border },
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
        <Text style={[styles.categoryName, { color: colors.text }]}>
          {category.name}
        </Text>
      </View>
      <View style={styles.categoryActions}>
        <TouchableOpacity
          onPress={() => onEdit(category)}
          style={styles.actionButton}
        >
          <Ionicons
            name="create-outline"
            size={18}
            color={colors.textSecondary}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onDelete(category)}
          style={styles.actionButton}
        >
          <Ionicons
            name="trash-outline"
            size={18}
            color={colors.error || "#ff4444"}
          />
        </TouchableOpacity>
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
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  chevron: {
    width: 20,
  },
  categoryName: {
    fontSize: 15,
  },
  categoryActions: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    padding: 4,
  },
});
