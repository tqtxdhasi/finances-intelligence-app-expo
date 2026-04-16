import { useTheme } from "@/utils/theme";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import CurrencyModal from "../add/CurrencyModal";

interface Props {
  receipt: any;
  editData: {
    merchant: string;
    date: string;
    time: string;
    currency: string;
  };
  isEditing: boolean;
  onEditField: (field: string, value: string) => void;
  onCurrencyChange: (currency: string) => void;
  calculateTotal: () => string;
}

export const BasicInfoSection: React.FC<Props> = ({
  receipt,
  editData,
  isEditing,
  onEditField,
  onCurrencyChange,
  calculateTotal,
}) => {
  const { colors } = useTheme();
  const [currencyModalVisible, setCurrencyModalVisible] = useState(false);

  return (
    <View style={[styles.section, { backgroundColor: colors.surface }]}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        Basic Information
      </Text>

      <View style={styles.infoRow}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>
          Merchant
        </Text>
        {isEditing ? (
          <TextInput
            style={[
              styles.editInput,
              { backgroundColor: colors.surfaceLight, color: colors.text },
            ]}
            value={editData.merchant}
            onChangeText={(text) => onEditField("merchant", text)}
            placeholder="Merchant name"
            placeholderTextColor={colors.textMuted}
          />
        ) : (
          <Text style={[{ color: colors.text }]}>{receipt.merchant}</Text>
        )}
      </View>

      <View style={styles.dateTimeSection}>
        <View style={styles.dateTimeField}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>
            Date
          </Text>
          {isEditing ? (
            <TextInput
              style={[
                styles.editInput,
                { backgroundColor: colors.surfaceLight, color: colors.text },
              ]}
              value={editData.date}
              onChangeText={(text) => onEditField("date", text)}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={colors.textMuted}
            />
          ) : (
            <Text style={[{ color: colors.text }]}>{receipt.date}</Text>
          )}
        </View>

        <View style={styles.dateTimeField}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>
            Time
          </Text>
          {isEditing ? (
            <TextInput
              style={[
                styles.editInput,
                { backgroundColor: colors.surfaceLight, color: colors.text },
              ]}
              value={editData.time}
              onChangeText={(text) => onEditField("time", text)}
              placeholder="HH:MM:SS"
              placeholderTextColor={colors.textMuted}
            />
          ) : (
            <Text style={[{ color: colors.text }]}>{receipt.time}</Text>
          )}
        </View>
      </View>

      <View style={styles.currencyTotalRow}>
        <View style={styles.currencyField}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>
            Currency
          </Text>
          {isEditing ? (
            <>
              <TouchableOpacity
                style={[
                  styles.currencySelector,
                  {
                    backgroundColor: colors.surfaceLight,
                    borderColor: colors.border,
                  },
                ]}
                onPress={() => setCurrencyModalVisible(true)}
              >
                <Text
                  style={[styles.currencySelectorText, { color: colors.text }]}
                >
                  {editData.currency}
                </Text>
                <Ionicons
                  name="chevron-down"
                  size={20}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
              <CurrencyModal
                visible={currencyModalVisible}
                selectedCurrency={editData.currency}
                onSelectCurrency={(code) => {
                  onCurrencyChange(code);
                  setCurrencyModalVisible(false);
                }}
                onClose={() => setCurrencyModalVisible(false)}
                preferredCurrency={editData.currency}
              />
            </>
          ) : (
            <Text style={[{ color: colors.text }]}>{receipt.currency}</Text>
          )}
        </View>
        <View style={styles.totalField}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>
            Total
          </Text>
          <Text style={[styles.total, { color: colors.accent }]}>
            {isEditing ? calculateTotal() : receipt.total_amount.toFixed(2)}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
    borderRadius: 12,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  infoRow: {
    marginBottom: 16,
  },
  dateTimeSection: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  dateTimeField: {
    flex: 1,
  },
  currencyTotalRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 0,
  },
  currencyField: {
    flex: 1,
  },
  totalField: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
  },

  total: {
    alignItems: "center",
    fontSize: 20,
    fontWeight: "bold",
  },
  editInput: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  currencySelector: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderRadius: 8,
  },
  currencySelectorText: {
    fontSize: 16,
  },
});
