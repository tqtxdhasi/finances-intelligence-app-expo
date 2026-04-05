// components/CategoriesTab.tsx
import { Category, CategoryTreeNode } from "@/types/data";
import { useTheme } from "@/utils/theme";
import React, { useMemo, useState } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { StatsBar } from "../StatsBar";
import { CategoryTree } from "./CategoryTree";
import { useCategories } from "@/hooks/category/getAllCategories";

export const CategoriesTab = () => {
  const { colors } = useTheme();
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(),
  );

  // Use React Query hook
  const {
    data: categories = [],
    isLoading,
    error,
    isFetching, // Optional: shows when background refetching
    refetch, // Manual refetch if needed
  } = useCategories({
    sortBy: "name",
    sortOrder: "ASC",
  });

  // Build category tree (memoized)
  const buildCategoryTree = (
    flatCategories: Category[],
  ): CategoryTreeNode[] => {
    const map = new Map<string, CategoryTreeNode>();
    const roots: CategoryTreeNode[] = [];

    flatCategories.forEach((cat) => {
      map.set(cat.id, { ...cat, subcategories: [] });
    });

    flatCategories.forEach((cat) => {
      const node = map.get(cat.id)!;
      if (cat.parent_id && map.has(cat.parent_id)) {
        map.get(cat.parent_id)!.subcategories.push(node);
      } else {
        roots.push(node);
      }
    });

    return roots;
  };

  const categoryTree = useMemo(
    () => buildCategoryTree(categories),
    [categories],
  );

  const toggleCategory = (id: string) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  // Derived stats
  const totalCategories = categories.length;
  const mainCategories = categories.filter((c) => !c.parent_id).length;
  const stats = [
    { label: "Total Categories", value: totalCategories },
    { label: "Main Categories", value: mainCategories },
  ];

  // Loading state
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={colors.accent} />
        <Text style={{ marginTop: 10, color: colors.textSecondary }}>
          Loading{" "}
          {totalCategories > 0 ? `${totalCategories} categories` : "categories"}
          ...
        </Text>
      </View>
    );
  }

  // Error state
  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text
          style={{
            color: colors.error || "red",
            textAlign: "center",
            marginBottom: 10,
          }}
        >
          Error: {error.message}
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <StatsBar stats={stats} />
      {isFetching && (
        <View
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            zIndex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            borderRadius: 4,
            padding: 4,
            margin: 8,
          }}
        >
          <ActivityIndicator size="small" color={colors.accent} />
        </View>
      )}
      <ScrollView style={{ flex: 1 }}>
        <CategoryTree
          categories={categoryTree}
          expandedIds={expandedCategories}
          onToggle={toggleCategory}
        />
      </ScrollView>
    </View>
  );
};
