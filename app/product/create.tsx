import CategoryModal from "@/components/data/categories/CategoryModal";
import { useCreateProduct } from "@/hooks/product/useProducts";
import { useTheme } from "@/utils/theme";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function CreateItemScreen() {
  const { colors, styles: themeStyles } = useTheme();
  const { mutate: createProduct, isPending: loading } = useCreateProduct();

  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [categoryName, setCategoryName] = useState<string>("");
  const [aliases, setAliases] = useState<string[]>([]);
  const [currentAlias, setCurrentAlias] = useState("");
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);

  const addAlias = () => {
    if (currentAlias.trim()) {
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

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert("Error", "Product name is required");
      return;
    }

    createProduct(
      {
        name: name.trim(),
        categoryId: categoryId || undefined,
        aliases: aliases.length > 0 ? aliases : undefined,
      },
      {
        onSuccess: () => {
          Alert.alert("Success", "Product created successfully");
          router.back();
        },
        onError: (error) => {
          Alert.alert("Error", "Failed to create product");
          console.error(error);
        },
      },
    );
  };

  return (
    <ScrollView style={[themeStyles.container, styles.container]}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[themeStyles.title, styles.title]}>Create Product</Text>
        <View style={{ width: 40 }} />
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
        />

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

        <Text style={[styles.label, { color: colors.text }]}>
          Receipt Name Aliases
        </Text>
        <Text style={[styles.helperText, { color: colors.textSecondary }]}>
          Common ways this product appears on receipts (e.g., "MILK", "WHL MLK",
          "MLEKO")
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
          onPress={handleSave}
          disabled={loading}
        >
          <Text style={[styles.saveButtonText, { color: colors.text }]}>
            {loading ? "Creating..." : "Create Product"}
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
  container: {
    flex: 1,
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
  saveButton: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 32,
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
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
  dropdownButtonText: {
    fontSize: 16,
  },
});
