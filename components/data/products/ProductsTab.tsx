// components/data/ProductsTab.tsx
import { useProducts } from "@/hooks/product/useProducts";
import { useSettingsStore } from "@/stores/settingsStore";
import { Product } from "@/types/data";
import { useTheme } from "@/utils/theme";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  View,
} from "react-native";
import { StatsBar } from "../StatsBar";
import { ProductsListProduct } from "./ProductsListProduct";

export const ProductsTab = () => {
  const { colors } = useTheme();
  const {
    data: products = [],
    isLoading,
    refetch,
    isRefetching,
  } = useProducts();
  const { currency: userCurrency } = useSettingsStore();

  // Compute stats
  const totalPurchases = products.reduce(
    (sum, p) => sum + p.occurrenceCount,
    0,
  );
  const totalSpent = products
    .reduce((sum, p) => sum + p.totalSpent, 0)
    .toFixed(2);

  const stats = [
    { label: "Unique Products", value: products.length },
    { label: "Total Purchases", value: totalPurchases },
    { label: "Total Spent", value: `${userCurrency + " " + totalSpent}` },
  ];

  // Convert to shape expected by ProductsListProduct
  const convertToProductType = (product: Product) => ({
    id: product.id,
    name: product.name,
    normalizedName: product.name, // adjust if you have a dedicated field
    occurrenceCount: product.occurrenceCount,
    totalSpent: product.totalSpent,
    category: product.category,
  });

  // Initial loading state
  if (isLoading && products.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
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
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            colors={[colors.accent]}
            tintColor={colors.accent}
          />
        }
        ListEmptyComponent={
          !isLoading && products.length === 0 ? (
            <View
              style={{
                padding: 48,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{ color: colors.textSecondary, textAlign: "center" }}
              >
                No products yet.{"\n"}Add your first product by tapping the +
                button.
              </Text>
            </View>
          ) : null
        }
      />
    </View>
  );
};
