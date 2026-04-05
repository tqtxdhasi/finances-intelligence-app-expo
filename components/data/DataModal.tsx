import { FormData } from "@/types/data";
import { useTheme } from "@/utils/theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface DataModalProps {
  visible: boolean;
  mode: "add" | "edit";
  tab: "merchants" | "categories" | "items";
  formData: FormData;
  onClose: () => void;
  onChange: (data: FormData) => void;
  onSave: () => void;
  onOpenLocationManager: () => void;
}

export const DataModal: React.FC<DataModalProps> = ({
  visible,
  mode,
  tab,
  formData,
  onClose,
  onChange,
  onSave,
  onOpenLocationManager,
}) => {
  const { colors } = useTheme();
  const title =
    mode === "add" ? `Add New ${tab.slice(0, -1)}` : `Edit ${tab.slice(0, -1)}`;

  const isMerchant = tab === "merchants";

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View
          style={[styles.modalContainer, { backgroundColor: colors.surface }]}
        >
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              {title}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView>
            {/* Name field (always shown) */}
            <Text style={[styles.inputLabel, { color: colors.text }]}>
              Name *
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.surfaceLight,
                  color: colors.text,
                },
              ]}
              placeholder={`Enter ${tab.slice(0, -1)} name`}
              placeholderTextColor={colors.textMuted}
              value={formData.name}
              onChangeText={(text) => onChange({ ...formData, name: text })}
            />

            {/* Address field (merchants only) */}
            {isMerchant && (
              <>
                <Text style={[styles.inputLabel, { color: colors.text }]}>
                  Address
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: colors.surfaceLight,
                      color: colors.text,
                    },
                  ]}
                  placeholder="Enter merchant address"
                  placeholderTextColor={colors.textMuted}
                  value={formData.address || ""}
                  onChangeText={(text) =>
                    onChange({ ...formData, address: text })
                  }
                  multiline
                />
              </>
            )}

            {/* Locations button (keep as is) */}
            <Text style={[styles.inputLabel, { color: colors.text }]}>
              Locations
            </Text>
            <TouchableOpacity
              style={[
                styles.manageLocationsButton,
                { backgroundColor: colors.surfaceLight },
              ]}
              onPress={onOpenLocationManager}
            >
              <Text
                style={[
                  styles.manageLocationsButtonText,
                  { color: colors.accent },
                ]}
              >
                Manage Locations ({formData.locations?.length || 0})
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.saveButton, { backgroundColor: colors.accent }]}
              onPress={onSave}
            >
              <Text style={[styles.saveButtonText, { color: colors.text }]}>
                Save
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.cancelButton,
                { backgroundColor: colors.surfaceLight },
              ]}
              onPress={onClose}
            >
              <Text style={[styles.cancelButtonText, { color: colors.text }]}>
                Cancel
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    borderRadius: 20,
    padding: 20,
    width: "90%",
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
  },
  inputLabel: {
    fontSize: 14,
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  saveButton: {
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 20,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelButton: {
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 12,
  },
  cancelButtonText: {
    fontSize: 16,
  },
  manageLocationsButton: {
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
    marginTop: 8,
  },
  manageLocationsButtonText: {
    fontSize: 14,
  },
});
