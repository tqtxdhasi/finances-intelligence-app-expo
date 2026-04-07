import { Item } from "@/types/receipt";
import { useTheme } from "@/utils/theme";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import ReceiptItemCard from "./ReceiptItemCard";

interface Props {
  items: Item[];
  onAddItem: () => void;
  onUpdateItem: (id: string, updates: Partial<Item>) => void;
  onRemoveItem: (id: string) => void;
  originalCurrency: string;
}

export const ReceiptItemsSection: React.FC<Props> = ({
  items,
  onAddItem,
  onUpdateItem,
  onRemoveItem,
  originalCurrency,
}) => {
  const { colors, styles: themeStyles } = useTheme();
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedItemId(expandedItemId === id ? null : id);
  };

  return (
    <View
      style={{
        backgroundColor: colors.surface,
        borderRadius: 12,
        padding: 16,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: colors.border,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <Text style={[themeStyles.title, { fontSize: 18 }]}>Items *</Text>
        <TouchableOpacity
          style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
          onPress={onAddItem}
        >
          <Ionicons name="add-circle" size={24} color={colors.accent} />
          <Text style={{ color: colors.accent, fontSize: 14 }}>Add Item</Text>
        </TouchableOpacity>
      </View>

      {items.map((item) => (
        <ReceiptItemCard
          key={item.id}
          item={item}
          onUpdate={(updates) => onUpdateItem(item.id, updates)}
          onRemove={() => onRemoveItem(item.id)}
          currency={originalCurrency}
          isExpanded={expandedItemId === item.id}
          onToggleExpand={() => toggleExpand(item.id)}
        />
      ))}
    </View>
  );
};
