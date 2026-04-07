// app/items/edit.tsx
import {
  useDeleteProduct,
  useProductById,
  useUpdateProduct,
} from "@/hooks/product/useProducts";
import { useSettingsStore } from "@/stores/settingsStore";
import { useTheme } from "@/utils/theme";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
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
  const { id } = useLocalSearchParams<{ id: string }>();
  const { currency: userCurrency } = useSettingsStore();

  // Fetch the single product from the cached list
  const { data: product, isLoading, error } = useProductById(id);
  const { mutate: updateProduct, isPending: isUpdating } = useUpdateProduct();
  const { mutate: deleteProduct, isPending: isDeleting } = useDeleteProduct();

  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");

  // When product loads, populate the form
  React.useEffect(() => {
    if (product) {
      setName(product.name);
      setCategoryId(product.category_id || "");
    }
  }, [product]);

  const handleUpdate = () => {
    if (!name.trim()) {
      Alert.alert("Error", "Product name is required");
      return;
    }

    updateProduct(
      {
        id,
        updates: {
          name: name.trim(),
          category_id: categoryId || undefined,
        },
      },
      {
        onSuccess: () => {
          Alert.alert("Success", "Product updated successfully");
          router.back();
        },
        onError: (error) => {
          Alert.alert("Error", "Failed to update product");
          console.error(error);
        },
      },
    );
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Product",
      `Are you sure you want to delete "${product?.name}"? This will affect ${product?.occurrenceCount || 0} receipts.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            deleteProduct(id, {
              onSuccess: () => {
                Alert.alert("Success", "Product deleted successfully");
                router.back();
              },
              onError: (error) => {
                Alert.alert("Error", "Failed to delete product");
                console.error(error);
              },
            });
          },
        },
      ],
    );
  };

  if (isLoading) {
    return (
      <View
        style={[styles.centerContainer, { backgroundColor: colors.background }]}
      >
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  if (error || !product) {
    return (
      <View
        style={[styles.centerContainer, { backgroundColor: colors.background }]}
      >
        <Text style={{ color: colors.text }}>
          Product not found: {JSON.stringify(error)}
        </Text>
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
        <Text style={[themeStyles.title, styles.title]}>Edit Product</Text>
        <TouchableOpacity
          onPress={handleDelete}
          style={styles.deleteButton}
          disabled={isDeleting}
        >
          {isDeleting ? (
            <ActivityIndicator size="small" color={colors.error} />
          ) : (
            <Ionicons name="trash-outline" size={24} color={colors.error} />
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        <Text style={[styles.label, { color: colors.text }]}>
          Product Name *
        </Text>
        <TextInput
          style={[
            styles.input,
            { backgroundColor: colors.surface, color: colors.text },
          ]}
          placeholder="e.g., Organic Whole Milk"
          placeholderTextColor={colors.textMuted}
          value={name}
          onChangeText={setName}
          editable={!isUpdating}
        />

        {/* Optional: category selector – you can reuse CategoryModal here */}

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
              {userCurrency} {product.totalSpent.toFixed(2)}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: colors.accent }]}
          onPress={handleUpdate}
          disabled={isUpdating}
        >
          <Text style={[styles.saveButtonText, { color: colors.text }]}>
            {isUpdating ? "Updating..." : "Update Product"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// Styles remain identical to your existing styles
const styles = StyleSheet.create({
  container: { flex: 1 },
  centerContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  backButton: { padding: 8 },
  deleteButton: { padding: 8 },
  title: { fontSize: 24 },
  form: { padding: 16 },
  label: { fontSize: 14, fontWeight: "600", marginBottom: 8, marginTop: 16 },
  input: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  helperText: { fontSize: 12, marginTop: 4 },
  statsContainer: { marginTop: 32, marginBottom: 16 },
  statsTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 12 },
  statBox: { borderRadius: 8, padding: 12, marginBottom: 8 },
  statLabel: { fontSize: 12, marginBottom: 4 },
  statValue: { fontSize: 20, fontWeight: "bold" },
  saveButton: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 16,
    marginBottom: 32,
  },
  saveButtonText: { fontSize: 18, fontWeight: "bold" },
});
