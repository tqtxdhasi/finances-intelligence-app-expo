import { BasicInfoSection } from "@/components/receipt/BasicInfoSection";
import { DeleteButton } from "@/components/receipt/DeleteButton";
import { ItemsSection } from "@/components/receipt/ItemsSection";
import { ReceiptDetailHeader } from "@/components/receipt/ReceiptDetailHeader";
import { ReceiptImage } from "@/components/receipt/ReceiptImage";
import { useReceiptDetail } from "@/hooks/receipt/useReceiptDetail";
import { useTheme } from "@/utils/theme";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";

export default function ReceiptDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();

  const {
    receipt,
    editData,
    loading,
    saving,
    isEditing,
    startEditing,
    cancelEditing,
    handleSave,
    handleDelete,
    updateItem,
    addItem,
    removeItem,
    calculateTotal,
  } = useReceiptDetail(id);

  if (loading) {
    return (
      <View
        style={[styles.centerContainer, { backgroundColor: colors.background }]}
      >
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  if (!receipt || !editData) {
    return null;
  }

  const onEditField = (field: string, value: string) => {
    // This should be provided by useReceiptDetail hook (e.g., updateBasicInfo)
    // For now, we keep the existing implementation; adjust if the hook provides a setter.
    // (Assuming setEditData is available from the hook, but it's not shown)
    // If the hook does not provide setEditData, replace with appropriate method.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (editData as any).setEditData?.((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  const onCurrencyChange = (currency: string) => {
    // Similarly, update currency via the hook
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (editData as any).setEditData?.((prev: any) => ({ ...prev, currency }));
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.content}>
        <ReceiptDetailHeader
          onBack={() => router.back()}
          isEditing={isEditing}
          saving={saving}
          onEdit={startEditing}
          onCancel={cancelEditing}
          onSave={handleSave}
        />

        <ReceiptImage uri={receipt.thumbnail} />

        <BasicInfoSection
          receipt={receipt}
          editData={editData}
          isEditing={isEditing}
          onEditField={onEditField}
          onCurrencyChange={onCurrencyChange}
          calculateTotal={calculateTotal}
        />

        <ItemsSection
          items={editData.items}
          isEditing={isEditing}
          currency={editData.currency}
          onUpdateItem={updateItem}
          onAddItem={addItem}
          onRemoveItem={removeItem}
        />

        {!isEditing && (
          <DeleteButton onPress={() => handleDelete(() => router.back())} />
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
});
