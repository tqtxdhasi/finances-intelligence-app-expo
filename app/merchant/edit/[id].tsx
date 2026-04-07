import { getMerchantById } from "@/hooks/merchant/getMerchantById";
import { updateMerchantById } from "@/hooks/merchant/updateMerchantById";
import { Location, Merchant } from "@/types/data";
import { useTheme } from "@/utils/theme";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function EditMerchantScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors, theme, styles: themeStyles } = useTheme();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [merchant, setMerchant] = useState<Merchant | null>(null);
  const [editingMerchant, setEditingMerchant] = useState<Partial<Merchant>>({});
  const [editingLocations, setEditingLocations] = useState<Location[]>([]);

  useEffect(() => {
    fetchMerchant();
  }, [id]);

  const fetchMerchant = async () => {
    setLoading(true);
    try {
      const data = await getMerchantById(id);
      setMerchant(data);
      setEditingMerchant({
        name: data.name,
        alternative_names: data.alternative_names,
        domain: data.domain,
        merchant_logo: data.merchant_logo,
        industry_type: data.industry_type,
        country_code: data.country_code,
        tax_registration_id: data.tax_registration_id,
      });
      setEditingLocations(data.locations || []);
    } catch (error) {
      console.error("Failed to load merchant:", error);
      Alert.alert("Error", "Failed to load merchant details");
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateMerchantById(id, {
        name: editingMerchant.name,
        alternative_names: editingMerchant.alternative_names,
        domain: editingMerchant.domain,
        merchant_logo: editingMerchant.merchant_logo,
        industry_type: editingMerchant.industry_type,
        country_code: editingMerchant.country_code,
        tax_registration_id: editingMerchant.tax_registration_id,
        locations: editingLocations,
      });
      Alert.alert("Success", "Merchant updated successfully");
      router.back();
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
    const updated = [...editingLocations];
    updated[index] = { ...updated[index], [field]: value };
    setEditingLocations(updated);
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
            const updated = editingLocations.filter((_, i) => i !== index);
            setEditingLocations(updated);
          },
        },
      ],
    );
  };

  if (loading) {
    return (
      <View style={[themeStyles.container, styles.center]}>
        <Text style={{ color: colors.text }}>Loading...</Text>
      </View>
    );
  }

  if (!merchant) {
    return (
      <View style={[themeStyles.container, styles.center]}>
        <Text style={{ color: colors.text }}>Merchant not found</Text>
      </View>
    );
  }

  return (
    <View
      style={[themeStyles.container, { backgroundColor: colors.background }]}
    >
      {/* Header with back and save buttons */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.headerButton}
        >
          <Ionicons name="close" size={24} color={colors.accent} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Edit Merchant
        </Text>
        <TouchableOpacity
          onPress={handleSave}
          disabled={saving}
          style={styles.headerButton}
        >
          <Text
            style={{ color: colors.accent, fontSize: 16, fontWeight: "600" }}
          >
            {saving ? "Saving..." : "Save"}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Basic Info */}
        <View style={themeStyles.card}>
          <Text style={themeStyles.title}>Basic Information</Text>

          <Text style={[styles.label, { color: colors.text }]}>Name *</Text>
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

          <Text style={[styles.label, { color: colors.text }]}>
            Alternative Names
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

          <Text style={[styles.label, { color: colors.text }]}>Domain</Text>
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

          <Text style={[styles.label, { color: colors.text }]}>
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

          <Text style={[styles.label, { color: colors.text }]}>
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

          <Text style={[styles.label, { color: colors.text }]}>
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
        </View>

        {/* Locations */}
        <View style={themeStyles.card}>
          <View style={styles.locationsHeader}>
            <Text style={themeStyles.title}>Locations</Text>
            <TouchableOpacity onPress={addLocation}>
              <Text style={{ color: colors.accent }}>+ Add Location</Text>
            </TouchableOpacity>
          </View>

          {editingLocations.map((location, idx) => (
            <View
              key={idx}
              style={[
                styles.locationCard,
                {
                  borderColor: colors.border,
                  backgroundColor: colors.surfaceLight,
                },
              ]}
            >
              <View style={styles.locationCardHeader}>
                <Text style={[styles.locationTitle, { color: colors.text }]}>
                  Location {idx + 1}
                </Text>
                <TouchableOpacity onPress={() => removeLocation(idx)}>
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
                  updateLocation(idx, "location_address", text)
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
                onChangeText={(text) => updateLocation(idx, "city", text)}
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
                onChangeText={(text) => updateLocation(idx, "province", text)}
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
                onChangeText={(text) => updateLocation(idx, "zip", text)}
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
                  updateLocation(idx, "country_code", text)
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
                  updateLocation(idx, "external_place_id", text)
                }
                placeholder="Google Place ID (optional)"
                placeholderTextColor={colors.textSecondary}
              />
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 12,
    paddingBottom: 20,
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 6,
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
    marginBottom: 12,
  },
  locationCard: {
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
  },
  locationCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  locationTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
});
