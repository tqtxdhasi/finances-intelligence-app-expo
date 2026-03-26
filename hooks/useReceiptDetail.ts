import { Receipt, ReceiptItem, UpdateReceiptDTO } from "@/types/receipt";
import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { deleteReceiptById } from "./receipt/deleteReceiptById";
import { getReceiptById } from "./receipt/getReceiptById";
import { updateReceiptById } from "./receipt/updateReceiptById";

interface EditableItem {
  id: string;
  name: string;
  quantity: string;
  unit: string;
  price: string;
}

interface EditableReceipt {
  merchant: string;
  date: string;
  time: string;
  currency: string;
  items: EditableItem[];
}

export const useReceiptDetail = (id: string) => {
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [editData, setEditData] = useState<EditableReceipt | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const loadReceipt = async () => {
    setLoading(true);
    try {
      const data = await getReceiptById(id);
      if (data) {
        setReceipt(data);
        setEditData({
          merchant: data.merchant,
          date: data.date.split("T")[0],
          time: data.time || "",
          currency: data.currency,
          items: data.items.map((item: ReceiptItem) => ({
            id: item.id,
            name: item.name,
            quantity: item.quantity.toString(),
            unit: item.unit,
            price: item.price.toString(),
          })),
        });
      } else {
        Alert.alert("Error", "Receipt not found");
        return false;
      }
    } catch (error) {
      console.error("Failed to load receipt:", error);
      Alert.alert("Error", "Failed to load receipt");
      return false;
    } finally {
      setLoading(false);
    }
    return true;
  };

  const handleSave = async () => {
    if (!editData) return;
    if (!editData.merchant.trim()) {
      Alert.alert("Error", "Merchant name is required");
      return;
    }

    setSaving(true);
    try {
      const total = editData.items.reduce(
        (sum, item) => sum + parseFloat(item.quantity) * parseFloat(item.price),
        0,
      );
      const updateDto: UpdateReceiptDTO = {
        merchant: editData.merchant,
        date: editData.date,
        time: editData.time || undefined,
        currency: editData.currency,
        total,
        items: editData.items.map((item) => ({
          id: item.id.startsWith("temp-") ? undefined : item.id,
          name: item.name,
          quantity: parseFloat(item.quantity),
          unit: item.unit,
          price: parseFloat(item.price),
        })),
      };
      const updated = await updateReceiptById(id, updateDto);
      setReceipt(updated);
      setEditData({
        merchant: updated.merchant,
        date: updated.date.split("T")[0],
        time: updated.time || "",
        currency: updated.currency,
        items: updated.items.map((item: ReceiptItem) => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity.toString(),
          unit: item.unit,
          price: item.price.toString(),
        })),
      });
      setIsEditing(false);
      Alert.alert("Success", "Receipt updated successfully");
    } catch (error) {
      console.error("Failed to update receipt:", error);
      Alert.alert("Error", "Failed to update receipt");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (onSuccess?: () => void) => {
    Alert.alert(
      "Delete Receipt",
      "Are you sure you want to delete this receipt? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            setLoading(true);
            try {
              await deleteReceiptById(id);
              Alert.alert("Success", "Receipt deleted successfully", [
                { text: "OK", onPress: onSuccess },
              ]);
            } catch (error) {
              console.error("Failed to delete receipt:", error);
              Alert.alert("Error", "Failed to delete receipt");
              setLoading(false);
            }
          },
        },
      ],
    );
  };

  const startEditing = () => setIsEditing(true);
  const cancelEditing = () => {
    if (receipt && editData) {
      setEditData({
        merchant: receipt.merchant,
        date: receipt.date.split("T")[0],
        time: receipt.time || "",
        currency: receipt.currency,
        items: receipt.items.map((item: ReceiptItem) => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity.toString(),
          unit: item.unit,
          price: item.price.toString(),
        })),
      });
    }
    setIsEditing(false);
  };

  const updateItem = (
    itemId: string,
    field: keyof EditableItem,
    value: string,
  ) => {
    if (!editData) return;
    setEditData({
      ...editData,
      items: editData.items.map((item) =>
        item.id === itemId ? { ...item, [field]: value } : item,
      ),
    });
  };

  const addItem = () => {
    if (!editData) return;
    const newItem: EditableItem = {
      id: `temp-${Date.now()}`,
      name: "",
      quantity: "1",
      unit: "pcs",
      price: "",
    };
    setEditData({
      ...editData,
      items: [...editData.items, newItem],
    });
  };

  const removeItem = (itemId: string) => {
    if (!editData) return;
    if (editData.items.length === 1) {
      Alert.alert("Cannot Remove", "At least one item is required");
      return;
    }
    setEditData({
      ...editData,
      items: editData.items.filter((item) => item.id !== itemId),
    });
  };

  const calculateTotal = (): string => {
    if (!editData) return "0.00";
    const sum = editData.items.reduce((acc, item) => {
      const price = parseFloat(item.price) || 0;
      const qty = parseFloat(item.quantity) || 0;
      return acc + price * qty;
    }, 0);
    return sum.toFixed(2);
  };

  useEffect(() => {
    if (id) loadReceipt();
  }, [id]);

  return {
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
  };
};
