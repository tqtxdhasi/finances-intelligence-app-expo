import { useTheme } from "@/utils/theme";
import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

interface Props {
  onReset: () => void;
}

export default function ResetButton({ onReset }: Props) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={[styles.resetButton, { borderColor: colors.error }]}
      onPress={onReset}
    >
      <Text style={[styles.resetText, { color: colors.error }]}>
        Reset to Default
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  resetButton: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 40,
  },
  resetText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
