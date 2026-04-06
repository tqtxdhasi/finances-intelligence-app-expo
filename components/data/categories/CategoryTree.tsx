// components/data/categories/CategoryTree.tsx
import { CategoryTreeNode } from "@/types/data";
import React from "react";
import { View } from "react-native";
import { CategoryListItem } from "./CategoryListItem";

interface CategoryTreeProps {
  categories: CategoryTreeNode[]; // Changed from Category[] to CategoryTreeNode[]
  expandedIds: Set<string>;
  onToggle: (id: string) => void;
  level?: number;
}

export const CategoryTree: React.FC<CategoryTreeProps> = ({
  categories,
  expandedIds,
  onToggle,
  level = 0,
}) => {
  return (
    <>
      {categories.map((category) => {
        const hasSubcategories = !!category.subcategories?.length;
        const isExpanded = expandedIds.has(category.id);
        return (
          <View key={category.id}>
            <CategoryListItem
              category={category}
              level={level}
              isExpanded={isExpanded}
              onToggle={onToggle}
              hasSubcategories={hasSubcategories}
            />
            {isExpanded && hasSubcategories && (
              <CategoryTree
                categories={category.subcategories} // Now this is properly typed as CategoryTreeNode[]
                expandedIds={expandedIds}
                onToggle={onToggle}
                level={level + 1}
              />
            )}
          </View>
        );
      })}
    </>
  );
};
