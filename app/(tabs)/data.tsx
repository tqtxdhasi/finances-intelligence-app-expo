import { CategoriesTab } from "@/components/data/CategoriesTab";
import { DataModal } from "@/components/data/DataModal";
import { ItemsTab } from "@/components/data/ItemsTab";
import { LocationManagerModal } from "@/components/data/LocationManagerModal";
import { MerchantsTab } from "@/components/data/MerchantsTab";
import { Category, FormData, Item, Merchant } from "@/types/data";
import { useTheme } from "@/utils/theme";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type ActiveTab = "merchants" | "categories" | "items";

export default function DataManagementScreen() {
  const { colors, styles: themeStyles } = useTheme();
  const [activeTab, setActiveTab] = useState<ActiveTab>("merchants");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<
    Merchant | Category | Item | null
  >(null);
  const [showLocationModal, setShowLocationModal] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    parentId: "",
    categoryId: "",
  });

  const handleAddNew = () => {
    setSelectedItem(null);
    setFormData({ name: "", parentId: "", categoryId: "", locations: [] });
    setShowAddModal(true);
  };

  const handleEditMerchant = (merchant: Merchant) => {
    setSelectedItem(merchant);
    setFormData({
      name: merchant.name,
      parentId: "",
      categoryId: "",
      locations: merchant.locations.map((loc) => ({ ...loc })),
    });
    setShowEditModal(true);
  };

  const handleDeleteMerchant = (merchant: Merchant) => {
    Alert.alert(
      "Delete Merchant",
      `Are you sure you want to delete "${merchant.name}"? This will affect ${merchant.receiptCount} receipts.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            console.log("Delete merchant:", merchant.id);
            Alert.alert("Success", "Merchant deleted");
          },
        },
      ],
    );
  };

  const handleEditCategory = (category: Category) => {
    setSelectedItem(category);
    setFormData({
      name: category.name,
      parentId: category.parentId || "",
      categoryId: "",
    });
    setShowEditModal(true);
  };

  const handleDeleteCategory = (category: Category) => {
    Alert.alert(
      "Delete Category",
      `Are you sure you want to delete "${category.name}"? This may affect items and receipts.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            console.log("Delete category:", category.id);
            Alert.alert("Success", "Category deleted");
          },
        },
      ],
    );
  };

  const handleEditItem = (item: Item) => {
    setSelectedItem(item);
    setFormData({
      name: item.name,
      parentId: "",
      categoryId: item.category || "",
    });
    setShowEditModal(true);
  };

  const handleDeleteItem = (item: Item) => {
    Alert.alert(
      "Delete Item",
      `Are you sure you want to delete "${item.name}"? This will affect ${item.occurrenceCount} receipts.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            console.log("Delete item:", item.id);
            Alert.alert("Success", "Item deleted");
          },
        },
      ],
    );
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      Alert.alert("Error", "Name is required");
      return;
    }

    if (selectedItem) {
      // Edit mode
      console.log("Edit:", selectedItem.id, formData);
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
  return (
    <View style={[themeStyles.container, styles.container]}>
      <View style={styles.header}>
        <Text style={[themeStyles.title, styles.title]}>Data Management</Text>
        {/* <TouchableOpacity style={styles.addButton} onPress={handleAddNew}>
          <Ionicons name="add-circle" size={28} color={colors.accent} />
        </TouchableOpacity> */}
      </View>

      {/* Tabs */}
      <View style={[styles.tabs, { backgroundColor: colors.surface }]}>
        {(["merchants", "categories", "items"] as const).map((tab) => (
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
      {activeTab === "merchants" && (
        <MerchantsTab
          onEditMerchant={handleEditMerchant}
          onDeleteMerchant={handleDeleteMerchant}
        />
      )}
      {activeTab === "categories" && (
        <CategoriesTab
          onEditCategory={handleEditCategory}
          onDeleteCategory={handleDeleteCategory}
        />
      )}
      {activeTab === "items" && (
        <ItemsTab onEditItem={handleEditItem} onDeleteItem={handleDeleteItem} />
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
  addButton: {
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
