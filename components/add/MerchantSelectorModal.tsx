import {
  getRecentMerchants,
  MerchantWithLocations,
  searchMerchants,
} from "@/hooks/merchant/getAllMerchants";
import { Location } from "@/types/data";
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

interface Props {
  visible: boolean;
  onSelectMerchant: (merchant: {
    id: string;
    name: string;
    address: string;
    locationId?: string;
  }) => void;
  onClose: () => void;
}

export default function MerchantSelectorModal({
  visible,
  onSelectMerchant,
  onClose,
}: Props) {
  const { colors } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [merchants, setMerchants] = useState<MerchantWithLocations[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedMerchant, setSelectedMerchant] =
    useState<MerchantWithLocations | null>(null);

  // Load recent merchants when modal opens
  useEffect(() => {
    if (visible) {
      loadRecentMerchants();
    } else {
      // reset state on close
      setSearchQuery("");
      setSelectedMerchant(null);
    }
  }, [visible]);

  const loadRecentMerchants = async () => {
    setLoading(true);
    try {
      const recent = await getRecentMerchants(10);
      setMerchants(recent);
    } catch (error) {
      console.error("Failed to load recent merchants:", error);
    } finally {
      setLoading(false);
    }
  };

  const search = async (text: string) => {
    setSearchQuery(text);
    if (text.trim().length === 0) {
      loadRecentMerchants();
      return;
    }
    setLoading(true);
    try {
      const results = await searchMerchants(text);
      setMerchants(results);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectMerchant = (merchant: MerchantWithLocations) => {
    if (merchant.locations.length === 1) {
      // Single location: auto-select it
      const loc = merchant.locations[0];
      onSelectMerchant({
        id: merchant.id,
        name: merchant.name,
        address: loc.location_address,
        locationId: loc.id,
      });
      onClose();
    } else if (merchant.locations.length > 1) {
      // Show location picker
      setSelectedMerchant(merchant);
    } else {
      // No locations: still allow selection, address will be empty
      onSelectMerchant({
        id: merchant.id,
        name: merchant.name,
        address: "",
        locationId: undefined,
      });
      onClose();
    }
  };

  const handleSelectLocation = (location: Location) => {
    // Use Location type
    if (selectedMerchant) {
      onSelectMerchant({
        id: selectedMerchant.id,
        name: selectedMerchant.name,
        address: location.location_address, // ✅ use location_address
        locationId: location.id,
      });
      onClose();
    }
  };

  const renderMerchantItem = ({ item }: { item: MerchantWithLocations }) => (
    <TouchableOpacity
      style={[styles.item, { borderBottomColor: colors.border }]}
      onPress={() => handleSelectMerchant(item)}
    >
      <View style={styles.itemContent}>
        <Text style={[styles.itemName, { color: colors.text }]}>
          {item.name}
        </Text>
        {item.locations.length > 0 && (
          <Text style={[styles.locationHint, { color: colors.textSecondary }]}>
            {item.locations.length} location
            {item.locations.length !== 1 ? "s" : ""}
          </Text>
        )}
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
    </TouchableOpacity>
  );

  const renderLocationPicker = () => (
    <View>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => setSelectedMerchant(null)}
      >
        <Ionicons name="arrow-back" size={24} color={colors.accent} />
        <Text style={[styles.backText, { color: colors.accent }]}>
          Back to merchants
        </Text>
      </TouchableOpacity>
      <Text style={[styles.locationTitle, { color: colors.text }]}>
        Select a location for {selectedMerchant?.name}
      </Text>
      <FlatList
        data={selectedMerchant?.locations || []}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.item, { borderBottomColor: colors.border }]}
            onPress={() => handleSelectLocation(item)} // ✅ passes full Location object
          >
            <Text style={[styles.itemName, { color: colors.text }]}>
              {item.location_address}
            </Text>
            <Text
              style={[styles.locationDetail, { color: colors.textSecondary }]}
            >
              {item.city}, {item.country_code}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );

  return (
    <Modal
      animationType="slide"
      transparent
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
              {selectedMerchant ? "Select Location" : "Select Merchant"}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {!selectedMerchant && (
            <TextInput
              style={[
                styles.searchInput,
                { backgroundColor: colors.surfaceLight, color: colors.text },
              ]}
              placeholder="Search merchants..."
              placeholderTextColor={colors.textMuted}
              value={searchQuery}
              onChangeText={search}
            />
          )}

          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.accent} />
            </View>
          )}

          {!loading &&
            !selectedMerchant &&
            merchants.length === 0 &&
            searchQuery.trim() !== "" && (
              <View style={styles.emptyContainer}>
                <Text style={[styles.emptyText, { color: colors.textMuted }]}>
                  No merchants found
                </Text>
              </View>
            )}

          {!selectedMerchant ? (
            <FlatList
              data={merchants}
              keyExtractor={(item) => item.id}
              renderItem={renderMerchantItem}
              style={styles.list}
            />
          ) : (
            renderLocationPicker()
          )}
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
    paddingVertical: 40,
    alignItems: "center",
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
  },
  list: {
    maxHeight: 400,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
  },
  itemContent: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "500",
  },
  locationHint: {
    fontSize: 12,
    marginTop: 2,
  },
  locationDetail: {
    fontSize: 12,
    marginTop: 2,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  backText: {
    fontSize: 16,
    marginLeft: 8,
  },
  locationTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 12,
  },
});
