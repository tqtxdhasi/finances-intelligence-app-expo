// IndustryTypeModal.tsx
import { useTheme } from "@/utils/theme";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface IndustryTypeModalProps {
  visible: boolean;
  selectedIndustry: string;
  industries: Array<{ label: string; value: string }>;
  onSelectIndustry: (value: string) => void;
  onClose: () => void;
}

export default function IndustryTypeModal({
  visible,
  selectedIndustry,
  industries,
  onSelectIndustry,
  onClose,
}: IndustryTypeModalProps) {
  const { colors } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");

  // Reset search when modal opens/closes
  useEffect(() => {
    if (!visible) {
      setSearchQuery("");
    }
  }, [visible]);

  const filteredIndustries =
    searchQuery.trim() === ""
      ? industries
      : industries.filter(
          (item) =>
            item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.value.toLowerCase().includes(searchQuery.toLowerCase()),
        );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[styles.modalContainer, { backgroundColor: colors.surface }]}
          >
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                Select Industry
              </Text>
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <TextInput
              style={[
                styles.modalSearch,
                { backgroundColor: colors.surfaceLight, color: colors.text },
              ]}
              placeholder="Search by name..."
              placeholderTextColor={colors.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
            />

            {filteredIndustries.length === 0 ? (
              <Text style={[styles.noResults, { color: colors.textMuted }]}>
                No matching industries
              </Text>
            ) : (
              <FlatList
                data={filteredIndustries}
                keyExtractor={(item) => item.value}
                keyboardShouldPersistTaps="handled"
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.modalItem,
                      { borderBottomColor: colors.border },
                      selectedIndustry === item.value && {
                        backgroundColor: colors.accent + "20",
                      },
                    ]}
                    onPress={() => onSelectIndustry(item.value)}
                  >
                    <Text
                      style={[styles.modalItemText, { color: colors.text }]}
                    >
                      {item.label}
                    </Text>
                    {selectedIndustry === item.value && (
                      <Ionicons
                        name="checkmark"
                        size={20}
                        color={colors.accent}
                      />
                    )}
                  </TouchableOpacity>
                )}
                style={styles.modalList}
                contentContainerStyle={{ paddingBottom: 20 }}
              />
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: { fontSize: 18, fontWeight: "bold" },
  modalSearch: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    marginBottom: 12,
  },
  modalList: { maxHeight: 400 },
  modalItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
  },
  modalItemText: { fontSize: 16 },
  noResults: { textAlign: "center", marginTop: 20, fontSize: 16 },
});
