import { Product } from "@/types/data";
import { useTheme } from "@/utils/theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ProductsListProductProps {
  item: Product;
  onEdit: (item: Product) => void;
}

export const ProductsListProduct: React.FC<ProductsListProductProps> = ({
  item,
  onEdit,
}) => {
  const { colors } = useTheme();

  const handleDeleteProduct = (item: Product) => {
    Alert.alert(
      "Delete Product",
      `Are you sure you want to delete "${item.name}"? This will affect ${item.occurrenceCount} receipts.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            console.log("Delete item:", item.id);
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
            {item.name}
          </Text>
          <Text style={[styles.normalizedName, { color: colors.accent }]}>
            {item.normalizedName}
          </Text>
        </View>
        <View style={styles.listProductStats}>
          <Text
            style={[styles.listProductStat, { color: colors.textSecondary }]}
          >
            {item.occurrenceCount} purchases
          </Text>
          <Text
            style={[styles.listProductStat, { color: colors.textSecondary }]}
          >
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
      <View style={styles.listProductActions}>
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
          onPress={() => handleDeleteProduct(item)}
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
