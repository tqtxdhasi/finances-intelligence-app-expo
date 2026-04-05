import { getAllCategories } from "@/hooks/category/getAllCategories";
import { Category } from "@/types/data";
import { useTheme } from "@/utils/theme";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { CategoryTree } from "./CategoryTree";
import { StatsBar } from "../StatsBar";

export const CategoriesTab = () => {
  const { colors } = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(),
  );

  // Build tree from flat categories (parentId -> children)
  const buildCategoryTree = (flatCategories: Category[]): Category[] => {
    const categoryMap = new Map<string, Category>();
    const roots: Category[] = [];

    // First, create map with empty subcategories
    flatCategories.forEach((cat) => {
      categoryMap.set(cat.id, { ...cat, subcategories: [] });
    });

    // Then assign children to parents
    flatCategories.forEach((cat) => {
      const node = categoryMap.get(cat.id);
      if (node) {
        if (cat.parent_id && categoryMap.has(cat.parent_id)) {
          const parent = categoryMap.get(cat.parent_id);
          if (parent && parent.subcategories) {
            parent.subcategories.push(node);
          }
        } else {
          roots.push(node);
        }
      }
    });

    return roots;
  };

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllCategories({ sortBy: "name", sortOrder: "ASC" });
      setCategories(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load categories",
      );
      console.error("Error loading categories:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const toggleCategory = (id: string) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  const totalCategories = categories.length;
  const mainCategories = categories.filter((c) => !c.parent_id).length;

  const stats = [
    { label: "Total Categories", value: totalCategories },
    { label: "Main Categories", value: mainCategories },
  ];

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: colors.error || "red", textAlign: "center" }}>
          Error: {error}
        </Text>
      </View>
    );
  }

  const categoryTree = buildCategoryTree(categories);

  return (
    <View style={{ flex: 1 }}>
      <StatsBar stats={stats} />
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
