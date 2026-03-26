import { useSettingsStore } from "@/stores/settingsStore";
import { useTheme } from "@/utils/theme";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface Merchant {
  id: string;
  name: string;
  address: string;
}

interface Props {
  visible: boolean;
  onSelectMerchant: (merchant: Merchant) => void;
  onClose: () => void;
}

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

export default function MerchantModal({
  visible,
  onSelectMerchant,
  onClose,
}: Props) {
  const { colors } = useTheme();
  const { country: userCountry } = useSettingsStore(); // get user's country from settings

  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<Merchant[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debouncedQuery = useDebounce(searchQuery, 500);

  useEffect(() => {
    const searchPlaces = async () => {
      if (!debouncedQuery.trim()) {
        setResults([]);
        setError(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // 1. Local search (restricted to user's country)
        let localResults: Merchant[] = [];
        if (userCountry) {
          const localUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            debouncedQuery,
          )}&countrycodes=${userCountry}&limit=5&addressdetails=1`;
          const localRes = await fetch(localUrl, {
            headers: { "User-Agent": "ReceiptApp/1.0" },
          });
          if (localRes.ok) {
            const localData = await localRes.json();
            localResults = localData.map((item: any) => ({
              id: item.place_id.toString(),
              name: item.display_name.split(",")[0],
              address: item.display_name,
            }));
          }
        }

        // 2. International search (no country restriction)
        const internationalUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          debouncedQuery,
        )}&limit=5&addressdetails=1`;
        const internationalRes = await fetch(internationalUrl, {
          headers: { "User-Agent": "ReceiptApp/1.0" },
        });
        if (!internationalRes.ok) {
          throw new Error("Failed to fetch international results");
        }
        const internationalData = await internationalRes.json();
        const internationalResults = internationalData.map((item: any) => ({
          id: item.place_id.toString(),
          name: item.display_name.split(",")[0],
          address: item.display_name,
        }));

        // Merge: local first, then international, removing duplicates by id
        const allResults = [...localResults];
        for (const intItem of internationalResults) {
          if (!allResults.some((locItem) => locItem.id === intItem.id)) {
            allResults.push(intItem);
          }
        }
        setResults(allResults);
      } catch (err) {
        console.error("Merchant search error:", err);
        setError("Unable to search. Please try again.");
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    searchPlaces();
  }, [debouncedQuery, userCountry]);

  const handleSelect = (merchant: Merchant) => {
    onSelectMerchant(merchant);
    setSearchQuery("");
    setResults([]);
    onClose();
  };

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
            styles.modalContainer,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Select Merchant
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={colors.textSecondary} />
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
            placeholder="Search by name or address..."
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />

          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.accent} />
              <Text style={[styles.loadingText, { color: colors.textMuted }]}>
                Searching...
              </Text>
            </View>
          )}

          {error && (
            <View style={styles.errorContainer}>
              <Text style={[styles.errorText, { color: colors.error }]}>
                {error}
              </Text>
            </View>
          )}

          {!loading && !error && results.length === 0 && debouncedQuery && (
            <View style={styles.noResultsContainer}>
              <Text style={[styles.noResultsText, { color: colors.textMuted }]}>
                No merchants found
              </Text>
            </View>
          )}

          <FlatList
            data={results}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.merchantItem,
                  { borderBottomColor: colors.border },
                ]}
                onPress={() => handleSelect(item)}
              >
                <View>
                  <Text style={[styles.merchantName, { color: colors.text }]}>
                    {item.name}
                  </Text>
                  <Text
                    style={[
                      styles.merchantAddress,
                      { color: colors.textSecondary },
                    ]}
                  >
                    {item.address}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
            style={styles.merchantList}
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
  searchInput: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 16,
  },
  loadingContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  loadingText: {
    marginTop: 8,
  },
  errorContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  errorText: {
    textAlign: "center",
  },
  noResultsContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  noResultsText: {
    textAlign: "center",
  },
  merchantList: {
    maxHeight: 300,
  },
  merchantItem: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
  },
  merchantName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  merchantAddress: {
    fontSize: 12,
    marginTop: 2,
  },
});
 