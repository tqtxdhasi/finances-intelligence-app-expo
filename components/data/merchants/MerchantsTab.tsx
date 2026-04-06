// components/merchants/MerchantsTab.tsx
import { useMerchants } from "@/hooks/merchant/getAllMerchantsWithStats";
import { useTheme } from "@/utils/theme";
import { Ionicons } from "@expo/vector-icons";
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

// Skeleton loader component for better loading state
const LoadingSkeleton = () => {
  const { colors } = useTheme();
  return (
    <View style={styles.skeletonContainer}>
      {[1, 2, 3].map((item) => (
        <View
          key={item}
          style={[styles.skeletonItem, { backgroundColor: colors.surface }]}
        >
          <View
            style={[
              styles.skeletonIcon,
              { backgroundColor: colors.border || "#e0e0e0" },
            ]}
          />
          <View style={styles.skeletonContent}>
            <View
              style={[
                styles.skeletonTitle,
                { backgroundColor: colors.border || "#e0e0e0" },
              ]}
            />
            <View
              style={[
                styles.skeletonText,
                { backgroundColor: colors.border || "#e0e0e0" },
              ]}
            />
            <View
              style={[
                styles.skeletonText,
                { backgroundColor: colors.border || "#e0e0e0", width: "60%" },
              ]}
            />
          </View>
        </View>
      ))}
    </View>
  );
};

// Empty state component
const EmptyState = () => {
  const { colors } = useTheme();
  const router = useRouter();

  const handleAddMerchant = () => {
    router.push("/merchant/create");
  };

  return (
    <View style={styles.emptyContainer}>
      <Ionicons name="storefront-outline" size={60} color={colors.accent} />
      <Text style={[styles.emptyTitle, { color: colors.text }]}>
        No Merchants Yet
      </Text>
      <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
        Get started by adding your first merchant.
      </Text>
      <TouchableOpacity
        style={[styles.primaryButton, { backgroundColor: colors.accent }]}
        onPress={handleAddMerchant}
      >
        <Text style={styles.primaryButtonText}>+ Add New Merchant</Text>
      </TouchableOpacity>
    </View>
  );
};

export const MerchantsTab = () => {
  const { colors } = useTheme();
  const router = useRouter();

  // Use React Query hook
  const {
    data: merchants = [],
    isLoading,
    error,
    isFetching,
    refetch,
  } = useMerchants();

  // Pull-to-refresh handler
  const onRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  // Handle add merchant navigation
  const handleAddMerchant = useCallback(() => {
    router.push("/merchant/create");
  }, [router]);

  // Show skeleton loader during initial load
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.accent} />
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
          Loading merchants...
        </Text>
        <LoadingSkeleton />
      </View>
    );
  }

  // Error state
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

  // Calculate stats
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
          !isLoading && merchants.length === 0 ? <EmptyState /> : null
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

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    paddingTop: 20,
  },
  loadingText: {
    textAlign: "center",
    marginVertical: 12,
    fontSize: 14,
  },
  skeletonContainer: {
    paddingHorizontal: 16,
  },
  skeletonItem: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    marginBottom: 12,
    padding: 8,
  },
  skeletonIcon: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  skeletonContent: {
    flex: 1,
    gap: 8,
  },
  skeletonTitle: {
    height: 18,
    width: "70%",
    borderRadius: 4,
  },
  skeletonText: {
    height: 14,
    width: "50%",
    borderRadius: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 24,
  },
  primaryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  errorText: {
    fontSize: 16,
    textAlign: "center",
    marginVertical: 16,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
});
