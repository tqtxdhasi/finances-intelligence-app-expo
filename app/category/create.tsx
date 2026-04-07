import { createCategory } from "@/hooks/category/createCategory";
import { getAllCategories } from "@/hooks/category/getAllCategories";
import { useTheme } from "@/utils/theme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function CreateCategoryScreen() {
  const router = useRouter();
  const { colors, styles: themeStyles } = useTheme();
  const [name, setName] = useState("");
  const [parentId, setParentId] = useState<string | null>(null);
  const [categories, setCategories] = useState<
    Array<{ id: string; name: string }>
  >([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setFetching(true);
      const data = await getAllCategories();
      setCategories(data);
    } catch (error) {
      Alert.alert("Error", "Failed to load categories");
    } finally {
      setFetching(false);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert("Error", "Category name is required");
      return;
    }

    setLoading(true);
    try {
      await createCategory({
        name: name.trim(),
        parentId: parentId || undefined,
      });
      Alert.alert("Success", "Category created successfully", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to create category");
    } finally {
      setLoading(false);
    }
  };

  const selectedParent = categories.find((c) => c.id === parentId);

  return (
    <View style={[themeStyles.container, styles.container]}>
      {/* Header with back button */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[themeStyles.title, styles.title]}>Create Category</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Form */}
      <View style={styles.form}>
        <Text style={[styles.label, { color: colors.text }]}>Name *</Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors.surfaceLight,
              color: colors.text,
            },
          ]}
          placeholder="Enter category name"
          placeholderTextColor={colors.textMuted}
          value={name}
          onChangeText={setName}
        />

        <Text style={[styles.label, { color: colors.text }]}>
          Parent Category
        </Text>
        <TouchableOpacity
          style={[
            styles.selectButton,
            {
              backgroundColor: colors.surfaceLight,
              borderColor: colors.border,
            },
          ]}
          onPress={() => setModalVisible(true)}
          disabled={fetching}
        >
          <Text
            style={[
              styles.selectButtonText,
              { color: selectedParent ? colors.text : colors.textMuted },
            ]}
          >
            {selectedParent ? selectedParent.name : "None"}
          </Text>
          <Ionicons
            name="chevron-down"
            size={20}
            color={colors.textSecondary}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: colors.accent }]}
          onPress={handleSave}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.text} />
          ) : (
            <Text style={[styles.saveButtonText, { color: colors.text }]}>
              Save
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Modal for selecting parent category */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[styles.modalContainer, { backgroundColor: colors.surface }]}
          >
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                Select Parent Category
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <FlatList
              data={categories}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.modalItem,
                    parentId === item.id && {
                      backgroundColor: colors.surfaceLight,
                    },
                  ]}
                  onPress={() => {
                    setParentId(item.id);
                    setModalVisible(false);
                  }}
                >
                  <Text style={[styles.modalItemText, { color: colors.text }]}>
                    {item.name}
                  </Text>
                  {parentId === item.id && (
                    <Ionicons
                      name="checkmark"
                      size={20}
                      color={colors.accent}
                    />
                  )}
                </TouchableOpacity>
              )}
              ListHeaderComponent={
                <TouchableOpacity
                  style={[
                    styles.modalItem,
                    parentId === null && {
                      backgroundColor: colors.surfaceLight,
                    },
                  ]}
                  onPress={() => {
                    setParentId(null);
                    setModalVisible(false);
                  }}
                >
                  <Text style={[styles.modalItemText, { color: colors.text }]}>
                    None
                  </Text>
                  {parentId === null && (
                    <Ionicons
                      name="checkmark"
                      size={20}
                      color={colors.accent}
                    />
                  )}
                </TouchableOpacity>
              }
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  form: {
    marginTop: 24,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: "500",
  },
  input: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 20,
  },
  selectButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    marginBottom: 20,
  },
  selectButtonText: {
    fontSize: 16,
  },
  saveButton: {
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 12,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  modalItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  modalItemText: {
    fontSize: 16,
  },
});
