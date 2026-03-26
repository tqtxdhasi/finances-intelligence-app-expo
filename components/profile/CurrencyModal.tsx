import { Ionicons } from "@expo/vector-icons";
import currencyCodes from "currency-codes";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface Props {
  visible: boolean;
  selectedCurrency: string;
  onSelectCurrency: (code: string) => void;
  onClose: () => void;
  preferredCurrency?: string; // Optional: currency to show at the top
}

export default function CurrencyModal({
  visible,
  selectedCurrency,
  onSelectCurrency,
  onClose,
  preferredCurrency,
}: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const allCurrencies = currencyCodes.data;

  // Sort: preferred currency first, then rest alphabetically by code
  const sortedCurrencies = useMemo(() => {
    let list = [...allCurrencies];
    if (preferredCurrency) {
      const index = list.findIndex((c) => c.code === preferredCurrency);
      if (index !== -1) {
        const [preferred] = list.splice(index, 1);
        list = [preferred, ...list];
      }
    }
    return list;
  }, [allCurrencies, preferredCurrency]);

  const filteredCurrencies = sortedCurrencies.filter(
    (curr) =>
      curr.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      curr.currency.toLowerCase().includes(searchQuery.toLowerCase()),
  );

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
            <Text style={styles.modalTitle}>Select Currency</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.searchInput}
            placeholder="Search by code or name..."
            placeholderTextColor="#aaa"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />

          <FlatList
            data={filteredCurrencies}
            keyExtractor={(item) => item.code}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.currencyItem}
                onPress={() => {
                  onSelectCurrency(item.code);
                  setSearchQuery("");
                }}
              >
                <View style={styles.currencyItemInfo}>
                  <Text style={styles.currencyItemCode}>{item.code}</Text>
                  <Text style={styles.currencyItemName}>{item.currency}</Text>
                </View>
                {selectedCurrency === item.code && (
                  <Ionicons name="checkmark" size={20} color="#ff9800" />
                )}
              </TouchableOpacity>
            )}
            style={styles.currencyList}
          />
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
  searchInput: {
    backgroundColor: "#2a2a2a",
    color: "#fff",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 16,
  },
  currencyList: {
    maxHeight: 300,
  },
  currencyItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  currencyItemInfo: {
    flex: 1,
  },
  currencyItemCode: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  currencyItemName: {
    color: "#aaa",
    fontSize: 12,
    marginTop: 2,
  },
});
