// app/product/edit.tsx
import CategoryModal from "@/components/data/categories/CategoryModal";
import { useDeleteProduct } from "@/hooks/product/deleteProductById";
import { useProductById } from "@/hooks/product/getProductById";
import {
  UpdateProductDTO,
  useUpdateProduct,
} from "@/hooks/product/updateProductById";
import { useSettingsStore } from "@/stores/settingsStore";
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

export default function EditProductScreen() {
  const { colors, styles: themeStyles } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { currency: userCurrency } = useSettingsStore();

  // Fetch product data (includes aliases)
  const { data: product, isLoading, error } = useProductById(id);
  const { mutate: updateProduct, isPending: isUpdating } = useUpdateProduct();
  const { mutate: deleteProduct, isPending: isDeleting } = useDeleteProduct();

  // Form state
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [categoryName, setCategoryName] = useState("");
  const [aliases, setAliases] = useState<string[]>([]);
  const [currentAlias, setCurrentAlias] = useState("");
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);

  // Populate form when product loads
  useEffect(() => {
    if (product) {
      setName(product.name);
      setCategoryId(product.category_id || null);
      setCategoryName(product.category || "");
      setAliases(product.aliases || []);
    }
  }, [product]);

  const addAlias = () => {
    if (currentAlias.trim() && !aliases.includes(currentAlias.trim())) {
      setAliases([...aliases, currentAlias.trim()]);
      setCurrentAlias("");
    }
  };

  const removeAlias = (index: number) => {
    setAliases(aliases.filter((_, i) => i !== index));
  };

  const handleSelectCategory = (id: string, name: string) => {
    setCategoryId(id);
    setCategoryName(name);
    setCategoryModalVisible(false);
  };

  const handleUpdate = () => {
    if (!name.trim()) {
      Alert.alert("Error", "Product name is required");
      return;
    }

    const updates: UpdateProductDTO = {
      name: name.trim(),
      categoryId: categoryId || null,
      aliases: aliases,
    };

    updateProduct(
      { id, data: updates },
      {
        onSuccess: () => {
          Alert.alert("Success", "Product updated successfully");
          router.back();
        },
        onError: (err: any) => {
          Alert.alert("Error", "Failed to update product");
          console.error(err);
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
              onError: (err) => {
                Alert.alert("Error", "Failed to delete product");
                console.error(err);
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
        <Text style={{ color: colors.text }}>Product not found</Text>
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
        {/* Product Name */}
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

        {/* Category Selection */}
        <Text style={[styles.label, { color: colors.text }]}>Category</Text>
        <TouchableOpacity
          style={[
            styles.dropdownButton,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
          onPress={() => setCategoryModalVisible(true)}
        >
          <Text style={[styles.dropdownButtonText, { color: colors.text }]}>
            {categoryName || "Select a category"}
          </Text>
          <Ionicons name="chevron-down" size={20} color={colors.textMuted} />
        </TouchableOpacity>

        {/* Aliases Management */}
        <Text style={[styles.label, { color: colors.text }]}>
          Receipt Name Aliases
        </Text>
        <Text style={[styles.helperText, { color: colors.textSecondary }]}>
          Common ways this product appears on receipts (e.g., "MILK", "WHL MLK")
        </Text>

        <View style={styles.aliasInputContainer}>
          <TextInput
            style={[
              styles.aliasInput,
              { backgroundColor: colors.surface, color: colors.text },
            ]}
            placeholder="e.g., MLEKO 2%"
            placeholderTextColor={colors.textMuted}
            value={currentAlias}
            onChangeText={setCurrentAlias}
            onSubmitEditing={addAlias}
          />
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: colors.accent }]}
            onPress={addAlias}
          >
            <Ionicons name="add" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        {aliases.length > 0 && (
          <View style={styles.aliasesList}>
            {aliases.map((alias, index) => (
              <View
                key={index}
                style={[styles.aliasChip, { backgroundColor: colors.surface }]}
              >
                <Text style={[styles.aliasText, { color: colors.text }]}>
                  {alias}
                </Text>
                <TouchableOpacity onPress={() => removeAlias(index)}>
                  <Ionicons
                    name="close-circle"
                    size={20}
                    color={colors.textMuted}
                  />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

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

      <CategoryModal
        visible={categoryModalVisible}
        selectedCategoryId={categoryId}
        onSelectCategory={handleSelectCategory}
        onClose={() => setCategoryModalVisible(false)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
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
  aliasInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  aliasInput: {
    flex: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginRight: 8,
  },
  addButton: {
    padding: 10,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  aliasesList: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 12,
  },
  aliasChip: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  aliasText: {
    fontSize: 14,
    marginRight: 6,
  },
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
  dropdownButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    marginTop: 8,
  },
  dropdownButtonText: { fontSize: 16 },
});
