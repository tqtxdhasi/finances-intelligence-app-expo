import { Location, Merchant } from "@/types/data";
import { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface EditMerchantModalProps {
  visible: boolean;
  merchant: Merchant | null;
  onClose: () => void;
  onSave: (
    updatedData: Partial<Merchant>,
    locations: Location[],
  ) => Promise<void>;
  colors: any;
  theme: any;
  themeStyles: any;
}

export default function EditMerchantModal({
  visible,
  merchant,
  onClose,
  onSave,
  colors,
  theme,
  themeStyles,
}: EditMerchantModalProps) {
  const [editingMerchant, setEditingMerchant] = useState<Partial<Merchant>>({});
  const [editingLocations, setEditingLocations] = useState<Location[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (merchant && visible) {
      setEditingMerchant({
        name: merchant.name,
        alternative_names: merchant.alternative_names,
        domain: merchant.domain,
        merchant_logo: merchant.merchant_logo,
        industry_type: merchant.industry_type,
        country_code: merchant.country_code,
        tax_registration_id: merchant.tax_registration_id,
      });
      setEditingLocations(merchant.locations || []);
    }
  }, [merchant, visible]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(editingMerchant, editingLocations);
      onClose();
    } catch (error) {
      console.error("Failed to update merchant:", error);
      Alert.alert("Error", "Failed to update merchant");
    } finally {
      setSaving(false);
    }
  };

  const addLocation = () => {
    const newLocation: Location = {
      id: `temp_${Date.now()}`,
      location_address: "",
      city: "",
      country_code: editingMerchant.country_code || "",
      zip: "",
      province: "",
      external_place_id: "",
      latitude: null,
      longitude: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setEditingLocations([...editingLocations, newLocation]);
  };

  const updateLocation = (index: number, field: keyof Location, value: any) => {
    const updatedLocations = [...editingLocations];
    updatedLocations[index] = { ...updatedLocations[index], [field]: value };
    setEditingLocations(updatedLocations);
  };

  const removeLocation = (index: number) => {
    Alert.alert(
      "Remove Location",
      "Are you sure you want to remove this location?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            const updatedLocations = editingLocations.filter(
              (_, i) => i !== index,
            );
            setEditingLocations(updatedLocations);
          },
        },
      ],
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View
        style={[styles.modalContainer, { backgroundColor: colors.background }]}
      >
        <View
          style={[styles.modalHeader, { borderBottomColor: colors.border }]}
        >
          <Text style={[styles.modalTitle, { color: colors.text }]}>
            Edit Merchant
          </Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={{ color: colors.accent, fontSize: 16 }}>Cancel</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalContent}>
          {/* Basic Info Fields */}
          <Text style={[styles.inputLabel, { color: colors.text }]}>
            Name *
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.surface,
                color: colors.text,
                borderColor: colors.border,
              },
            ]}
            value={editingMerchant.name}
            onChangeText={(text) =>
              setEditingMerchant({ ...editingMerchant, name: text })
            }
            placeholder="Merchant name"
            placeholderTextColor={colors.textSecondary}
          />

          <Text style={[styles.inputLabel, { color: colors.text }]}>
            Alternative Names (comma separated)
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.surface,
                color: colors.text,
                borderColor: colors.border,
              },
            ]}
            value={editingMerchant.alternative_names || ""}
            onChangeText={(text) =>
              setEditingMerchant({
                ...editingMerchant,
                alternative_names: text,
              })
            }
            placeholder="e.g., Starbucks, Starbs"
            placeholderTextColor={colors.textSecondary}
          />

          <Text style={[styles.inputLabel, { color: colors.text }]}>
            Domain
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.surface,
                color: colors.text,
                borderColor: colors.border,
              },
            ]}
            value={editingMerchant.domain || ""}
            onChangeText={(text) =>
              setEditingMerchant({ ...editingMerchant, domain: text })
            }
            placeholder="example.com"
            placeholderTextColor={colors.textSecondary}
          />

          <Text style={[styles.inputLabel, { color: colors.text }]}>
            Industry Type
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.surface,
                color: colors.text,
                borderColor: colors.border,
              },
            ]}
            value={editingMerchant.industry_type || ""}
            onChangeText={(text) =>
              setEditingMerchant({ ...editingMerchant, industry_type: text })
            }
            placeholder="Retail, Restaurant, etc."
            placeholderTextColor={colors.textSecondary}
          />

          <Text style={[styles.inputLabel, { color: colors.text }]}>
            Country Code
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.surface,
                color: colors.text,
                borderColor: colors.border,
              },
            ]}
            value={editingMerchant.country_code || ""}
            onChangeText={(text) =>
              setEditingMerchant({ ...editingMerchant, country_code: text })
            }
            placeholder="US, CA, GB, etc."
            placeholderTextColor={colors.textSecondary}
          />

          <Text style={[styles.inputLabel, { color: colors.text }]}>
            Tax Registration ID
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.surface,
                color: colors.text,
                borderColor: colors.border,
              },
            ]}
            value={editingMerchant.tax_registration_id || ""}
            onChangeText={(text) =>
              setEditingMerchant({
                ...editingMerchant,
                tax_registration_id: text,
              })
            }
            placeholder="Tax ID / VAT number"
            placeholderTextColor={colors.textSecondary}
          />

          {/* Locations Section */}
          <View style={styles.locationsHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Locations
            </Text>
            <TouchableOpacity onPress={addLocation}>
              <Text style={{ color: colors.accent }}>+ Add Location</Text>
            </TouchableOpacity>
          </View>

          {editingLocations.map((location, index) => (
            <View
              key={index}
              style={[
                styles.locationEditCard,
                {
                  borderColor: colors.border,
                  backgroundColor: colors.surfaceLight,
                },
              ]}
            >
              <View style={styles.locationHeader}>
                <Text style={[styles.locationTitle, { color: colors.text }]}>
                  Location {index + 1}
                </Text>
                <TouchableOpacity onPress={() => removeLocation(index)}>
                  <Text style={{ color: colors.error }}>Remove</Text>
                </TouchableOpacity>
              </View>

             
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.surface,
                    color: colors.text,
                    borderColor: colors.border,
                  },
                ]}
                value={location.location_address}
                onChangeText={(text) =>
                  updateLocation(index, "location_address", text)
                }
                placeholder="Address *"
                placeholderTextColor={colors.textSecondary}
              />

              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.surface,
                    color: colors.text,
                    borderColor: colors.border,
                  },
                ]}
                value={location.city}
                onChangeText={(text) => updateLocation(index, "city", text)}
                placeholder="City *"
                placeholderTextColor={colors.textSecondary}
              />

              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.surface,
                    color: colors.text,
                    borderColor: colors.border,
                  },
                ]}
                value={location.province || ""}
                onChangeText={(text) => updateLocation(index, "province", text)}
                placeholder="Province/State (optional)"
                placeholderTextColor={colors.textSecondary}
              />

              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.surface,
                    color: colors.text,
                    borderColor: colors.border,
                  },
                ]}
                value={location.zip}
                onChangeText={(text) => updateLocation(index, "zip", text)}
                placeholder="ZIP/Postal Code *"
                placeholderTextColor={colors.textSecondary}
              />

              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.surface,
                    color: colors.text,
                    borderColor: colors.border,
                  },
                ]}
                value={location.country_code}
                onChangeText={(text) =>
                  updateLocation(index, "country_code", text)
                }
                placeholder="Country Code *"
                placeholderTextColor={colors.textSecondary}
              />

              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.surface,
                    color: colors.text,
                    borderColor: colors.border,
                  },
                ]}
                value={location.external_place_id || ""}
                onChangeText={(text) =>
                  updateLocation(index, "external_place_id", text)
                }
                placeholder="Google Place ID (optional)"
                placeholderTextColor={colors.textSecondary}
              />
            </View>
          ))}
        </ScrollView>

        <View style={[styles.modalFooter, { borderTopColor: colors.border }]}>
          <TouchableOpacity
            style={[styles.saveButton, { backgroundColor: colors.accent }]}
            onPress={handleSave}
            disabled={saving}
          >
            <Text style={styles.saveButtonText}>
              {saving ? "Saving..." : "Save Changes"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  modalFooter: {
    padding: 16,
    borderTopWidth: 1,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 8,
    borderWidth: 1,
  },
  locationsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  locationEditCard: {
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
  },
  locationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  locationTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  saveButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
