// app/screens/AddScreen.tsx
import FilePreviewModal from "@/components/add/FilePreviewModal";
import { useSettingsStore } from "@/stores/settingsStore";
import { useTheme } from "@/utils/theme";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import BasicInfoSection from "../../components/add/BasicInfoSection";
import CurrencyModal from "../../components/add/CurrencyModal";
import DatePickerModal from "../../components/add/DatePickerModal";
import FileUploadSection from "../../components/add/FileUploadSection";
import ItemsSection from "../../components/add/ItemsSection";
import MerchantModal from "../../components/add/MerchantModal";
import TimePickerModal from "../../components/add/TimePickerModal";
import { useReceiptsD1 } from "../../hooks/useReceipts";
import { Item, ReceiptFile } from "../../types/receipt";

export default function AddScreen() {
  const router = useRouter();
  const { createReceipt } = useReceiptsD1();
  const { colors, styles: themeStyles } = useTheme();
  const { currency: userCurrency } = useSettingsStore(); // 👈 get saved currency

  // Form state
  const [merchantName, setMerchantName] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [time, setTime] = useState("");
  const [originalCurrency, setOriginalCurrency] = useState(
    userCurrency || "USD",
  );
  const [originalTotal, setOriginalTotal] = useState("");
  const [file, setFile] = useState<ReceiptFile | null>(null);
  const [items, setItems] = useState<Item[]>([
    {
      id: Date.now().toString(),
      name: "",
      quantity: "1",
      unit: "pcs",
      price: "",
    },
  ]);
  const [saving, setSaving] = useState(false);

  // Keep local currency in sync with store currency
  useEffect(() => {
    setOriginalCurrency(userCurrency || "USD");
  }, [userCurrency]);

  // Modal visibility
  const [currencyModalVisible, setCurrencyModalVisible] = useState(false);
  const [showDatePickerModal, setShowDatePickerModal] = useState(false);
  const [showTimePickerModal, setShowTimePickerModal] = useState(false);
  const [merchantModalVisible, setMerchantModalVisible] = useState(false);
  const [previewModalVisible, setPreviewModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<Date>(new Date());

  // Item handlers
  const addNewItem = () => {
    const newItem: Item = {
      id: Date.now().toString(),
      name: "",
      quantity: "1",
      unit: "pcs",
      price: "",
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    if (items.length === 1) {
      Alert.alert("Cannot Remove", "At least one item is required");
      return;
    }
    setItems(items.filter((item) => item.id !== id));
  };

  const updateItem = (id: string, updates: Partial<Item>) => {
    setItems(
      items.map((item) => (item.id === id ? { ...item, ...updates } : item)),
    );
  };

  // Total calculation
  const calculateTotal = () => {
    const sum = items.reduce((acc, item) => {
      const price = parseFloat(item.price) || 0;
      const quantity = parseFloat(item.quantity) || 0;
      return acc + price * quantity;
    }, 0);
    return sum.toFixed(2);
  };

  useEffect(() => {
    setOriginalTotal(calculateTotal());
  }, [items]);

  // Date/Time handlers
  const onDateChange = (event: any, selectedDate?: Date) => {
    if (selectedDate) setSelectedDate(selectedDate);
  };

  const confirmDate = () => {
    const year = selectedDate.getFullYear();
    const month = (selectedDate.getMonth() + 1).toString().padStart(2, "0");
    const day = selectedDate.getDate().toString().padStart(2, "0");
    setDate(`${year}-${month}-${day}`);
    setShowDatePickerModal(false);
  };

  const cancelDate = () => setShowDatePickerModal(false);

  const onTimeChange = (event: any, selectedDate?: Date) => {
    if (selectedDate) setSelectedTime(selectedDate);
  };

  const confirmTime = () => {
    const hours = selectedTime.getHours().toString().padStart(2, "0");
    const minutes = selectedTime.getMinutes().toString().padStart(2, "0");
    setTime(`${hours}:${minutes}`);
    setShowTimePickerModal(false);
  };

  const cancelTime = () => setShowTimePickerModal(false);

  // Currency handler
  const selectCurrency = (currency: string) => {
    setOriginalCurrency(currency);
    setCurrencyModalVisible(false);
  };

  // Merchant handler
  const handleSelectMerchant = (merchant: {
    name: string;
    address: string;
  }) => {
    setMerchantName(merchant.name);
  };

  // Validation and save
  const validateForm = () => {
    if (!merchantName.trim()) {
      Alert.alert("Error", "Merchant name is required");
      return false;
    }
    if (!date) {
      Alert.alert("Error", "Date is required");
      return false;
    }
    if (items.length === 0) {
      Alert.alert("Error", "At least one item is required");
      return false;
    }
    for (const item of items) {
      if (!item.name.trim()) {
        Alert.alert("Error", "All items must have a name");
        return false;
      }
      if (!item.price || parseFloat(item.price) <= 0) {
        Alert.alert("Error", "All items must have a valid price");
        return false;
      }
    }
    return true;
  };

  const saveReceipt = async () => {
    if (!validateForm()) return;

    setSaving(true);
    try {
      const receiptData = {
        merchant: merchantName,
        date,
        time: time || undefined,
        currency: originalCurrency,
        items: items.map((item) => ({
          name: item.name,
          quantity: parseFloat(item.quantity),
          unit: item.unit,
          price: parseFloat(item.price),
        })),
        file: file
          ? {
              uri: file.uri,
              type: file.type,
              name: file.name,
            }
          : null,
      };

      await createReceipt(receiptData);

      Alert.alert("Success", "Receipt saved successfully!", [
        {
          text: "OK",
          onPress: () => {
            // Reset form
            setMerchantName("");
            setDate(new Date().toISOString().split("T")[0]);
            setTime("");
            setOriginalCurrency(userCurrency || "USD");
            setFile(null);
            setItems([
              {
                id: Date.now().toString(),
                name: "",
                quantity: "1",
                unit: "pcs",
                price: "",
              },
            ]);
            setSaving(false);
            router.back();
          },
        },
      ]);
    } catch (error) {
      console.error("Failed to save receipt:", error);
      Alert.alert(
        "Error",
        "Failed to save receipt. Please check your connection and try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        style={[themeStyles.container, styles.container]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled" // Dismiss keyboard when tapping outside
      >
        <View style={styles.content}>
          <Text style={[themeStyles.title, styles.title]}>Add New Receipt</Text>
          <FileUploadSection
            file={file}
            onFileSelected={setFile}
            onRemoveFile={() => setFile(null)}
            onPreviewPress={() => setPreviewModalVisible(true)}
          />

          <BasicInfoSection
            merchantName={merchantName}
            onMerchantPress={() => setMerchantModalVisible(true)}
            date={date}
            onDatePress={() => setShowDatePickerModal(true)}
            time={time}
            onTimePress={() => setShowTimePickerModal(true)}
            originalCurrency={originalCurrency}
            onCurrencyPress={() => setCurrencyModalVisible(true)}
            originalTotal={originalTotal}
          />

          <ItemsSection
            items={items}
            onAddItem={addNewItem}
            onUpdateItem={updateItem}
            onRemoveItem={removeItem}
            originalCurrency={originalCurrency}
          />

          <TouchableOpacity
            style={[
              styles.saveButton,
              { backgroundColor: colors.accent },
              saving && styles.saveButtonDisabled,
            ]}
            onPress={saveReceipt}
            disabled={saving}
          >
            <Text style={[styles.saveButtonText, { color: colors.text }]}>
              {saving ? "Saving..." : "Save Receipt"}
            </Text>
          </TouchableOpacity>

          <View style={styles.bottomSpacer} />
        </View>

        <CurrencyModal
          visible={currencyModalVisible}
          selectedCurrency={originalCurrency}
          onSelectCurrency={selectCurrency}
          onClose={() => setCurrencyModalVisible(false)}
          preferredCurrency={userCurrency} // 👈 show user's currency at top
        />
        <DatePickerModal
          visible={showDatePickerModal}
          selectedDate={selectedDate}
          onDateChange={onDateChange}
          onConfirm={confirmDate}
          onCancel={cancelDate}
        />
        <TimePickerModal
          visible={showTimePickerModal}
          selectedTime={selectedTime}
          onTimeChange={onTimeChange}
          onConfirm={confirmTime}
          onCancel={cancelTime}
        />
        <MerchantModal
          visible={merchantModalVisible}
          onSelectMerchant={handleSelectMerchant}
          onClose={() => setMerchantModalVisible(false)}
        />
        <FilePreviewModal
          visible={previewModalVisible}
          file={file}
          onClose={() => setPreviewModalVisible(false)}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 24,
  },
  saveButton: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  bottomSpacer: {
    height: 40,
  },
});
