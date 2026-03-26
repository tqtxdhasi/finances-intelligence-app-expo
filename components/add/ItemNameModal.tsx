// components/add/ItemNameModal.tsx
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  FlatList,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ITEMS } from "./items-data";
import { useTheme } from "@/utils/theme";

interface Props {
  visible: boolean;
  selectedName: string;
  onSelect: (name: string) => void;
  onClose: () => void;
}
export default function ItemNameModal({
  visible,
  selectedName,
  onSelect,
  onClose,
}: Props) {
  const { colors } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [customName, setCustomName] = useState("");

  const filteredItems = ITEMS.filter((item) =>
    item.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleCustom = () => {
    if (customName.trim()) {
      onSelect(customName.trim());
      onClose();
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.5)",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            backgroundColor: colors.surface,
            borderRadius: 20,
            padding: 20,
            width: "90%",
            maxHeight: "80%",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <Text
              style={{ fontSize: 20, fontWeight: "bold", color: colors.text }}
            >
              Select Item
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <TextInput
            style={{
              backgroundColor: colors.surfaceLight,
              color: colors.text,
              borderRadius: 8,
              paddingHorizontal: 12,
              paddingVertical: 10,
              fontSize: 16,
              marginBottom: 16,
            }}
            placeholder="Search item..."
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />

          <FlatList
            data={filteredItems}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingVertical: 12,
                  paddingHorizontal: 8,
                  borderBottomWidth: 1,
                  borderBottomColor: colors.border,
                }}
                onPress={() => {
                  onSelect(item);
                  onClose();
                }}
              >
                <Text style={{ color: colors.text, fontSize: 16 }}>{item}</Text>
                {selectedName === item && (
                  <Ionicons name="checkmark" size={20} color={colors.accent} />
                )}
              </TouchableOpacity>
            )}
            style={{ maxHeight: 300 }}
          />

          <View
            style={{
              marginTop: 16,
              borderTopWidth: 1,
              borderTopColor: colors.border,
              paddingTop: 16,
            }}
          >
            <Text
              style={{
                color: colors.textSecondary,
                fontSize: 14,
                marginBottom: 8,
              }}
            >
              Or enter custom name:
            </Text>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            >
              <TextInput
                style={{
                  flex: 1,
                  backgroundColor: colors.surfaceLight,
                  color: colors.text,
                  borderRadius: 8,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  fontSize: 16,
                }}
                placeholder="Custom item name"
                placeholderTextColor={colors.textMuted}
                value={customName}
                onChangeText={setCustomName}
              />
              <TouchableOpacity
                style={{
                  backgroundColor: colors.accent,
                  paddingVertical: 10,
                  paddingHorizontal: 16,
                  borderRadius: 8,
                }}
                onPress={handleCustom}
              >
                <Text
                  style={{
                    color: colors.text,
                    fontSize: 14,
                    fontWeight: "bold",
                  }}
                >
                  Add
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}
