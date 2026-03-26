import { useTheme } from "@/utils/theme";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Location } from "../types";

interface LocationManagerModalProps {
  visible: boolean;
  initialLocations: Location[];
  onSave: (locations: Location[]) => void;
  onClose: () => void;
}

export const LocationManagerModal: React.FC<LocationManagerModalProps> = ({
  visible,
  initialLocations,
  onSave,
  onClose,
}) => {
  const { colors } = useTheme();
  const [locations, setLocations] = useState<Location[]>(initialLocations);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [addressInput, setAddressInput] = useState("");

  const handleAdd = () => {
    if (!addressInput.trim()) {
      Alert.alert("Error", "Address is required");
      return;
    }
    const newLocation: Location = {
      id: Date.now().toString(),
      address: addressInput.trim(),
    };
    setLocations([...locations, newLocation]);
    setAddressInput("");
  };

  const handleEdit = (location: Location) => {
    setEditingLocation(location);
    setAddressInput(location.address);
  };

  const handleSaveEdit = () => {
    if (!editingLocation) return;
    if (!addressInput.trim()) {
      Alert.alert("Error", "Address is required");
      return;
    }
    const updated = locations.map((loc) =>
      loc.id === editingLocation.id
        ? { ...loc, address: addressInput.trim() }
        : loc,
    );
    setLocations(updated);
    setEditingLocation(null);
    setAddressInput("");
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      "Delete Location",
      "Are you sure you want to delete this location?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => setLocations(locations.filter((loc) => loc.id !== id)),
        },
      ],
    );
  };

  const renderLocation = ({ item }: { item: Location }) => (
    <View
      style={[styles.locationItem, { backgroundColor: colors.surfaceLight }]}
    >
      <Text style={[styles.locationAddress, { color: colors.text }]}>
        {item.address}
      </Text>
      <View style={styles.locationActions}>
        <TouchableOpacity
          onPress={() => handleEdit(item)}
          style={styles.actionButton}
        >
          <Ionicons
            name="create-outline"
            size={18}
            color={colors.textSecondary}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleDelete(item.id)}
          style={styles.actionButton}
        >
          <Ionicons
            name="trash-outline"
            size={18}
            color={colors.error || "#ff4444"}
          />
        </TouchableOpacity>
      </View>
    </View>
  );

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
              Manage Locations
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.surfaceLight,
                  color: colors.text,
                },
              ]}
              placeholder="Enter address"
              placeholderTextColor={colors.textMuted}
              value={addressInput}
              onChangeText={setAddressInput}
            />
            {editingLocation ? (
              <TouchableOpacity
                style={[styles.smallButton, { backgroundColor: colors.accent }]}
                onPress={handleSaveEdit}
              >
                <Text style={[styles.smallButtonText, { color: colors.text }]}>
                  Update
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.smallButton, { backgroundColor: colors.accent }]}
                onPress={handleAdd}
              >
                <Text style={[styles.smallButtonText, { color: colors.text }]}>
                  Add
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <FlatList
            data={locations}
            keyExtractor={(item) => item.id}
            renderItem={renderLocation}
            style={styles.list}
          />

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={[styles.saveButton, { backgroundColor: colors.accent }]}
              onPress={() => onSave(locations)}
            >
              <Text style={[styles.saveButtonText, { color: colors.text }]}>
                Save Locations
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
          </View>
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
  inputContainer: {
    flexDirection: "row",
    marginBottom: 16,
  },
  input: {
    flex: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginRight: 8,
  },
  smallButton: {
    borderRadius: 8,
    paddingHorizontal: 16,
    justifyContent: "center",
  },
  smallButtonText: {
    fontWeight: "bold",
  },
  list: {
    maxHeight: 300,
  },
  locationItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  locationAddress: {
    fontSize: 14,
    flex: 1,
  },
  locationActions: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    padding: 4,
  },
  modalFooter: {
    marginTop: 20,
  },
  saveButton: {
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
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
});
