// components/add/ItemModal.tsx
import { Item } from "@/types/receipt";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface Props {
  visible: boolean;
  item: Item | null;
  onSave: () => void;
  onClose: () => void;
  onChange: (item: Item) => void;
}

const UNITS = ["pcs", "kg", "g", "l", "ml", "pack", "box", "dozen", "bottle"];

export default function ItemModal({
  visible,
  item,
  onSave,
  onClose,
  onChange,
}: Props) {
  const [unitDropdownVisible, setUnitDropdownVisible] = useState(false);

  if (!item) return null;

  const handleSelectUnit = (unit: string) => {
    onChange({ ...item, unit });
    setUnitDropdownVisible(false);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Edit Item</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          <ScrollView>
            <Text style={styles.inputLabel}>Item Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Milk, Bread, Coffee"
              placeholderTextColor="#aaa"
              value={item.name}
              onChangeText={(text) => onChange({ ...item, name: text })}
            />

            <View style={styles.row}>
              <View style={styles.quantityContainer}>
                <Text style={styles.inputLabel}>Quantity</Text>
                <TextInput
                  style={styles.input}
                  placeholder="1"
                  placeholderTextColor="#aaa"
                  keyboardType="numeric"
                  value={item.quantity}
                  onChangeText={(text) => onChange({ ...item, quantity: text })}
                />
              </View>

              <View style={styles.unitContainer}>
                <Text style={styles.inputLabel}>Unit</Text>
                <TouchableOpacity
                  style={styles.unitSelector}
                  onPress={() => setUnitDropdownVisible(!unitDropdownVisible)}
                >
                  <Text style={styles.unitSelectorText}>{item.unit}</Text>
                  <Ionicons
                    name={unitDropdownVisible ? "chevron-up" : "chevron-down"}
                    size={20}
                    color="#fff"
                  />
                </TouchableOpacity>
                {unitDropdownVisible && (
                  <View style={styles.unitDropdown}>
                    {UNITS.map((unit) => (
                      <TouchableOpacity
                        key={unit}
                        style={styles.unitOption}
                        onPress={() => handleSelectUnit(unit)}
                      >
                        <Text style={styles.unitOptionText}>{unit}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            </View>

            <Text style={styles.inputLabel}>Price *</Text>
            <TextInput
              style={styles.input}
              placeholder="0.00"
              placeholderTextColor="#aaa"
              keyboardType="decimal-pad"
              value={item.price}
              onChangeText={(text) => onChange({ ...item, price: text })}
            />

            <TouchableOpacity style={styles.saveItemButton} onPress={onSave}>
              <Text style={styles.saveItemButtonText}>Save Item</Text>
            </TouchableOpacity>
          </ScrollView>
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
    backgroundColor: "#1e1e1e",
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
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  inputLabel: {
    fontSize: 14,
    color: "#aaa",
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: "#2a2a2a",
    color: "#fff",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  quantityContainer: {
    flex: 1,
  },
  unitContainer: {
    flex: 1,
    position: "relative",
    zIndex: 1,
  },
  unitSelector: {
    backgroundColor: "#2a2a2a",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  unitSelectorText: {
    color: "#fff",
    fontSize: 16,
  },
  unitDropdown: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    backgroundColor: "#2a2a2a",
    borderRadius: 8,
    marginTop: 4,
    maxHeight: 200,
    zIndex: 10,
  },
  unitOption: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#3a3a3a",
  },
  unitOptionText: {
    color: "#fff",
    fontSize: 14,
  },
  saveItemButton: {
    backgroundColor: "#ff9800",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 10,
  },
  saveItemButtonText: {
    color: "#121212",
    fontSize: 16,
    fontWeight: "bold",
  },
});
