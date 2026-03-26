import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

interface Props {
  onFileSelected: (file: { uri: string; type: string; name: string }) => void;
}

export default function PDFButton({ onFileSelected }: Props) {
  const pickPDF = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "application/pdf",
    });

    if (result.assets && result.assets[0]) {
      onFileSelected({
        uri: result.assets[0].uri,
        type: "application/pdf",
        name: result.assets[0].name,
      });
    }
  };

  return (
    <TouchableOpacity style={styles.fileButton} onPress={pickPDF}>
      <Ionicons name="document-text" size={24} color="#ff9800" />
      <Text style={styles.fileButtonText}>PDF</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fileButton: {
    alignItems: "center",
    padding: 12,
    backgroundColor: "#2a2a2a",
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
  },
  fileButtonText: {
    color: "#fff",
    marginTop: 8,
    fontSize: 12,
  },
});
