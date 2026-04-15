// components/add/ItemNameModal.tsx
import { useGetAllProducts } from "@/hooks/product/getAllProducts";
import { useTheme } from "@/utils/theme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface Props {
  visible: boolean;
  selectedName: string;
  onSelect: (name: string) => void;
  onClose: () => void;
}

export default function ItemNameModal({
  visible,
  selectedName,
  onSelect,
  onClose,
}: Props) {
  const { colors } = useTheme();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch all products from the database
  const { data: products, isLoading, error } = useGetAllProducts();

  // Filter products based on search query (by product name)
  const filteredProducts = products
    ? products.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : [];

  const handleAddNewProduct = () => {
    onClose(); // Close the modal
    router.push("/(tabs)/data"); // Navigate to data tab to add a new product
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.5)",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            backgroundColor: colors.surface,
            borderRadius: 20,
            padding: 20,
            width: "90%",
            maxHeight: "80%",
          }}
        >
          {/* Header */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <Text
              style={{ fontSize: 20, fontWeight: "bold", color: colors.text }}
            >
              Select Item
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          {/* Search Input */}
          <TextInput
            style={{
              backgroundColor: colors.surfaceLight,
              color: colors.text,
              borderRadius: 8,
              paddingHorizontal: 12,
              paddingVertical: 10,
              fontSize: 16,
              marginBottom: 16,
            }}
            placeholder="Search product..."
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />

          {/* Loading / Error / Product List */}
          {isLoading ? (
            <View style={{ padding: 20, alignItems: "center" }}>
              <ActivityIndicator size="large" color={colors.accent} />
              <Text style={{ color: colors.textSecondary, marginTop: 8 }}>
                Loading products...
              </Text>
            </View>
          ) : error ? (
            <View style={{ padding: 20, alignItems: "center" }}>
              <Ionicons
                name="alert-circle-outline"
                size={32}
                color={colors.error}
              />
              <Text
                style={{
                  color: colors.error,
                  marginTop: 8,
                  textAlign: "center",
                }}
              >
                Failed to load products. Please try again.
              </Text>
            </View>
          ) : (
            <FlatList
              data={filteredProducts}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingVertical: 12,
                    paddingHorizontal: 8,
                    borderBottomWidth: 1,
                    borderBottomColor: colors.border,
                  }}
                  onPress={() => {
                    onSelect(item.name);
                    onClose();
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: colors.text, fontSize: 16 }}>
                      {item.name}
                    </Text>
                    {item.category && (
                      <Text
                        style={{
                          color: colors.textMuted,
                          fontSize: 12,
                          marginTop: 2,
                        }}
                      >
                        {item.category}
                      </Text>
                    )}
                  </View>
                  {selectedName === item.name && (
                    <Ionicons
                      name="checkmark"
                      size={20}
                      color={colors.accent}
                    />
                  )}
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <Text
                  style={{
                    textAlign: "center",
                    color: colors.textMuted,
                    padding: 20,
                  }}
                >
                  No products found.
                </Text>
              }
              style={{ maxHeight: 300 }}
            />
          )}

          {/* Button to add new product */}
          <View
            style={{
              marginTop: 16,
              borderTopWidth: 1,
              borderTopColor: colors.border,
              paddingTop: 16,
            }}
          >
            <TouchableOpacity
              style={{
                backgroundColor: colors.accent,
                paddingVertical: 12,
                borderRadius: 8,
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "center",
                gap: 8,
              }}
              onPress={handleAddNewProduct}
            >
              <Ionicons
                name="add-circle-outline"
                size={20}
                color={colors.text}
              />
              <Text
                style={{
                  color: colors.text,
                  fontSize: 16,
                  fontWeight: "bold",
                }}
              >
                Add New Product
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
