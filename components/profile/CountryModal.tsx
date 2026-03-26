import { Ionicons } from "@expo/vector-icons";
import countries from "i18n-iso-countries";
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
// Load English names (you can load other languages too)
import enLocale from "i18n-iso-countries/langs/en.json";

countries.registerLocale(enLocale);

interface Props {
  visible: boolean;
  selectedCountry: string; // country code (ISO 3166-1 alpha-2)
  onSelectCountry: (code: string) => void;
  onClose: () => void;
  preferredCountry?: string; // optional country to show at the top
}

export default function CountryModal({
  visible,
  selectedCountry,
  onSelectCountry,
  onClose,
  preferredCountry,
}: Props) {
  const [searchQuery, setSearchQuery] = useState("");

  // Get all countries as an array of {code, name}
  const allCountries = useMemo(() => {
    const countryNames = countries.getNames("en");
    return Object.entries(countryNames).map(([code, name]) => ({
      code,
      name,
    }));
  }, []);

  // Sort: preferred country first, then alphabetical by name
  const sortedCountries = useMemo(() => {
    let list = [...allCountries];
    if (preferredCountry) {
      const index = list.findIndex((c) => c.code === preferredCountry);
      if (index !== -1) {
        const [preferred] = list.splice(index, 1);
        list = [preferred, ...list];
      }
    }
    return list;
  }, [allCountries, preferredCountry]);

  const filteredCountries = sortedCountries.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.code.toLowerCase().includes(searchQuery.toLowerCase()),
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
            <Text style={styles.modalTitle}>Select Country</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.searchInput}
            placeholder="Search by name or code..."
            placeholderTextColor="#aaa"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />

          <FlatList
            data={filteredCountries}
            keyExtractor={(item) => item.code}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.countryItem}
                onPress={() => {
                  onSelectCountry(item.code);
                  setSearchQuery("");
                }}
              >
                <View style={styles.countryItemInfo}>
                  <Text style={styles.countryItemName}>{item.name}</Text>
                  <Text style={styles.countryItemCode}>{item.code}</Text>
                </View>
                {selectedCountry === item.code && (
                  <Ionicons name="checkmark" size={20} color="#ff9800" />
                )}
              </TouchableOpacity>
            )}
            style={styles.countryList}
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
  countryList: {
    maxHeight: 300,
  },
  countryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  countryItemInfo: {
    flex: 1,
  },
  countryItemName: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  countryItemCode: {
    color: "#aaa",
    fontSize: 12,
    marginTop: 2,
  },
});
