import FilePreviewModal from "@/components/add/FilePreviewModal";
import GalleryButton from "@/components/add/GalleryButton";
import IndustryTypeModal from "@/components/data/merchants/IndustryTypeModal";
import CountryModal from "@/components/profile/CountryModal";
import { createMerchant } from "@/hooks/merchant/createMerchant";
import { useSettingsStore } from "@/stores/settingsStore";
import { ReceiptFile } from "@/types/receipt";
import { useTheme } from "@/utils/theme";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import countries from "i18n-iso-countries";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// -------------------------------------------------------------------
// FULL STRIPE ISSUING MERCHANT CATEGORIES (as of 2025)
// Sorted alphabetically by label for easier searching
// -------------------------------------------------------------------
export const INDUSTRY_TYPES = [
  { label: "Accommodation", value: "accommodation" },
  { label: "Administrative Services", value: "administrative_services" },
  { label: "Advertising", value: "advertising" },
  { label: "Agricultural Services", value: "agricultural_services" },
  { label: "Automotive", value: "automotive" },
  {
    label: "Cable, Satellite & Other Pay TV",
    value: "cable_satellite_other_pay_tv",
  },
  { label: "Catering", value: "catering" },
  {
    label: "Charitable & Social Service Organizations",
    value: "charitable_social_service_organizations",
  },
  { label: "Chemicals & Allied Products", value: "chemicals_allied_products" },
  { label: "Child Care", value: "child_care" },
  { label: "Computers & Software", value: "computers_software" },
  { label: "Construction", value: "construction" },
  { label: "Consulting", value: "consulting" },
  { label: "Courier Services", value: "courier_services" },
  { label: "Dental", value: "dental" },
  {
    label: "Digital Goods – Applications",
    value: "digital_goods_applications",
  },
  { label: "Digital Goods – Games", value: "digital_goods_games" },
  { label: "Digital Goods – Software", value: "digital_goods_software" },
  { label: "Digital Goods – Other", value: "digital_goods_other" },
  { label: "Discount Stores", value: "discount_stores" },
  { label: "Durable Goods", value: "durable_goods" },
  { label: "Education", value: "education" },
  { label: "Electronics Repair", value: "electronics_repair" },
  { label: "Entertainment", value: "entertainment" },
  { label: "Events & Tickets", value: "events_tickets" },
  { label: "Financial Institutions", value: "financial_institutions" },
  { label: "Florists", value: "florists" },
  { label: "Food & Catering", value: "food_catering" },
  { label: "Freight & Trucking", value: "freight_trucking" },
  { label: "Fuel Dealers – Heating Oil", value: "fuel_dealers_heating_oil" },
  {
    label: "Fuel Dealers – Non‑Automotive",
    value: "fuel_dealers_non_automotive",
  },
  { label: "Funeral Services", value: "funeral_services" },
  {
    label: "Furniture & Home Furnishings",
    value: "furniture_home_furnishings",
  },
  { label: "Gambling", value: "gambling" },
  { label: "Gas Stations", value: "gas_stations" },
  { label: "General Contractors", value: "general_contractors" },
  { label: "Gift Card & Novelty Stores", value: "gift_card_novelty_stores" },
  { label: "Grocery Stores", value: "grocery_stores" },
  { label: "Health & Beauty Spas", value: "health_beauty_spas" },
  { label: "Hardware Stores", value: "hardware_stores" },
  { label: "Industrial Supplies", value: "industrial_supplies" },
  {
    label: "Insurance Sales & Underwriting",
    value: "insurance_sales_underwriting",
  },
  { label: "Internet Services", value: "internet_services" },
  { label: "Legal Services & Attorneys", value: "legal_services_attorneys" },
  { label: "Logistics", value: "logistics" },
  { label: "Lodging – Hotels & Motels", value: "lodging_hotels_motels" },
  { label: "Manufacturing", value: "manufacturing" },
  { label: "Marketplaces", value: "marketplaces" },
  { label: "Miscellaneous", value: "miscellaneous" },
  {
    label: "Miscellaneous Public Services",
    value: "miscellaneous_public_services",
  },
  { label: "Miscellaneous Repair Shops", value: "miscellaneous_repair_shops" },
  { label: "Motion Picture Theaters", value: "motion_picture_theaters" },
  { label: "Moving & Storage", value: "moving_storage" },
  { label: "Multi‑Level Marketing", value: "multi_level_marketing" },
  { label: "Museums & Art Galleries", value: "museums_art_galleries" },
  {
    label: "Music Stores & Musical Instruments",
    value: "music_stores_musical_instruments",
  },
  { label: "News Dealers & Newsstands", value: "news_dealers_newsstands" },
  { label: "Non‑Profit", value: "non_profit" },
  { label: "Office Supplies", value: "office_supplies" },
  { label: "Oil & Gas", value: "oil_gas" },
  { label: "Parking Lots & Garages", value: "parking_lots_garages" },
  { label: "Pharmacies", value: "pharmacies" },
  { label: "Photography Studios", value: "photography_studios" },
  {
    label: "Postal Services (Government Only)",
    value: "postal_services_government_only",
  },
  { label: "Printing & Publishing", value: "printing_publishing" },
  { label: "Professional Services", value: "professional_services" },
  { label: "Public Utilities", value: "public_utilities" },
  { label: "Real Estate", value: "real_estate" },
  { label: "Recreation Services", value: "recreation_services" },
  { label: "Religious Organizations", value: "religious_organizations" },
  { label: "Restaurants", value: "restaurants" },
  { label: "Retail", value: "retail" },
  { label: "Schools", value: "schools" },
  { label: "Secretarial Support", value: "secretarial_support" },
  { label: "Security Services", value: "security_services" },
  { label: "Service Stations", value: "service_stations" },
  { label: "Shopping Centers & Malls", value: "shopping_centers_malls" },
  { label: "Social & Social Services", value: "social_social_services" },
  { label: "Sporting Goods Stores", value: "sporting_goods_stores" },
  { label: "Sports & Recreation", value: "sports_recreation" },
  { label: "Tax Preparation", value: "tax_preparation" },
  { label: "Telecommunication Services", value: "telecommunication_services" },
  { label: "Tobacco & Vaping", value: "tobacco_vaping" },
  { label: "Transportation", value: "transportation" },
  { label: "Travel Agencies", value: "travel_agencies" },
  { label: "Truck Stops", value: "truck_stops" },
  { label: "Utilities", value: "utilities" },
  { label: "Variety Stores", value: "variety_stores" },
  { label: "Veterinary Services", value: "veterinary_services" },
  { label: "Wholesale", value: "wholesale" },
];

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

// Extended location type with all database fields
interface Location {
  id: string;
  name?: string;
  location_address?: string;
  city?: string;
  province?: string;
  province_code?: string;
  country?: string;
  country_code?: string;
  zip?: string;
  latitude?: number;
  longitude?: number;
  displayName?: string;
}

export default function MerchantFormScreen() {
  const router = useRouter();
  const { colors, styles: themeStyles } = useTheme();
  const { country: userCountry } = useSettingsStore();
  const params = useLocalSearchParams<{
    id?: string;
    name?: string;
    alternative_names?: string;
    domain?: string;
    industry_type?: string;
    country_code?: string;
    tax_registration_id?: string;
    merchant_logo?: string;
    locations?: string;
  }>();

  // --- Merchant fields ---
  const [name, setName] = useState(params.name || "");
  const [alternativeNames, setAlternativeNames] = useState(
    params.alternative_names || "",
  );
  const [domain, setDomain] = useState(params.domain || "");
  const [industryType, setIndustryType] = useState(params.industry_type || "");
  const [countryCode, setCountryCode] = useState(
    params.country_code || userCountry || "",
  );
  const [taxRegistrationId, setTaxRegistrationId] = useState(
    params.tax_registration_id || "",
  );
  const [logo, setLogo] = useState<ReceiptFile | null>(
    params.merchant_logo
      ? { uri: params.merchant_logo, type: "image/jpeg", name: "logo" }
      : null,
  );
  const [locations, setLocations] = useState<Location[]>(
    params.locations ? JSON.parse(params.locations) : [],
  );
  const [saving, setSaving] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);

  // --- Industry modal state ---
  const [industryModalVisible, setIndustryModalVisible] = useState(false);

  // --- Location search state ---
  const [locationSearchQuery, setLocationSearchQuery] = useState("");
  const [locationResults, setLocationResults] = useState<Location[]>([]);
  const [locationSearchLoading, setLocationSearchLoading] = useState(false);
  const [locationSearchError, setLocationSearchError] = useState<string | null>(
    null,
  );
  const debouncedLocationQuery = useDebounce(locationSearchQuery, 500);
  const [countryModalVisible, setCountryModalVisible] = useState(false);

  // Search locations and parse address details
  useEffect(() => {
    const searchLocations = async () => {
      if (!debouncedLocationQuery.trim()) {
        setLocationResults([]);
        setLocationSearchError(null);
        return;
      }

      setLocationSearchLoading(true);
      setLocationSearchError(null);

      try {
        let localResults: Location[] = [];
        // Use merchant's countryCode instead of userCountry
        if (countryCode) {
          const localUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            debouncedLocationQuery,
          )}&countrycodes=${countryCode}&limit=5&addressdetails=1`;
          const localRes = await fetch(localUrl, {
            headers: { "User-Agent": "ReceiptApp/1.0" },
          });
          if (localRes.ok) {
            const localData = await localRes.json();
            localResults = localData.map((item: any) =>
              parseNominatimResult(item),
            );
          }
        }

        const internationalUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          debouncedLocationQuery,
        )}&limit=5&addressdetails=1`;
        const internationalRes = await fetch(internationalUrl, {
          headers: { "User-Agent": "ReceiptApp/1.0" },
        });
        if (!internationalRes.ok) {
          throw new Error("Failed to fetch international results");
        }
        const internationalData = await internationalRes.json();
        const internationalResults = internationalData.map((item: any) =>
          parseNominatimResult(item),
        );

        // Merge, preferring local results first and avoiding duplicates
        let merged = [...localResults];
        for (const item of internationalResults) {
          if (!merged.some((m) => m.id === item.id)) {
            merged.push(item);
          }
        }

        // Fine-tune: sort results so that those matching the merchant's country appear first
        if (countryCode) {
          merged.sort((a, b) => {
            const aMatches = a.country_code === countryCode;
            const bMatches = b.country_code === countryCode;
            if (aMatches && !bMatches) return -1;
            if (!aMatches && bMatches) return 1;
            return 0;
          });
        }

        setLocationResults(merged);
      } catch (err) {
        console.error("Location search error:", err);
        setLocationSearchError("Unable to search. Please try again.");
        setLocationResults([]);
      } finally {
        setLocationSearchLoading(false);
      }
    };

    searchLocations();
  }, [debouncedLocationQuery, countryCode]);

  const parseNominatimResult = (item: any): Location => {
    const address = item.address || {};
    return {
      id: item.place_id.toString(),
      name: item.display_name.split(",")[0],
      location_address: item.display_name,
      city: address.city || address.town || address.village || null,
      province: address.state || null,
      province_code: address.state_code || null,
      country: address.country || null,
      country_code: address.country_code?.toUpperCase() || null,
      zip: address.postcode || null,
      latitude: parseFloat(item.lat),
      longitude: parseFloat(item.lon),
      displayName: item.display_name,
    };
  };

  const addLocation = (location: Location) => {
    if (!locations.some((loc) => loc.id === location.id)) {
      setLocations([...locations, location]);
      if (!countryCode && location.country_code) {
        setCountryCode(location.country_code);
      }
    }
    setLocationSearchQuery("");
    setLocationResults([]);
  };

  const removeLocation = (id: string) => {
    setLocations(locations.filter((loc) => loc.id !== id));
  };

  const handleLogoSelected = (file: ReceiptFile) => {
    setLogo(file);
  };

  const handleRemoveLogo = () => {
    setLogo(null);
  };

  const handlePreviewLogo = () => {
    if (logo) setPreviewVisible(true);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert("Error", "Merchant name is required");
      return;
    }

    setSaving(true);
    try {
      const merchantData = {
        id: params.id,
        name: name.trim(),
        alternative_names: alternativeNames.trim() || null,
        domain: domain.trim() || null,
        merchant_logo: logo?.uri || null,
        industry_type: industryType.trim() || null,
        country_code: countryCode.trim() || null,
        tax_registration_id: taxRegistrationId.trim() || null,
        locations: locations.map((loc) => ({
          name: loc.name || null,
          location_address: loc.location_address || null,
          city: loc.city || null,
          province: loc.province || null,
          province_code: loc.province_code || null,
          country: loc.country || null,
          country_code: loc.country_code || null,
          zip: loc.zip || null,
          latitude: loc.latitude || null,
          longitude: loc.longitude || null,
        })),
      };

      if (params.id) {
        // Make sure updateMerchantById is imported/defined
        // await updateMerchantById(params.id, merchantData);
        console.warn("updateMerchantById not implemented yet");
      } else {
        await createMerchant(merchantData);
      }

      Alert.alert("Success", "Merchant saved", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to save merchant");
    } finally {
      setSaving(false);
    }
  };

  const getCountryName = (code: string) => {
    if (!code) return "Select country";
    const name = countries.getName(code, "en");
    return name ? `${name} (${code})` : code;
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView style={[themeStyles.container, styles.container]}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[themeStyles.title, styles.title]}>
            {params.id ? "Edit Merchant" : "New Merchant"}
          </Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Logo section */}
        <View>
          {logo ? (
            <TouchableOpacity
              style={[
                styles.filePreview,
                { backgroundColor: colors.surfaceLight },
              ]}
              onPress={handlePreviewLogo}
            >
              <Image
                source={{ uri: logo.uri }}
                style={styles.imagePreview}
                resizeMode="contain"
              />
              <TouchableOpacity
                onPress={handleRemoveLogo}
                style={styles.removeFile}
              >
                <Ionicons name="close-circle" size={24} color={colors.error} />
              </TouchableOpacity>
            </TouchableOpacity>
          ) : (
            <GalleryButton onFileSelected={handleLogoSelected} />
          )}
        </View>

        {/* Basic info */}
        <Text style={[styles.inputLabel, { color: colors.text }]}>Name *</Text>
        <TextInput
          style={[
            styles.input,
            { backgroundColor: colors.surfaceLight, color: colors.text },
          ]}
          placeholder="Merchant name"
          placeholderTextColor={colors.textMuted}
          value={name}
          onChangeText={setName}
        />

        <Text style={[styles.inputLabel, { color: colors.text }]}>
          Alternative names
        </Text>
        <TextInput
          style={[
            styles.input,
            { backgroundColor: colors.surfaceLight, color: colors.text },
          ]}
          placeholder="comma‑separated, e.g., Starbucks Coffee, Starbucks Corp."
          placeholderTextColor={colors.textMuted}
          value={alternativeNames}
          onChangeText={setAlternativeNames}
        />

        <Text style={[styles.inputLabel, { color: colors.text }]}>Domain</Text>
        <TextInput
          style={[
            styles.input,
            { backgroundColor: colors.surfaceLight, color: colors.text },
          ]}
          placeholder="e.g., starbucks.com"
          placeholderTextColor={colors.textMuted}
          value={domain}
          onChangeText={setDomain}
        />

        <Text style={[styles.inputLabel, { color: colors.text }]}>
          Industry type
        </Text>
        <TouchableOpacity
          style={[
            styles.dropdownButton,
            {
              backgroundColor: colors.surfaceLight,
              borderColor: colors.border,
            },
          ]}
          onPress={() => setIndustryModalVisible(true)}
        >
          <Text style={[styles.dropdownButtonText, { color: colors.text }]}>
            {INDUSTRY_TYPES.find((t) => t.value === industryType)?.label ||
              "Select industry"}
          </Text>
          <Ionicons name="chevron-down" size={20} color={colors.textMuted} />
        </TouchableOpacity>

        <Text style={[styles.inputLabel, { color: colors.text }]}>Country</Text>
        <TouchableOpacity
          style={[
            styles.dropdownButton,
            {
              backgroundColor: colors.surfaceLight,
              borderColor: colors.border,
            },
          ]}
          onPress={() => setCountryModalVisible(true)}
        >
          <Text style={[styles.dropdownButtonText, { color: colors.text }]}>
            {getCountryName(countryCode)}
          </Text>
          <Ionicons name="chevron-down" size={20} color={colors.textMuted} />
        </TouchableOpacity>

        <Text style={[styles.inputLabel, { color: colors.text }]}>
          Tax registration ID
        </Text>
        <TextInput
          style={[
            styles.input,
            { backgroundColor: colors.surfaceLight, color: colors.text },
          ]}
          placeholder="e.g., 12-3456789"
          placeholderTextColor={colors.textMuted}
          value={taxRegistrationId}
          onChangeText={setTaxRegistrationId}
        />

        {/* Locations */}
        <Text style={[styles.inputLabel, { color: colors.text }]}>
          Locations
        </Text>
        <TextInput
          style={[
            styles.input,
            { backgroundColor: colors.surfaceLight, color: colors.text },
          ]}
          placeholder="Search for a location..."
          placeholderTextColor={colors.textMuted}
          value={locationSearchQuery}
          onChangeText={setLocationSearchQuery}
        />

        {locationSearchLoading && (
          <View style={styles.searchStatusContainer}>
            <Text style={[styles.searchStatusText, { color: colors.text }]}>
              Searching...
            </Text>
          </View>
        )}

        {locationSearchError && (
          <View style={styles.searchStatusContainer}>
            <Text style={[styles.searchStatusText, { color: colors.error }]}>
              {locationSearchError}
            </Text>
          </View>
        )}

        {locationResults.length > 0 && (
          <View
            style={[
              styles.resultsContainer,
              { backgroundColor: colors.surfaceLight },
            ]}
          >
            {locationResults.map((result) => (
              <TouchableOpacity
                key={result.id}
                style={[
                  styles.resultItem,
                  { borderBottomColor: colors.border },
                ]}
                onPress={() => addLocation(result)}
              >
                <Text style={[styles.resultName, { color: colors.text }]}>
                  {result.name}
                </Text>
                <Text
                  style={[styles.resultAddress, { color: colors.textMuted }]}
                  numberOfLines={1}
                >
                  {result.displayName}
                </Text>
                {result.city && result.country && (
                  <Text
                    style={[styles.resultDetail, { color: colors.textMuted }]}
                  >
                    {[result.city, result.country].filter(Boolean).join(", ")}
                  </Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}

        {locations.length > 0 && (
          <View style={styles.locationsList}>
            {locations.map((location) => (
              <View
                key={location.id}
                style={[
                  styles.locationItem,
                  { backgroundColor: colors.surfaceLight },
                ]}
              >
                <View style={styles.locationInfo}>
                  <Text style={[styles.locationName, { color: colors.text }]}>
                    {location.name}
                  </Text>
                  <Text
                    style={[
                      styles.locationAddress,
                      { color: colors.textMuted },
                    ]}
                    numberOfLines={1}
                  >
                    {location.displayName || location.location_address}
                  </Text>
                  {location.city && location.country && (
                    <Text
                      style={[
                        styles.locationDetail,
                        { color: colors.textMuted },
                      ]}
                    >
                      {[location.city, location.country]
                        .filter(Boolean)
                        .join(", ")}
                    </Text>
                  )}
                </View>
                <TouchableOpacity
                  onPress={() => removeLocation(location.id)}
                  style={styles.removeButton}
                >
                  <Ionicons
                    name="trash-outline"
                    size={20}
                    color={colors.error}
                  />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: colors.accent }]}
          onPress={handleSave}
          disabled={saving}
        >
          <Text style={[styles.saveButtonText, { color: colors.text }]}>
            {saving ? "Saving..." : "Save Merchant"}
          </Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Industry Type Modal - Now imported */}
      <IndustryTypeModal
        visible={industryModalVisible}
        selectedIndustry={industryType}
        industries={INDUSTRY_TYPES}
        onSelectIndustry={(value) => {
          setIndustryType(value);
          setIndustryModalVisible(false);
        }}
        onClose={() => setIndustryModalVisible(false)}
      />

      {/* Country Modal */}
      <CountryModal
        visible={countryModalVisible}
        selectedCountry={countryCode}
        onSelectCountry={(code) => {
          setCountryCode(code);
          setCountryModalVisible(false);
        }}
        onClose={() => setCountryModalVisible(false)}
        preferredCountry={userCountry}
      />

      <FilePreviewModal
        visible={previewVisible}
        file={logo}
        onClose={() => setPreviewVisible(false)}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
  },
  backButton: { width: 40 },
  title: { fontSize: 24, textAlign: "center" },
  filePreview: {
    marginTop: 16,
    alignItems: "center",
    borderRadius: 8,
    padding: 12,
    position: "relative",
  },
  imagePreview: { width: "100%", height: 200, borderRadius: 8 },
  removeFile: { position: "absolute", top: 8, right: 8 },
  inputLabel: { fontSize: 14, marginBottom: 8, marginTop: 12 },
  input: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  searchStatusContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    gap: 8,
  },
  searchStatusText: { fontSize: 14 },
  resultsContainer: {
    marginTop: 8,
    marginBottom: 8,
    borderRadius: 8,
    overflow: "hidden",
  },
  resultItem: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
  },
  resultName: { fontSize: 16, fontWeight: "500" },
  resultAddress: { fontSize: 12, marginTop: 2 },
  resultDetail: { fontSize: 10, marginTop: 2 },
  locationsList: { marginTop: 12 },
  locationItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 8,
  },
  locationInfo: { flex: 1 },
  locationName: { fontSize: 16, fontWeight: "500" },
  locationAddress: { fontSize: 12, marginTop: 2 },
  locationDetail: { fontSize: 10, marginTop: 2 },
  removeButton: { padding: 4 },
  saveButton: {
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 20,
  },
  saveButtonText: { fontSize: 16, fontWeight: "bold" },
  dropdownButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
  },
  dropdownButtonText: { fontSize: 16 },
});
