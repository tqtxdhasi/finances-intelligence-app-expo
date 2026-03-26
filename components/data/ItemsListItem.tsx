import { Item } from "@/types/data";
import { useTheme } from "@/utils/theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ItemsListItemProps {
  item: Item;
  onEdit: (item: Item) => void;
  onDelete: (item: Item) => void;
}

export const ItemsListItem: React.FC<ItemsListItemProps> = ({
  item,
  onEdit,
  onDelete,
}) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.listItem, { backgroundColor: colors.surface }]}>
      <View style={styles.listItemContent}>
        <View style={styles.itemHeader}>
          <Text style={[styles.listItemTitle, { color: colors.text }]}>
            {item.name}
          </Text>
          <Text style={[styles.normalizedName, { color: colors.accent }]}>
            {item.normalizedName}
          </Text>
        </View>
        <View style={styles.listItemStats}>
          <Text style={[styles.listItemStat, { color: colors.textSecondary }]}>
            {item.occurrenceCount} purchases
          </Text>
          <Text style={[styles.listItemStat, { color: colors.textSecondary }]}>
            ${item.totalSpent.toFixed(2)}
          </Text>
          {item.category && (
            <View
              style={[
                styles.categoryTag,
                { backgroundColor: colors.surfaceLight },
              ]}
            >
              <Text
                style={[
                  styles.categoryTagText,
                  { color: colors.textSecondary },
                ]}
              >
                {item.category}
              </Text>
            </View>
          )}
        </View>
      </View>
      <View style={styles.listItemActions}>
        <TouchableOpacity
          onPress={() => onEdit(item)}
          style={styles.actionButton}
        >
          <Ionicons
            name="create-outline"
            size={20}
            color={colors.textSecondary}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onDelete(item)}
          style={styles.actionButton}
        >
          <Ionicons
            name="trash-outline"
            size={20}
            color={colors.error || "#ff4444"}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  listItem: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  listItemContent: {
    flex: 1,
  },
  listItemTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  listItemStats: {
    flexDirection: "row",
    gap: 12,
    marginTop: 4,
  },
  listItemStat: {
    fontSize: 12,
  },
  listItemActions: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    padding: 4,
  },
  itemHeader: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 8,
    marginBottom: 4,
  },
  normalizedName: {
    fontSize: 12,
    fontFamily: "monospace",
  },
  categoryTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  categoryTagText: {
    fontSize: 10,
  },
});
