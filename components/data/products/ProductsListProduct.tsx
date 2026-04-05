import { Product } from "@/types/data";
import { useTheme } from "@/utils/theme";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ProductsListProductProps {
  product: Product;
}

export const ProductsListProduct: React.FC<ProductsListProductProps> = ({
  product,
}) => {
  const { colors } = useTheme();

  const handleDeleteProduct = (product: Product) => {
    Alert.alert(
      "Delete Product",
      `Are you sure you want to delete "${product.name}"? This will affect ${product.occurrenceCount} receipts.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            console.log("Delete item:", product.id);
            Alert.alert("Success", "Product deleted");
          },
        },
      ],
    );
  };

  return (
    <View style={[styles.listProduct, { backgroundColor: colors.surface }]}>
      <View style={styles.listProductContent}>
        <View style={styles.itemHeader}>
          <Text style={[styles.listProductTitle, { color: colors.text }]}>
            {product.name}
          </Text>
          <Text style={[styles.normalizedName, { color: colors.accent }]}>
            {product.normalizedName}
          </Text>
        </View>
        <View style={styles.listProductStats}>
          <Text
            style={[styles.listProductStat, { color: colors.textSecondary }]}
          >
            {product.occurrenceCount} purchases
          </Text>
          <Text
            style={[styles.listProductStat, { color: colors.textSecondary }]}
          >
            ${product.totalSpent.toFixed(2)}
          </Text>
          {product.category && (
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
                {product.category}
              </Text>
            </View>
          )}
        </View>
      </View>
      <View style={styles.listProductActions}>
        <TouchableOpacity
          onPress={() => router.push(`/product/edit/${product.id}`)}
          style={styles.actionButton}
        >
          <Ionicons
            name="create-outline"
            size={20}
            color={colors.textSecondary}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleDeleteProduct(product)}
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
  listProduct: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  listProductContent: {
    flex: 1,
  },
  listProductTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  listProductStats: {
    flexDirection: "row",
    gap: 12,
    marginTop: 4,
  },
  listProductStat: {
    fontSize: 12,
  },
  listProductActions: {
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
