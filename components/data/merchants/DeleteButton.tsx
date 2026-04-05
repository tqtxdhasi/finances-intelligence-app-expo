// components/merchants/DeleteButton.tsx
import { deleteMerchantById } from "@/hooks/merchant/deleteMerchantById";
import { Merchant } from "@/types/data";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Alert, StyleSheet, TouchableOpacity } from "react-native";

interface DeleteButtonProps {
  merchant: Merchant;
  onDeleteSuccess: () => void;
  errorColor: string;
}

export const DeleteButton: React.FC<DeleteButtonProps> = ({
  merchant,
  onDeleteSuccess,
  errorColor,
}) => {
  const handleDeleteMerchant = async () => {
    try {
      await deleteMerchantById(merchant.id);
      onDeleteSuccess(); // Refresh the list
    } catch (err) {
      console.error("Delete failed", err);
      Alert.alert("Error", "Failed to delete merchant.");
    }
  };

  const handleDeletePress = () => {
    Alert.alert(
      "Delete Merchant",
      `Are you sure you want to delete "${merchant.name}"? This will also delete all associated receipts and locations.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: handleDeleteMerchant,
        },
      ],
    );
  };

  return (
    <TouchableOpacity onPress={handleDeletePress} style={styles.actionButton}>
      <Ionicons name="trash-outline" size={20} color={errorColor} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  actionButton: {
    padding: 8,
  },
});
