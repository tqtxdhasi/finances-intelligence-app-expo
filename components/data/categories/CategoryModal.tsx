import { executeQuery } from "@/hooks/executeQuery";
import { useTheme } from "@/utils/theme";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface Category {
  id: string;
  name: string;
  parent_id?: string;
  level?: number;
}

interface CategoryModalProps {
  visible: boolean;
  selectedCategoryId: string | null;
  onSelectCategory: (categoryId: string, category: string) => void;
  onClose: () => void;
}

export default function CategoryModal({
  visible,
  selectedCategoryId,
  onSelectCategory,
  onClose,
}: CategoryModalProps) {
  const { colors } = useTheme();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch categories when modal opens
  useEffect(() => {
    if (!visible) {
      setSearchQuery("");
      return;
    }

    const fetchCategories = async () => {
      setLoading(true);
      try {
        const query = `
          SELECT id, name, parent_id, level
          FROM categories
          ORDER BY level ASC, name ASC
        `;
        const result = await executeQuery(query, []);
        setCategories(result as Category[]);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [visible]);

  const filteredCategories =
    searchQuery.trim() === ""
      ? categories
      : categories.filter((cat) =>
          cat.name.toLowerCase().includes(searchQuery.toLowerCase()),
        );

  const renderItem = ({ item }: { item: Category }) => {
    const isSelected = selectedCategoryId === item.id;
    // Indent based on level (optional)
    const indent = (item.level || 0) * 16;

    return (
      <TouchableOpacity
        style={[
          styles.modalItem,
          { borderBottomColor: colors.border, paddingLeft: 12 + indent },
          isSelected && { backgroundColor: colors.accent + "20" },
        ]}
        onPress={() => onSelectCategory(item.id, item.name)}
      >
        <Text style={[styles.modalItemText, { color: colors.text }]}>
          {item.name}
        </Text>
        {isSelected && (
          <Ionicons name="checkmark" size={20} color={colors.accent} />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[styles.modalContainer, { backgroundColor: colors.surface }]}
          >
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                Select Category
              </Text>
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <TextInput
              style={[
                styles.modalSearch,
                { backgroundColor: colors.surfaceLight, color: colors.text },
              ]}
              placeholder="Search categories..."
              placeholderTextColor={colors.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
            />

            {loading ? (
              <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color={colors.accent} />
              </View>
            ) : filteredCategories.length === 0 ? (
              <Text style={[styles.noResults, { color: colors.textMuted }]}>
                No matching categories
              </Text>
            ) : (
              <FlatList
                data={filteredCategories}
                keyExtractor={(item) => item.id}
                keyboardShouldPersistTaps="handled"
                renderItem={renderItem}
                style={styles.modalList}
                contentContainerStyle={{ paddingBottom: 20 }}
              />
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: { fontSize: 18, fontWeight: "bold" },
  modalSearch: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    marginBottom: 12,
  },
  modalList: { maxHeight: 400 },
  modalItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
  },
  modalItemText: { fontSize: 16 },
  noResults: { textAlign: "center", marginTop: 20, fontSize: 16 },
  loaderContainer: {
    paddingVertical: 40,
    alignItems: "center",
  },
});
