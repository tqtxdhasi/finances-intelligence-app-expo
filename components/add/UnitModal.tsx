// components/add/UnitModal.tsx
import { useTheme } from "@/utils/theme";
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

interface Props {
  visible: boolean;
  selectedUnit: string;
  onSelect: (unit: string) => void;
  onClose: () => void;
}

const UNITS = [
  { code: "pcs", label: "pieces" },
  { code: "kg", label: "kilograms" },
  { code: "g", label: "grams" },
  { code: "l", label: "liters" },
  { code: "ml", label: "milliliters" },
  { code: "pack", label: "pack" },
  { code: "box", label: "box" },
  { code: "dozen", label: "dozen" },
  { code: "bottle", label: "bottle" },
  { code: "pair", label: "pair" },
  { code: "set", label: "set" },
  { code: "roll", label: "roll" },
];
export default function UnitModal({
  visible,
  selectedUnit,
  onSelect,
  onClose,
}: Props) {
  const { colors } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUnits = UNITS.filter(
    (unit) =>
      unit.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      unit.label.toLowerCase().includes(searchQuery.toLowerCase()),
  );

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
              Select Unit
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
            placeholder="Search by code or name..."
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />

          <FlatList
            data={filteredUnits}
            keyExtractor={(item) => item.code}
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
                  onSelect(item.code);
                  onClose();
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      color: colors.text,
                      fontSize: 16,
                      fontWeight: "bold",
                    }}
                  >
                    {item.code}
                  </Text>
                  <Text
                    style={{
                      color: colors.textSecondary,
                      fontSize: 12,
                      marginTop: 2,
                    }}
                  >
                    {item.label}
                  </Text>
                </View>
                {selectedUnit === item.code && (
                  <Ionicons name="checkmark" size={20} color={colors.accent} />
                )}
              </TouchableOpacity>
            )}
            style={{ maxHeight: 300 }}
          />
        </View>
      </View>
    </Modal>
  );
}
