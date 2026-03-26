import { dummyCategories } from "@/data/dummyData";
import { Category } from "@/types/data";
import { useTheme } from "@/utils/theme";
import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import { CategoryTree } from "./CategoryTree";
import { StatsBar } from "./StatsBar";

interface CategoriesTabProps {
  onEditCategory: (category: Category) => void;
  onDeleteCategory: (category: Category) => void;
}

export const CategoriesTab: React.FC<CategoriesTabProps> = ({
  onEditCategory,
  onDeleteCategory,
}) => {
  const { colors } = useTheme();
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(),
  );

  const toggleCategory = (id: string) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  const totalCategories =
    dummyCategories.length +
    dummyCategories.reduce((sum, c) => sum + (c.subcategories?.length || 0), 0);

  const stats = [
    { label: "Total Categories", value: totalCategories },
    { label: "Main Categories", value: dummyCategories.length },
  ];

  return (
    <View style={{ flex: 1 }}>
      <StatsBar stats={stats} />
      <ScrollView style={{ flex: 1 }}>
        <CategoryTree
          categories={dummyCategories}
          expandedIds={expandedCategories}
          onToggle={toggleCategory}
          onEdit={onEditCategory}
          onDelete={onDeleteCategory}
        />
      </ScrollView>
    </View>
  );
};
