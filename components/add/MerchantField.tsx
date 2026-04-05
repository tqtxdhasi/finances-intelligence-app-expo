// components/add/MerchantField.tsx
import { useTheme } from "@/utils/theme";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MerchantSelectorModal from "./MerchantSelectorModal";

interface Props {
  merchantName: string;
  merchantAddress: string;
  onMerchantSelect: (merchant: {
    id: string;
    name: string;
    address: string;
    locationId?: string;
  }) => void;
}

export default function MerchantField({
  merchantName,
  merchantAddress,
  onMerchantSelect,
}: Props) {
  const { colors } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);

  const handleSelectMerchant = (merchant: {
    id: string;
    name: string;
    address: string;
    locationId?: string;
  }) => {
    onMerchantSelect(merchant);
    setModalVisible(false);
  };

  return (
    <>
      <View>
        <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
          Merchant *
        </Text>
        <TouchableOpacity
          style={[styles.selector, { backgroundColor: colors.surfaceLight }]}
          onPress={() => setModalVisible(true)}
        >
          <Text style={[styles.selectorText, { color: colors.text }]}>
            {merchantName || "Select Merchant"}
          </Text>
          <Ionicons
            name="chevron-down"
            size={20}
            color={colors.textSecondary}
          />
        </TouchableOpacity>

        <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
          Location
        </Text>
        <View
          style={[
            styles.addressField,
            { backgroundColor: colors.surfaceLight },
          ]}
        >
          <Text
            style={[styles.addressText, { color: colors.text }]}
            numberOfLines={2}
          >
            {merchantAddress || "No location selected"}
          </Text>
        </View>
      </View>

      <MerchantSelectorModal
        visible={modalVisible}
        onSelectMerchant={handleSelectMerchant}
        onClose={() => setModalVisible(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  inputLabel: {
    fontSize: 14,
    marginBottom: 8,
    marginTop: 12,
  },
  selector: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectorText: {
    fontSize: 16,
  },
  addressField: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 8,
  },
  addressText: {
    fontSize: 14,
    lineHeight: 20,
  },
});
