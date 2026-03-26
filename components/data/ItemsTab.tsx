import { dummyItems } from "@/data/dummyData";
import { Item } from "@/types/data";
import React from "react";
import { FlatList, View } from "react-native";
import { ItemsListItem } from "./ItemsListItem";
import { StatsBar } from "./StatsBar";

interface ItemsTabProps {
  onEditItem: (item: Item) => void;
  onDeleteItem: (item: Item) => void;
}

export const ItemsTab: React.FC<ItemsTabProps> = ({
  onEditItem,
  onDeleteItem,
}) => {
  const totalPurchases = dummyItems.reduce(
    (sum, i) => sum + i.occurrenceCount,
    0,
  );
  const totalSpent = dummyItems
    .reduce((sum, i) => sum + i.totalSpent, 0)
    .toFixed(0);

  const stats = [
    { label: "Unique Items", value: dummyItems.length },
    { label: "Total Purchases", value: totalPurchases },
    { label: "Total Spent", value: `$${totalSpent}` },
  ];

  return (
    <View style={{ flex: 1 }}>
      <StatsBar stats={stats} />
      <FlatList
        data={dummyItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ItemsListItem
            item={item}
            onEdit={onEditItem}
            onDelete={onDeleteItem}
          />
        )}
      />
    </View>
  );
};
