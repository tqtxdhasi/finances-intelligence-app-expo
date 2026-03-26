import { Merchant } from "@/types/data";
import { useTheme } from "@/utils/theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface MerchantsListItemProps {
  merchant: Merchant;
  onEdit: (merchant: Merchant) => void;
  onDelete: (merchant: Merchant) => void;
}

export const MerchantsListItem: React.FC<MerchantsListItemProps> = ({
  merchant,
  onEdit,
  onDelete,
}) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.listItem, { backgroundColor: colors.surface }]}>
      <View style={styles.listItemContent}>
        <Text style={[styles.listItemTitle, { color: colors.text }]}>
          {merchant.name}
        </Text>
        {merchant.locations && merchant.locations.length > 0 && (
          <Text style={[styles.locationCount, { color: colors.accent }]}>
            {merchant.locations.length} location
            {merchant.locations.length !== 1 ? "s" : ""}
          </Text>
        )}
        <View style={styles.listItemStats}>
          <Text style={[styles.listItemStat, { color: colors.textSecondary }]}>
            {merchant.receiptCount} receipts
          </Text>
          <Text style={[styles.listItemStat, { color: colors.textSecondary }]}>
            ${merchant.totalSpent.toFixed(2)}
          </Text>
        </View>
      </View>
      <View style={styles.listItemActions}>
        <TouchableOpacity
          onPress={() => onEdit(merchant)}
          style={styles.actionButton}
        >
          <Ionicons
            name="create-outline"
            size={20}
            color={colors.textSecondary}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onDelete(merchant)}
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
  locationCount: {
    fontSize: 12,
    marginBottom: 4,
  },
});
