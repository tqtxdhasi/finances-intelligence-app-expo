// components/merchants/MerchantsListItem.tsx
import { useSettingsStore } from "@/stores/settingsStore";
import { Merchant } from "@/types/data";
import { useTheme } from "@/utils/theme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { DeleteButton } from "./DeleteButton";

interface MerchantsListItemProps {
  merchant: Merchant;
  onDeleteSuccess: () => void;
}

export const MerchantsListItem: React.FC<MerchantsListItemProps> = ({
  merchant,
  onDeleteSuccess,
}) => {
  const { colors } = useTheme();
  const router = useRouter();
  const { currency } = useSettingsStore();
  const handlePress = () => {
    router.push(`/merchant/${merchant.id}`);
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      style={[styles.listItem, { backgroundColor: colors.surface }]}
    >
      <View style={styles.iconContainer}>
        {merchant.merchant_logo ? (
          <Image
            source={{ uri: merchant.merchant_logo }}
            style={styles.logo}
            resizeMode="cover"
          />
        ) : (
          <Ionicons name="storefront-outline" size={32} color={colors.accent} />
        )}
      </View>
      <View style={styles.listItemContent}>
        <Text
          style={[styles.listItemTitle, { color: colors.text }]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {merchant.name}
        </Text>
        {merchant.locations && merchant.locations.length > 0 && (
          <Text style={[styles.locationCount, { color: colors.accent }]}>
            {merchant.locations.length} location
            {merchant.locations.length !== 1 ? "s" : ""}
          </Text>
        )}
        <Text style={[styles.listItemStat, { color: colors.textSecondary }]}>
          {merchant.receiptCount} receipt
          {merchant.receiptCount !== 1 ? "s" : ""}
        </Text>
        <Text style={[styles.listItemStat, { color: colors.textSecondary }]}>
          {`${currency} ${merchant.totalSpent?.toFixed(2)} spent`}
        </Text>
      </View>
      <View style={styles.actions}>
        <DeleteButton
          merchant={merchant}
          onDeleteSuccess={onDeleteSuccess}
          errorColor={colors.error}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  listItem: {
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    paddingRight: 12,
  },
  iconContainer: {
    width: 80,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 8,
    margin: 8,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  listItemContent: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  listItemTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  listItemStat: {
    fontSize: 12,
    marginTop: 2,
  },
  locationCount: {
    fontSize: 12,
    marginBottom: 2,
    fontWeight: "500",
  },
  actions: {
    flexDirection: "row",
    gap: 16,
  },
});
