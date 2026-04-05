// app/data-management.tsx (or wherever DataManagementScreen is used)
import { CategoriesTab } from "@/components/data/categories/CategoriesTab";
import { DataModal } from "@/components/data/DataModal";
import { LocationManagerModal } from "@/components/data/LocationManagerModal";
import { MerchantsTab } from "@/components/data/merchants/MerchantsTab";
import { ProductsTab } from "@/components/data/products/ProductsTab";
import { Category, Merchant, Product } from "@/types/data";
import { useTheme } from "@/utils/theme";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type ActiveTab = "merchants" | "categories" | "products";

export default function DataManagementScreen() {
  const { colors, styles: themeStyles } = useTheme();
  const [activeTab, setActiveTab] = useState<ActiveTab>("merchants");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTab, setSelectedTab] = useState<
    Merchant | Category | Product | null
  >(null);
  const [showLocationModal, setShowLocationModal] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    parentId: "",
    categoryId: "",
  });

  const handleAddNew = () => {
    if (activeTab === "merchants") {
      router.push("/merchant/create");
    } else if (activeTab === "categories") {
      router.push("/categories/create");
    } else if (activeTab === "products") {
      // Navigate to product creation screen
      router.push("/product/create");
    } else {
      setSelectedTab(null);
      setFormData({ name: "", parentId: "", categoryId: "", locations: [] });
      setShowAddModal(true);
    }
  };

  const handleEditProduct = (product: Product) => {
    // Navigate to edit screen with item ID
    router.push(`/product/edit/${product.id}`);
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      Alert.alert("Error", "Name is required");
      return;
    }

    if (selectedTab) {
      // Edit mode
      console.log("Edit:", selectedTab.id, formData);
      Alert.alert("Success", `${activeTab.slice(0, -1)} updated successfully`);
    } else {
      // Add mode
      console.log("Add new:", activeTab, formData);
      Alert.alert("Success", `${activeTab.slice(0, -1)} added successfully`);
    }

    setShowAddModal(false);
    setShowEditModal(false);
  };

  const handleOpenLocationManager = () => {
    setShowLocationModal(true);
  };

  // Handler when locations are saved from the manager
  const handleLocationsSave = (locations: Location[]) => {
    setFormData({ ...formData, locations });
    setShowLocationModal(false);
  };

  // Show create button for all tabs now
  const showCreateButton = true;

  return (
    <View style={[themeStyles.container, styles.container]}>
      <View style={styles.header}>
        <Text style={[themeStyles.title, styles.title]}>Data Management</Text>
        {showCreateButton && (
          <TouchableOpacity style={styles.createButton} onPress={handleAddNew}>
            <Ionicons name="add-circle" size={28} color={colors.accent} />
          </TouchableOpacity>
        )}
      </View>

      {/* Tabs */}
      <View style={[styles.tabs, { backgroundColor: colors.surface }]}>
        {(["merchants", "categories", "products"] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tab,
              activeTab === tab && [
                styles.tabActive,
                { backgroundColor: colors.surfaceLight },
              ],
            ]}
            onPress={() => setActiveTab(tab)}
          >
            <Ionicons
              name={
                tab === "merchants"
                  ? "storefront-outline"
                  : tab === "categories"
                    ? "folder-outline"
                    : "pricetag-outline"
              }
              size={20}
              color={activeTab === tab ? colors.accent : colors.textSecondary}
            />
            <Text
              style={[
                styles.tabText,
                { color: colors.textSecondary },
                activeTab === tab && [
                  styles.tabTextActive,
                  { color: colors.accent },
                ],
              ]}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Tab Content */}
      {activeTab === "merchants" && <MerchantsTab />}
      {activeTab === "categories" && <CategoriesTab />}
      {activeTab === "products" && (
        <ProductsTab onEditProduct={handleEditProduct} />
      )}

      <DataModal
        visible={showAddModal || showEditModal}
        mode={showAddModal ? "add" : "edit"}
        tab={activeTab}
        formData={formData}
        onClose={() => {
          setShowAddModal(false);
          setShowEditModal(false);
        }}
        onChange={setFormData}
        onSave={handleSave}
        onOpenLocationManager={handleOpenLocationManager}
      />
      <LocationManagerModal
        visible={showLocationModal}
        initialLocations={formData.locations || []}
        onSave={handleLocationsSave}
        onClose={() => setShowLocationModal(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
  },
  title: {
    fontSize: 28,
  },
  createButton: {
    padding: 4,
  },
  tabs: {
    flexDirection: "row",
    marginBottom: 16,
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    gap: 8,
    borderRadius: 8,
  },
  tabActive: {},
  tabText: {
    fontSize: 14,
  },
  tabTextActive: {
    fontWeight: "bold",
  },
});
