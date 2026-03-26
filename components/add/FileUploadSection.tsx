import { useTheme } from "@/utils/theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { ReceiptFile } from "../../types/receipt";
import CameraButton from "./CameraButton";
import GalleryButton from "./GalleryButton";

interface Props {
  file: ReceiptFile | null;
  onFileSelected: (file: ReceiptFile) => void;
  onRemoveFile: () => void;
  onPreviewPress: () => void;
}

export default function FileUploadSection({
  file,
  onFileSelected,
  onRemoveFile,
  onPreviewPress,
}: Props) {
  const { colors, styles: themeStyles } = useTheme();

  return (
    <View
      style={[
        styles.section,
        { backgroundColor: colors.surface, borderColor: colors.border },
      ]}
    >
      <Text style={[themeStyles.title, styles.sectionTitle]}>
        Receipt Image (Optional)
      </Text>

      <View style={styles.fileButtons}>
        <CameraButton onFileSelected={onFileSelected} />
        <GalleryButton onFileSelected={onFileSelected} />
      </View>

      {file && (
        <TouchableOpacity
          style={[styles.filePreview, { backgroundColor: colors.surfaceLight }]}
          onPress={onPreviewPress}
        >
          <Image source={{ uri: file.uri }} style={styles.imagePreview} />
          <TouchableOpacity onPress={onRemoveFile} style={styles.removeFile}>
            <Ionicons name="close-circle" size={24} color={colors.error} />
          </TouchableOpacity>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = {
  section: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 16,
  },
  fileButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
  },
  filePreview: {
    marginTop: 16,
    alignItems: "center",
    borderRadius: 8,
    padding: 12,
    position: "relative",
  },
  imagePreview: {
    width: "100%",
    height: 200,
    borderRadius: 8,
  },
  removeFile: {
    position: "absolute",
    top: 8,
    right: 8,
  },
};
