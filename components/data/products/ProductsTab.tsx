// components/data/ProductsTab.tsx (updated)
import { useGetAllProducts } from "@/hooks/product/getAllProducts";
import { useSettingsStore } from "@/stores/settingsStore";
import { Product } from "@/types/data";
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
import { EmptyState } from "../EmptyState";
import { LoadingSkeleton } from "../LoadingSkeleton";
import { StatsBar } from "../StatsBar";
import { ProductsListProduct } from "./ProductsListProduct";

export const ProductsTab = () => {
  const { colors } = useTheme();
  const router = useRouter();
  const {
    data: products = [],
    isLoading,
    error,
    refetch,
    isFetching,
  } = useGetAllProducts();
  const { currency: userCurrency } = useSettingsStore();

  const totalPurchases = products.reduce(
    (sum, p) => sum + (p.occurrenceCount || 0),
    0,
  );
  const totalSpent = products
    .reduce((sum, p) => sum + (p.totalSpent || 0), 0)
    .toFixed(2);
  const stats = [
    { label: "Unique Products", value: products.length },
    { label: "Total Purchases", value: totalPurchases },
    { label: "Total Spent", value: `${userCurrency} ${totalSpent}` },
  ];

  const convertToProductType = (product: Product) => ({
    id: product.id,
    name: product.name,
    normalizedName: product.name,
    occurrenceCount: product.occurrenceCount || 0,
    totalSpent: product.totalSpent || 0,
    category: product.category || null,
  });

  const onRefresh = useCallback(() => refetch(), [refetch]);
  const handleAddProduct = useCallback(
    () => router.push("/product/create"),
    [router],
  );

  if (isLoading && products.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.accent} />
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
          Loading products...
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
          {error.message || "Failed to load products. Please try again."}
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

  return (
    <View style={{ flex: 1 }}>
      <StatsBar stats={stats} />
      <FlatList
        data={products}
        keyExtractor={(product) => product.id}
        renderItem={({ item }) => (
          <ProductsListProduct product={convertToProductType(item)} />
        )}
        ListEmptyComponent={
          !isLoading && products.length === 0 ? (
            <EmptyState
              icon="cube-outline"
              title="No Products Yet"
              subtitle="Get started by adding your first product."
              buttonText="+ Add New Product"
              onPress={handleAddProduct}
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
        contentContainerStyle={[products.length === 0 && { flex: 1 }]}
      />
    </View>
  );
};

// Keep existing styles (same as before)
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
});
