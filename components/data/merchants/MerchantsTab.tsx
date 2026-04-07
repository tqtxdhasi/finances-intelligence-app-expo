// components/merchants/MerchantsTab.tsx (updated)
import { useMerchants } from "@/hooks/merchant/getAllMerchantsWithStats";
import { useTheme } from "@/utils/theme";
import { useRouter } from "expo-router";
import React, { useCallback } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { StatsBar } from "../StatsBar";
import { MerchantsListItem } from "./MerchantsListItem";
import { LoadingSkeleton } from "../LoadingSkeleton";
import { Ionicons } from "@expo/vector-icons";
import { EmptyState } from "../EmptyState";

export const MerchantsTab = () => {
  const { colors } = useTheme();
  const router = useRouter();

  const {
    data: merchants = [],
    isLoading,
    error,
    isFetching,
    refetch,
  } = useMerchants();

  const onRefresh = useCallback(() => refetch(), [refetch]);
  const handleAddMerchant = useCallback(
    () => router.push("/merchant/create"),
    [router],
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.accent} />
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
          Loading merchants...
        </Text>
        <LoadingSkeleton count={3} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={60} color={colors.error} />
        <Text style={[styles.errorText, { color: colors.text }]}>
          {error.message || "Failed to load merchants. Please try again."}
        </Text>
        <TouchableOpacity
          style={[styles.retryButton, { backgroundColor: colors.accent }]}
          onPress={() => refetch()}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const totalReceipts = merchants.reduce((sum, m) => sum + m.receiptCount, 0);
  const totalLocations = merchants.reduce(
    (sum, m) => sum + m.locations.length,
    0,
  );
  const stats = [
    { label: "Total Merchants", value: merchants.length },
    { label: "Total Locations", value: totalLocations },
    { label: "Total Receipts", value: totalReceipts },
  ];

  return (
    <View style={{ flex: 1 }}>
      <StatsBar stats={stats} />
      <FlatList
        data={merchants}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <MerchantsListItem
            merchant={item}
            onDeleteSuccess={() => refetch()}
          />
        )}
        ListEmptyComponent={
          !isLoading && merchants.length === 0 ? (
            <EmptyState
              icon="storefront-outline"
              title="No Merchants Yet"
              subtitle="Get started by adding your first merchant."
              buttonText="+ Add New Merchant"
              onPress={handleAddMerchant}
            />
          ) : null
        }
        refreshControl={
          <RefreshControl
            refreshing={isFetching && !isLoading}
            onRefresh={onRefresh}
            colors={[colors.accent]}
            tintColor={colors.accent}
            title="Pull to refresh"
            titleColor={colors.textSecondary}
          />
        }
        contentContainerStyle={[
          styles.listContent,
          merchants.length === 0 && { flex: 1 },
        ]}
      />
    </View>
  );
};

// Keep existing styles (same as before) – we can also extract shared styles later if needed.
const styles = StyleSheet.create({
  loadingContainer: { flex: 1, paddingTop: 20 },
  loadingText: { textAlign: "center", marginVertical: 12, fontSize: 14 },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  errorText: { fontSize: 16, textAlign: "center", marginVertical: 16 },
  retryButton: { paddingHorizontal: 24, paddingVertical: 10, borderRadius: 8 },
  retryButtonText: { color: "#fff", fontWeight: "600" },
  listContent: { paddingHorizontal: 16, paddingBottom: 20 },
});
