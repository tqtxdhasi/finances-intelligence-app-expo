// components/add/ReceiptItemCard.tsx
import { Item } from "@/types/receipt";
import { useTheme } from "@/utils/theme";
import { Ionicons } from "@expo/vector-icons";
import React, { useLayoutEffect, useState } from "react";
import {
  LayoutAnimation,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import ItemNameModal from "../add/ReceiptItemNameModal";
import UnitModal from "../add/UnitModal";

interface Props {
  item: Item;
  onUpdate: (updates: Partial<Item>) => void;
  onRemove: () => void;
  currency: string;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

export default function ReceiptItemCard({
  item,
  onUpdate,
  onRemove,
  currency,
  isExpanded,
  onToggleExpand,
}: Props) {
  const { colors, styles: themeStyles } = useTheme();
  const [unitModalVisible, setUnitModalVisible] = useState(false);
  const [itemNameModalVisible, setItemNameModalVisible] = useState(false);
  const [localExpanded, setLocalExpanded] = useState(isExpanded);

  useLayoutEffect(() => {
    if (isExpanded !== localExpanded) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setLocalExpanded(isExpanded);
    }
  }, [isExpanded]);

  const sanitizePrice = (text: string) => {
    // Allow empty string
    if (text === "") return "";

    // Replace comma with dot (optional, if user uses comma as decimal)
    let cleaned = text.replace(/,/g, ".");

    // Allow only digits and a single dot
    cleaned = cleaned.replace(/[^0-9.]/g, "");

    // Ensure only one dot
    const dotIndex = cleaned.indexOf(".");
    if (dotIndex !== -1) {
      const beforeDot = cleaned.slice(0, dotIndex + 1);
      const afterDot = cleaned.slice(dotIndex + 1).replace(/\./g, "");
      cleaned = beforeDot + afterDot;
    }

    // Limit to two decimal places (optional)
    const parts = cleaned.split(".");
    if (parts.length === 2 && parts[1].length > 2) {
      cleaned = parts[0] + "." + parts[1].slice(0, 2);
    }
    return cleaned;
  };

  const handleToggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    onToggleExpand();
  };

  const handleSelectUnit = (unit: string) => {
    onUpdate({ unit });
  };

  const handleSelectName = (name: string) => {
    onUpdate({ name });
  };

  return (
    <View
      style={{
        backgroundColor: colors.surfaceLight,
        borderRadius: 8,
        marginBottom: 8,
        overflow: "hidden",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 12,
        }}
      >
        <TouchableOpacity
          style={{ flex: 1, flexDirection: "row" }}
          onPress={handleToggle}
        >
          <View style={{ flexDirection: "column", gap: 4 }}>
            <Text
              style={{ fontSize: 16, fontWeight: "bold", color: colors.text }}
            >
              {item.name || "Unnamed Item"}
            </Text>
            <Text style={{ color: colors.textSecondary, fontSize: 14 }}>
              {item.quantity} {item.unit}
            </Text>
            <Text
              style={{ color: colors.accent, fontSize: 14, fontWeight: "bold" }}
            >
              {currency} {parseFloat(item.price || "0").toFixed(2)}
            </Text>
          </View>
        </TouchableOpacity>
        <View style={{ flexDirection: "row", gap: 18, alignItems: "center" }}>
          <TouchableOpacity onPress={onRemove}>
            <Ionicons name="trash-outline" size={24} color={colors.error} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleToggle}>
            <Ionicons
              name={localExpanded ? "chevron-up" : "chevron-down"}
              size={20}
              color={colors.text}
            />
          </TouchableOpacity>
        </View>
      </View>

      {localExpanded && (
        <View
          style={{
            padding: 12,
            borderTopWidth: 1,
            borderTopColor: colors.border,
          }}
        >
          <Text
            style={{
              fontSize: 14,
              color: colors.textSecondary,
              marginBottom: 8,
              marginTop: 12,
            }}
          >
            Item Name *
          </Text>
          <TouchableOpacity
            style={{
              backgroundColor: colors.surface,
              borderRadius: 8,
              paddingHorizontal: 12,
              paddingVertical: 10,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
            onPress={() => setItemNameModalVisible(true)}
          >
            <Text style={{ color: colors.text, fontSize: 16 }}>
              {item.name || "Select or enter item name"}
            </Text>
            <Ionicons
              name="chevron-down"
              size={20}
              color={colors.textSecondary}
            />
          </TouchableOpacity>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              gap: 12,
            }}
          >
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 14,
                  color: colors.textSecondary,
                  marginBottom: 8,
                  marginTop: 12,
                }}
              >
                Quantity
              </Text>
              <TextInput
                style={{
                  backgroundColor: colors.surface,
                  color: colors.text,
                  borderRadius: 8,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  fontSize: 16,
                }}
                placeholder="1"
                placeholderTextColor={colors.textMuted}
                keyboardType="numeric"
                value={item.quantity}
                onChangeText={(text) => onUpdate({ quantity: text })}
              />
            </View>

            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 14,
                  color: colors.textSecondary,
                  marginBottom: 8,
                  marginTop: 12,
                }}
              >
                Unit
              </Text>
              <TouchableOpacity
                style={{
                  backgroundColor: colors.surface,
                  borderRadius: 8,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
                onPress={() => setUnitModalVisible(true)}
              >
                <Text style={{ color: colors.text, fontSize: 16 }}>
                  {item.unit}
                </Text>
                <Ionicons
                  name="chevron-down"
                  size={20}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
            </View>
          </View>

          <Text
            style={{
              fontSize: 14,
              color: colors.textSecondary,
              marginBottom: 8,
              marginTop: 12,
            }}
          >
            Price *
          </Text>
          <TextInput
            style={{
              backgroundColor: colors.surface,
              color: colors.text,
              borderRadius: 8,
              paddingHorizontal: 12,
              paddingVertical: 10,
              fontSize: 16,
            }}
            placeholder="0.00"
            placeholderTextColor={colors.textMuted}
            keyboardType="decimal-pad"
            value={item.price}
            onChangeText={(text) => onUpdate({ price: sanitizePrice(text) })}
            returnKeyType="done"
          />
        </View>
      )}

      <UnitModal
        visible={unitModalVisible}
        selectedUnit={item.unit}
        onSelect={handleSelectUnit}
        onClose={() => setUnitModalVisible(false)}
      />

      <ItemNameModal
        visible={itemNameModalVisible}
        selectedName={item.name}
        onSelect={handleSelectName}
        onClose={() => setItemNameModalVisible(false)}
      />
    </View>
  );
}
