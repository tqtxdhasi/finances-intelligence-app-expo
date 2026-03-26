import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

interface Props {
  accentColor: string;
  onColorChange: (color: string) => void;
}
export const accentColors = [
  "#ff9800", // Orange (default)
  "#f44336", // Red
  "#e91e63", // Pink
  "#9c27b0", // Purple
  "#3f51b5", // Indigo
  "#2196f3", // Blue
  "#00bcd4", // Cyan
  "#4caf50", // Green
  "#ffeb3b", // Yellow
  "#ff5722", // Deep Orange
];
export default function AccentColorSelector({
  accentColor,
  onColorChange,
}: Props) {
  return (
    <View style={styles.colorGrid}>
      {accentColors.map((color) => (
        <TouchableOpacity
          key={color}
          style={[
            styles.colorOption,
            { backgroundColor: color },
            accentColor === color && styles.selectedColor,
          ]}
          onPress={() => onColorChange(color)}
        >
          {accentColor === color && (
            <Ionicons name="checkmark" size={20} color="#fff" />
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  colorGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  colorOption: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  selectedColor: {
    borderWidth: 3,
    borderColor: "#fff",
    transform: [{ scale: 1.05 }],
  },
});
