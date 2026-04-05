// app/screens/AddScreen.tsx
import FilePreviewModal from "@/components/add/FilePreviewModal";
import { useCreateReceipt } from "@/hooks/receipt/createReceipt";
import { useSettingsStore } from "@/stores/settingsStore";
import { ReceiptItem } from "@/types/data";
import { useTheme } from "@/utils/theme";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
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
import FileUploadSection from "../../components/add/FileUploadSection";
import { useUser } from "../../hooks/useUser";
import { CreateReceiptDTO, ReceiptFile } from "../../types/receipt";

export default function AddScreen() {
  const router = useRouter();
  const { createReceipt, loading: saving } = useCreateReceipt();
  const { colors, styles: themeStyles } = useTheme();
  const { currency: userCurrency } = useSettingsStore();
  const { userId, loading: userLoading } = useUser(); // ✅ get userId

  // Form state
  const [selectedMerchantId, setSelectedMerchantId] = useState<string | null>(
    null,
  );
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(
    null,
  );
  const [merchantName, setMerchantName] = useState("");
  const [merchantAddress, setMerchantAddress] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [time, setTime] = useState("");
  const [originalCurrency, setOriginalCurrency] = useState(
    userCurrency || "USD",
  );
  const [file, setFile] = useState<ReceiptFile | null>(null);
  const [receiptItems, setReceiptItems] = useState<ReceiptItem[]>([
    {
      id: Date.now().toString(),
      name: "",
      quantity: 1,
      unit: "pcs",
      price: "",
    },
  ]);
  const [previewModalVisible, setPreviewModalVisible] = useState(false);

  // Keep local currency in sync with store currency
  useEffect(() => {
    setOriginalCurrency(userCurrency || "USD");
  }, [userCurrency]);

  // Item handlers
  const addNewReceiptItem = () => {
    const newReceiptItem: ReceiptItem = {
      id: Date.now().toString(),
      name: "",
      quantity: 1,
      unit: "pcs",
      price: "",
    };
    setReceiptItems([...receiptItems, newReceiptItem]);
  };

  const removeReceiptItem = (id: string) => {
    if (receiptItems.length === 1) {
      Alert.alert("Cannot Remove", "At least one receipt item is required");
      return;
    }
    setReceiptItems(
      receiptItems.filter((receiptItem) => receiptItem.id !== id),
    );
  };

  const updateReceiptItem = (id: string, updates: Partial<ReceiptItem>) => {
    setReceiptItems(
      receiptItems.map((receiptItem) =>
        receiptItem.id === id ? { ...receiptItem, ...updates } : receiptItem,
      ),
    );
  };

  // Total calculation
  const calculateTotal = () => {
    const sum = receiptItems.reduce((acc, receiptItem) => {
      const price = parseFloat(receiptItem.price) || 0;
      const quantity = parseFloat(receiptItem.quantity) || 0;
      return acc + price * quantity;
    }, 0);
    return sum.toFixed(2);
  };

  const originalTotal = calculateTotal();

  // Merchant handler
  const handleSelectMerchant = (merchant: {
    id: string;
    name: string;
    address: string;
    locationId?: string;
  }) => {
    setMerchantName(merchant.name);
    setMerchantAddress(merchant.address);
    setSelectedMerchantId(merchant.id);
    setSelectedLocationId(merchant.locationId || null);
  };

  // Validation and save
  const validateForm = () => {
    if (!merchantName.trim()) {
      Alert.alert("Error", "Merchant name is required");
      return false;
    }
    if (!selectedMerchantId) {
      Alert.alert("Error", "Please select a merchant from the list");
      return false;
    }
    if (!date) {
      Alert.alert("Error", "Date is required");
      return false;
    }
    if (receiptItems.length === 0) {
      Alert.alert("Error", "At least one item is required");
      return false;
    }
    for (const receiptItem of receiptItems) {
      if (!receiptItem.name.trim()) {
        Alert.alert("Error", "All receipt items must have a name");
        return false;
      }
      if (!receiptItem.price || parseFloat(receiptItem.price) <= 0) {
        Alert.alert("Error", "All items must have a valid price");
        return false;
      }
    }
    return true;
  };

  const saveReceipt = async () => {
    if (!userId) {
      Alert.alert("Error", "User not initialized. Please restart the app.");
      return;
    }
    if (!validateForm()) return;

    try {
      const dateTimeStr = time
        ? `${date}T${time}:00.000Z`
        : `${date}T00:00:00.000Z`;

      const subtotal = parseFloat(originalTotal);
      const tax = 0;
      const total = subtotal + tax;

      const receiptItems = receiptItems.map((receiptItem) => ({
        rawName: receiptItem.name,
        quantity: parseFloat(receiptItem.quantity),
        unitPrice: parseFloat(receiptItem.price),
        totalPrice:
          parseFloat(receiptItem.price) * parseFloat(receiptItem.quantity),
        discountAmount: 0,
        unitOfMeasure: receiptItem.unit,
      }));

      const receiptData: CreateReceiptDTO = {
        userId,
        merchantId: selectedMerchantId!,
        locationId: selectedLocationId || undefined, // Note: use undefined, not null
        date: dateTimeStr,
        subtotalAmount: subtotal,
        taxAmount: tax,
        totalAmount: total,
        currency: originalCurrency,
        paymentType: undefined,
        items: receiptItems,
        imagePath: file?.uri,
      };

      console.log("📦 Sending receipt data:", receiptData);
      await createReceipt(receiptData);

      // Reset form and navigate back
      setMerchantName("");
      setSelectedMerchantId(null);
      setSelectedLocationId(null);
      setDate(new Date().toISOString().split("T")[0]);
      setTime("");
      setOriginalCurrency(userCurrency || "USD");
      setFile(null);
      setReceiptItems([
        {
          id: Date.now().toString(),
          name: "",
          quantity: 1,
          unit: "pcs",
          price: "",
        },
      ]);
      router.back();
    } catch (error) {
      // Error is already handled in the hook
      console.error("Save failed:", error);
    }
  };

  // Optional loading state while user is being initialised
  if (userLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        style={[themeStyles.container, styles.container]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
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
            merchantAddress={merchantAddress}
            onMerchantSelect={handleSelectMerchant}
            date={date}
            onDateChange={setDate}
            time={time}
            onTimeChange={setTime}
            originalCurrency={originalCurrency}
            onCurrencyChange={setOriginalCurrency}
            originalTotal={originalTotal}
            preferredCurrency={userCurrency}
          />

          <ReceiptItemsSection
            receiptItems={receiptItems}
            onAddReceiptItem={addNewReceiptItem}
            onUpdateReceiptItem={updateReceiptItem}
            onRemoveReceiptItem={removeReceiptItem}
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
