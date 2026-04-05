import { getMerchantById } from "@/hooks/merchant/getMerchantById";
import { Merchant } from "@/types/data";
import { useTheme } from "@/utils/theme";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function MerchantDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors, theme, styles: themeStyles } = useTheme();

  const [merchant, setMerchant] = useState<Merchant | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMerchant();
  }, [id]);

  const fetchMerchant = async () => {
    setLoading(true);
    try {
      const data = await getMerchantById(id);
      setMerchant(data);
    } catch (error) {
      console.error("Failed to load merchant:", error);
      Alert.alert("Error", "Failed to load merchant details");
    } finally {
      setLoading(false);
    }
  };

  const handleEditPress = () => {
    // Navigate to edit page instead of opening modal
    router.push(`/merchant/edit/${id}`);
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
      {/* Custom Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.headerButton}
        >
          <Ionicons name="arrow-back" size={24} color={colors.accent} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          {merchant.name}
        </Text>
        <TouchableOpacity onPress={handleEditPress} style={styles.headerButton}>
          <Ionicons name="pencil" size={24} color={colors.accent} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Basic Information */}
        <View style={themeStyles.card}>
          <Text style={themeStyles.title}>Basic Information</Text>

          <View style={styles.infoRow}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>
              Name:
            </Text>
            <Text style={[styles.value, { color: colors.text }]}>
              {merchant.name}
            </Text>
          </View>

          {merchant.alternative_names && (
            <View style={styles.infoRow}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>
                Also known as:
              </Text>
              <Text style={[styles.value, { color: colors.text }]}>
                {merchant.alternative_names}
              </Text>
            </View>
          )}

          {merchant.domain && (
            <View style={styles.infoRow}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>
                Domain:
              </Text>
              <Text style={[styles.value, { color: colors.text }]}>
                {merchant.domain}
              </Text>
            </View>
          )}

          {merchant.industry_type && (
            <View style={styles.infoRow}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>
                Industry:
              </Text>
              <Text style={[styles.value, { color: colors.text }]}>
                {merchant.industry_type}
              </Text>
            </View>
          )}

          {merchant.country_code && (
            <View style={styles.infoRow}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>
                Country:
              </Text>
              <Text style={[styles.value, { color: colors.text }]}>
                {merchant.country_code}
              </Text>
            </View>
          )}

          {merchant.tax_registration_id && (
            <View style={styles.infoRow}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>
                Tax ID:
              </Text>
              <Text style={[styles.value, { color: colors.text }]}>
                {merchant.tax_registration_id}
              </Text>
            </View>
          )}
        </View>

        {/* Locations */}
        <View style={themeStyles.card}>
          <Text style={themeStyles.title}>Locations</Text>
          {merchant.locations && merchant.locations.length > 0 ? (
            merchant.locations.map((location, index) => (
              <View
                key={index}
                style={[
                  styles.locationItem,
                  { borderBottomColor: colors.border },
                ]}
              >
                <Text style={[styles.locationAddress, { color: colors.text }]}>
                  {location.location_address}
                </Text>
                <Text
                  style={[
                    styles.locationDetail,
                    { color: colors.textSecondary },
                  ]}
                >
                  {[location.city, location.province, location.zip]
                    .filter(Boolean)
                    .join(", ")}
                </Text>
                <Text
                  style={[
                    styles.locationDetail,
                    { color: colors.textSecondary },
                  ]}
                >
                  {location.country_code}
                </Text>
                {location.external_place_id && (
                  <Text
                    style={[
                      styles.locationDetail,
                      { color: colors.textSecondary },
                    ]}
                  >
                    Place ID: {location.external_place_id}
                  </Text>
                )}
              </View>
            ))
          ) : (
            <Text style={[styles.noData, { color: colors.textSecondary }]}>
              No locations added yet.
            </Text>
          )}
        </View>

        {/* Metadata */}
        <View style={themeStyles.card}>
          <Text style={themeStyles.title}>Metadata</Text>
          <View style={styles.infoRow}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>
              Created:
            </Text>
            <Text style={[styles.value, { color: colors.text }]}>
              {new Date(merchant.created_at).toLocaleDateString()}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>
              Last Updated:
            </Text>
            <Text style={[styles.value, { color: colors.text }]}>
              {new Date(merchant.updated_at).toLocaleDateString()}
            </Text>
          </View>
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
    flex: 1,
    textAlign: "center",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 12,
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    paddingVertical: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
  },
  value: {
    fontSize: 14,
    flex: 1,
    textAlign: "right",
  },
  locationItem: {
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  locationAddress: {
    fontSize: 14,
    marginBottom: 2,
  },
  locationDetail: {
    fontSize: 12,
    marginTop: 2,
  },
  noData: {
    fontSize: 14,
    fontStyle: "italic",
  },
});
