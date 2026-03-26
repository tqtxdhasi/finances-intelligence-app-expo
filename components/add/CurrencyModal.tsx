// components/add/CurrencyModal.tsx
import { useTheme } from "@/utils/theme";
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
  preferredCurrency?: string; // optional currency to show at top
}

export default function CurrencyModal({
  visible,
  selectedCurrency,
  onSelectCurrency,
  onClose,
  preferredCurrency,
}: Props) {
  const { colors } = useTheme();
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
        <View
          style={[styles.modalContainer, { backgroundColor: colors.surface }]}
        >
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Select Currency
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <TextInput
            style={[
              styles.searchInput,
              {
                backgroundColor: colors.surfaceLight,
                color: colors.text,
              },
            ]}
            placeholder="Search by code or name..."
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />

          <FlatList
            data={filteredCurrencies}
            keyExtractor={(item) => item.code}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.currencyItem,
                  { borderBottomColor: colors.border },
                ]}
                onPress={() => {
                  onSelectCurrency(item.code);
                  setSearchQuery("");
                }}
              >
                <View style={styles.currencyItemInfo}>
                  <Text
                    style={[styles.currencyItemCode, { color: colors.text }]}
                  >
                    {item.code}
                  </Text>
                  <Text
                    style={[
                      styles.currencyItemName,
                      { color: colors.textSecondary },
                    ]}
                  >
                    {item.currency}
                  </Text>
                </View>
                {selectedCurrency === item.code && (
                  <Ionicons name="checkmark" size={20} color={colors.accent} />
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
  },
  searchInput: {
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
  },
  currencyItemInfo: {
    flex: 1,
  },
  currencyItemCode: {
    fontSize: 16,
    fontWeight: "bold",
  },
  currencyItemName: {
    fontSize: 12,
    marginTop: 2,
  },
});
