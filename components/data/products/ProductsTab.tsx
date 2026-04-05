// components/data/ProductsTab.tsx
import { Product, useProducts } from "@/hooks/useProducts";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, View } from "react-native";
import { StatsBar } from "../StatsBar";
import { ProductsListProduct } from "./ProductsListProduct";

interface ProductsTabProps {
  onEditProduct: (item: Product) => void;
}

export const ProductsTab: React.FC<ProductsTabProps> = ({ onEditProduct }) => {
  const { fetchProducts, loading } = useProducts();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const data = await fetchProducts();
    setProducts(data);
  };

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
    { label: "Total Spent", value: `$${totalSpent}` },
  ];

  const convertToProductType = (product: Product): Product => ({
    id: product.id,
    name: product.name,
    normalizedName: product.normalizedName,
    occurrenceCount: product.occurrenceCount,
    totalSpent: product.totalSpent,
    category: product.categoryName,
  });

  if (loading) {
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
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ProductsListProduct
            product={convertToProductType(item)}
            onEdit={onEditProduct}
          />
        )}
        onRefresh={loadProducts}
        refreshing={loading}
      />
    </View>
  );
};
