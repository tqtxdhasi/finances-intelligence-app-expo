import React from "react";
import { View } from "react-native";
import { CategoryListItem } from "./CategoryListItem";
import { Category } from "@/types/data";

interface CategoryTreeProps {
  categories: Category[];
  expandedIds: Set<string>;
  onToggle: (id: string) => void;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
  level?: number;
}

export const CategoryTree: React.FC<CategoryTreeProps> = ({
  categories,
  expandedIds,
  onToggle,
  onEdit,
  onDelete,
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
              onEdit={onEdit}
              onDelete={onDelete}
              hasSubcategories={hasSubcategories}
            />
            {isExpanded && hasSubcategories && (
              <CategoryTree
                categories={category.subcategories as Category[]}
                expandedIds={expandedIds}
                onToggle={onToggle}
                onEdit={onEdit}
                onDelete={onDelete}
                level={level + 1}
              />
            )}
          </View>
        );
      })}
    </>
  );
};
