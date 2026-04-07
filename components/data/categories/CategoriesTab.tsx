// components/CategoriesTab.tsx
import { useCategories } from "@/hooks/category/getAllCategories";
import { Category, CategoryTreeNode } from "@/types/data";
import { useTheme } from "@/utils/theme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { EmptyState } from "../EmptyState";
import { LoadingSkeleton } from "../LoadingSkeleton";
import { StatsBar } from "../StatsBar";
import { CategoryTree } from "./CategoryTree";

export const CategoriesTab = () => {
  const { colors } = useTheme();
  const router = useRouter();
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(),
  );

  const {
    data: categories = [],
    isLoading,
    error,
    isFetching,
    refetch,
  } = useCategories({
    sortBy: "name",
    sortOrder: "ASC",
  });

  const onRefresh = useCallback(() => refetch(), [refetch]);
  const handleAddCategory = useCallback(() => {
    router.push("/category/create");
  }, [router]);

  // Build category tree
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

  // Stats
  const totalCategories = categories.length;
  const mainCategories = categories.filter((c) => !c.parent_id).length;
  const stats = [
    { label: "Total Categories", value: totalCategories },
    { label: "Main Categories", value: mainCategories },
  ];

  // Loading state (initial load)
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.accent} />
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
          Loading categories...
        </Text>
        <LoadingSkeleton count={3} />
      </View>
    );
  }

  // Error state
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={60} color={colors.error} />
        <Text style={[styles.errorText, { color: colors.text }]}>
          {error.message || "Failed to load categories. Please try again."}
        </Text>
        <TouchableOpacity
          style={[styles.retryButton, { backgroundColor: colors.accent }]}
          onPress={onRefresh}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <StatsBar stats={stats} />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[
          styles.scrollContent,
          categories.length === 0 && { flex: 1 },
        ]}
        refreshControl={
          <RefreshControl
            refreshing={isFetching && !isLoading}
            onRefresh={onRefresh}
            colors={[colors.accent]}
            tintColor={colors.accent}
            title="Pull to refresh"
            titleColor={colors.textSecondary}
          />
        }
      >
        {categories.length === 0 ? (
          <EmptyState
            icon="folder-outline"
            title="No Categories Yet"
            subtitle="Organize your products by creating categories."
            buttonText="+ Add New Category"
            onPress={handleAddCategory}
          />
        ) : (
          <CategoryTree
            categories={categoryTree}
            expandedIds={expandedCategories}
            onToggle={toggleCategory}
          />
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    paddingTop: 20,
  },
  loadingText: {
    textAlign: "center",
    marginVertical: 12,
    fontSize: 14,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  errorText: {
    fontSize: 16,
    textAlign: "center",
    marginVertical: 16,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
});
