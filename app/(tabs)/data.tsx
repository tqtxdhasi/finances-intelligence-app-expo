// app/data-management.tsx (or wherever DataManagementScreen is used)
import { CategoriesTab } from "@/components/data/categories/CategoriesTab";
import { MerchantsTab } from "@/components/data/merchants/MerchantsTab";
import { ProductsTab } from "@/components/data/products/ProductsTab";
import { useTheme } from "@/utils/theme";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type ActiveTab = "merchants" | "categories" | "products";

export default function DataManagementScreen() {
  const { colors, styles: themeStyles } = useTheme();
  const [activeTab, setActiveTab] = useState<ActiveTab>("merchants");

  const handleAddNew = () => {
    if (activeTab === "merchants") {
      router.push("/merchant/create");
    } else if (activeTab === "categories") {
      router.push("/categories/create");
    } else if (activeTab === "products") {
      router.push("/product/create");
    }
  };

  const getIconName = (tab: ActiveTab) => {
    const isActive = activeTab === tab;
    if (tab === "merchants") {
      return isActive ? "storefront" : "storefront-outline";
    } else if (tab === "categories") {
      return isActive ? "folder-open" : "folder-outline";
    } else {
      return isActive ? "cube" : "cube-outline";
    }
  };

  return (
    <View style={[themeStyles.container, styles.container]}>
      <View style={styles.header}>
        <Text style={[themeStyles.title, styles.title]}>Data Management</Text>
        <TouchableOpacity style={styles.createButton} onPress={handleAddNew}>
          <Ionicons name="add-circle" size={28} color={colors.accent} />
        </TouchableOpacity>
      </View>

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
              name={getIconName(tab)}
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

      {activeTab === "merchants" && <MerchantsTab />}
      {activeTab === "categories" && <CategoriesTab />}
      {activeTab === "products" && <ProductsTab />}
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
