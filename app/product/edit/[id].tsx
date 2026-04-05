// app/items/edit.tsx
import { useProducts } from "@/hooks/useProducts";
import { Product } from "@/types/data";
import { useTheme } from "@/utils/theme";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function EditItemScreen() {
  const { colors, styles: themeStyles } = useTheme();
  const { fetchProducts, updateProduct, deleteProduct, loading } =
    useProducts();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [product, setProduct] = useState<Product | null>(null);
  const [name, setName] = useState("");
  const [normalizedName, setNormalizedName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [loadingProduct, setLoadingProduct] = useState(true);

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    if (!id) return;

    const products = await fetchProducts();
    const found = products.find((p) => p.id === id);

    if (found) {
      setProduct(found);
      setName(found.name);
      setNormalizedName(found.normalizedName);
      setCategoryId(found.categoryId || "");
    }

    setLoadingProduct(false);
  };

  const handleUpdate = async () => {
    if (!name.trim()) {
      Alert.alert("Error", "Item name is required");
      return;
    }

    if (!normalizedName.trim()) {
      Alert.alert("Error", "Normalized name is required");
      return;
    }

    try {
      await updateProduct(id, {
        name: name.trim(),
        normalizedName: normalizedName.trim().toLowerCase(),
        categoryId: categoryId || undefined,
      });

      Alert.alert("Success", "Item updated successfully");
      router.back();
    } catch (error) {
      Alert.alert("Error", "Failed to update item");
      console.error(error);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Item",
      `Are you sure you want to delete "${name}"? This will affect all receipts containing this item.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteProduct(id);
              Alert.alert("Success", "Item deleted successfully");
              router.back();
            } catch (error) {
              Alert.alert("Error", "Failed to delete item");
              console.error(error);
            }
          },
        },
      ],
    );
  };

  if (loadingProduct) {
    return (
      <View
        style={[styles.centerContainer, { backgroundColor: colors.background }]}
      >
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  if (!product) {
    return (
      <View
        style={[styles.centerContainer, { backgroundColor: colors.background }]}
      >
        <Text style={{ color: colors.text }}>Item not found</Text>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ marginTop: 16 }}
        >
          <Text style={{ color: colors.accent }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={[themeStyles.container, styles.container]}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[themeStyles.title, styles.title]}>Edit Item</Text>
        <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
          <Ionicons name="trash-outline" size={24} color={colors.error} />
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        <Text style={[styles.label, { color: colors.text }]}>Item Name *</Text>
        <TextInput
          style={[
            styles.input,
            { backgroundColor: colors.surface, color: colors.text },
          ]}
          placeholder="e.g., Organic Whole Milk"
          placeholderTextColor={colors.textMuted}
          value={name}
          onChangeText={setName}
        />

        <Text style={[styles.label, { color: colors.text }]}>
          Normalized Name *
        </Text>
        <TextInput
          style={[
            styles.input,
            { backgroundColor: colors.surface, color: colors.text },
          ]}
          placeholder="e.g., milk"
          placeholderTextColor={colors.textMuted}
          value={normalizedName}
          onChangeText={setNormalizedName}
        />
        <Text style={[styles.helperText, { color: colors.textSecondary }]}>
          Used for matching across different receipts (lowercase, no spaces)
        </Text>

        <View style={styles.statsContainer}>
          <Text style={[styles.statsTitle, { color: colors.text }]}>
            Usage Statistics
          </Text>
          <View style={[styles.statBox, { backgroundColor: colors.surface }]}>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Times Purchased
            </Text>
            <Text style={[styles.statValue, { color: colors.accent }]}>
              {product.occurrenceCount}
            </Text>
          </View>
          <View style={[styles.statBox, { backgroundColor: colors.surface }]}>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Total Spent
            </Text>
            <Text style={[styles.statValue, { color: colors.accent }]}>
              ${product.totalSpent.toFixed(2)}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: colors.accent }]}
          onPress={handleUpdate}
          disabled={loading}
        >
          <Text style={[styles.saveButtonText, { color: colors.text }]}>
            {loading ? "Updating..." : "Update Item"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  backButton: {
    padding: 8,
  },
  deleteButton: {
    padding: 8,
  },
  title: {
    fontSize: 24,
  },
  form: {
    padding: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  helperText: {
    fontSize: 12,
    marginTop: 4,
  },
  statsContainer: {
    marginTop: 32,
    marginBottom: 16,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  statBox: {
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
  },
  saveButton: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 16,
    marginBottom: 32,
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
