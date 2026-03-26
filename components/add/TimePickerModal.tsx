import { useTheme } from "@/utils/theme";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import React from "react";
import {
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface Props {
  visible: boolean;
  selectedTime: Date;
  onTimeChange: (event: any, date?: Date) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function TimePickerModal({
  visible,
  selectedTime,
  onTimeChange,
  onConfirm,
  onCancel,
}: Props) {
  const { colors } = useTheme();

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onCancel}
    >
      <View style={styles.modalOverlay}>
        <View
          style={[
            styles.modalContainer,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Select Time
            </Text>
            <TouchableOpacity onPress={onCancel}>
              <Ionicons name="close" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <DateTimePicker
            value={selectedTime}
            mode="time"
            is24Hour={true}
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={onTimeChange}
            style={styles.timePicker}
            textColor={colors.text}
            themeVariant={colors.background === "#000" ? "dark" : "light"}
          />

          <View style={styles.modalButtonContainer}>
            <TouchableOpacity
              style={[
                styles.modalConfirmButton,
                { backgroundColor: colors.accent },
              ]}
              onPress={onConfirm}
            >
              <Text
                style={[styles.modalConfirmButtonText, { color: colors.text }]}
              >
                Confirm
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.modalCancelButton,
                { backgroundColor: colors.surfaceLight },
              ]}
              onPress={onCancel}
            >
              <Text
                style={[styles.modalCancelButtonText, { color: colors.text }]}
              >
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

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
    borderWidth: 1,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  timePicker: {
    width: "100%",
    borderRadius: 8,
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  modalCancelButton: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 12,
    marginLeft: 8,
    alignItems: "center",
  },
  modalCancelButtonText: {
    fontSize: 16,
  },
  modalConfirmButton: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 12,
    marginRight: 8,
    alignItems: "center",
  },
  modalConfirmButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
