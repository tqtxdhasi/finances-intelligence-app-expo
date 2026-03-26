// components/add/FilePreviewModal.tsx (already image-only)
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Dimensions,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ReceiptFile } from "../../types/receipt";

interface Props {
  visible: boolean;
  file: ReceiptFile | null;
  onClose: () => void;
}

const { width, height } = Dimensions.get("window");

export default function FilePreviewModal({ visible, file, onClose }: Props) {
  if (!file) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Preview</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={28} color="#fff" />
            </TouchableOpacity>
          </View>

          <ScrollView
            contentContainerStyle={styles.imageScroll}
            minimumZoomScale={1}
            maximumZoomScale={3}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
          >
            <Image
              source={{ uri: file.uri }}
              style={styles.fullImage}
              resizeMode="contain"
            />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#000",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    paddingTop: 48,
    backgroundColor: "rgba(0,0,0,0.8)",
    zIndex: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  imageScroll: {
    flexGrow: 1,
    justifyContent: "center",
  },
  fullImage: {
    width: width,
    height: height - 100,
  },
});
