import { useTheme } from "@/utils/theme";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React from "react";
import { Alert, Text, TouchableOpacity } from "react-native";

interface Props {
  onFileSelected: (file: { uri: string; type: string; name: string }) => void;
}

export default function GalleryButton({ onFileSelected }: Props) {
  const { colors } = useTheme();

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed", "Please grant camera roll permissions");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 1,
      allowsEditing: false,
    });

    if (!result.canceled && result.assets[0]) {
      onFileSelected({
        uri: result.assets[0].uri,
        type: "image/jpeg",
        name: result.assets[0].fileName || "receipt.jpg",
      });
    }
  };

  return (
    <TouchableOpacity
      style={[styles.fileButton, { backgroundColor: colors.surfaceLight }]}
      onPress={pickImage}
    >
      <Ionicons name="images" size={24} color={colors.accent} />
      <Text style={[styles.fileButtonText, { color: colors.text }]}>
        Gallery
      </Text>
    </TouchableOpacity>
  );
}

const styles = {
  fileButton: {
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
  },
  fileButtonText: {
    marginTop: 8,
    fontSize: 12,
  },
};
