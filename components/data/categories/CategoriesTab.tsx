// components/CategoriesTab.tsx
import { useCategories } from "@/hooks/category/getAllCategories";
import { Category, CategoryTreeNode } from "@/types/data";
import { useTheme } from "@/utils/theme";
import React, { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { StatsBar } from "../StatsBar";
import { CategoryTree } from "./CategoryTree";

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
    isFetching,
    refetch, // Manual refetch function
  } = useCategories({
    sortBy: "name",
    sortOrder: "ASC",
  });

  // Pull-to-refresh handler
  const onRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

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

  // Loading state (only on initial load)
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={colors.accent} />
        <Text style={{ marginTop: 10, color: colors.textSecondary }}>
          Loading categories...
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
        <TouchableOpacity onPress={onRefresh}>Retry</TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <StatsBar stats={stats} />
      <ScrollView
        style={{ flex: 1 }}
        refreshControl={
          <RefreshControl
            refreshing={isFetching && !isLoading} // Don't show if it's initial load
            onRefresh={onRefresh}
            colors={[colors.accent]} // Android
            tintColor={colors.accent} // iOS
            title="Pull to refresh" // iOS
            titleColor={colors.textSecondary} // iOS
          />
        }
      >
        <CategoryTree
          categories={categoryTree}
          expandedIds={expandedCategories}
          onToggle={toggleCategory}
        />
      </ScrollView>
    </View>
  );
};
