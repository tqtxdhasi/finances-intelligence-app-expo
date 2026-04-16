// components/add/ReceiptItemsSection.tsx
import { FormReceiptItem } from "@/app/(tabs)/add";
import { useTheme } from "@/utils/theme";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import ReceiptItemCard from "./ReceiptItemCard";

interface Props {
  receiptItems: FormReceiptItem[];
  onAddReceiptItem: () => void;
  onUpdateReceiptItem: (id: string, updates: Partial<FormReceiptItem>) => void;
  onRemoveReceiptItem: (id: string) => void;
  originalCurrency: string;
}

export default function ReceiptItemsSection({
  receiptItems,
  onAddReceiptItem,
  onUpdateReceiptItem,
  onRemoveReceiptItem,
  originalCurrency,
}: Props) {
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
          onPress={onAddReceiptItem}
        >
          <Ionicons name="add-circle" size={24} color={colors.accent} />
          <Text style={{ color: colors.accent, fontSize: 14 }}>Add Item</Text>
        </TouchableOpacity>
      </View>

      {receiptItems.map((receiptItem: FormReceiptItem) => (
        <ReceiptItemCard
          key={receiptItem.id}
          item={receiptItem}
          onUpdate={(updates) => onUpdateReceiptItem(receiptItem.id, updates)}
          onRemove={() => onRemoveReceiptItem(receiptItem.id)}
          currency={originalCurrency}
          isExpanded={expandedItemId === receiptItem.id}
          onToggleExpand={() => toggleExpand(receiptItem.id)}
        />
      ))}
    </View>
  );
}
