import { useTheme } from "@/utils/theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface CustomDateModalProps {
  visible: boolean;
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onApply: () => void;
  onClose: () => void;
}

export const CustomDateModal: React.FC<CustomDateModalProps> = ({
  visible,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onApply,
  onClose,
}) => {
  const { colors } = useTheme();

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View
          style={[
            styles.customDateContainer,
            { backgroundColor: colors.surface },
          ]}
        >
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Custom Range
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <Text style={[styles.inputLabel, { color: colors.text }]}>
            Start Date (YYYY-MM-DD)
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.surfaceLight,
                color: colors.text,
              },
            ]}
            placeholder="2025-01-01"
            placeholderTextColor={colors.textMuted}
            value={startDate}
            onChangeText={onStartDateChange}
          />

          <Text style={[styles.inputLabel, { color: colors.text }]}>
            End Date (YYYY-MM-DD)
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.surfaceLight,
                color: colors.text,
              },
            ]}
            placeholder="2025-12-31"
            placeholderTextColor={colors.textMuted}
            value={endDate}
            onChangeText={onEndDateChange}
          />

          <TouchableOpacity
            style={[styles.applyButton, { backgroundColor: colors.accent }]}
            onPress={onApply}
          >
            <Text style={[styles.applyButtonText, { color: colors.text }]}>
              Apply
            </Text>
          </TouchableOpacity>
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
  customDateContainer: {
    borderRadius: 20,
    padding: 20,
    width: "90%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
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
  applyButton: {
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 20,
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
