import { useTheme } from "@/utils/theme";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React from "react";
import { Alert, Text, TouchableOpacity } from "react-native";

interface Props {
  onFileSelected: (file: { uri: string; type: string; name: string }) => void;
}

export default function CameraButton({ onFileSelected }: Props) {
  const { colors } = useTheme();

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed", "Please grant camera permissions");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      quality: 1,
      allowsEditing: false,
    });

    if (!result.canceled && result.assets[0]) {
      onFileSelected({
        uri: result.assets[0].uri,
        type: "image/jpeg",
        name: "photo.jpg",
      });
    }
  };

  return (
    <TouchableOpacity
      style={[styles.fileButton, { backgroundColor: colors.surfaceLight }]}
      onPress={takePhoto}
    >
      <Ionicons name="camera" size={24} color={colors.accent} />
      <Text style={[styles.fileButtonText, { color: colors.text }]}>
        Camera
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
