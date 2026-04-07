// components/common/EmptyState.tsx
import { useTheme } from "@/utils/theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface EmptyStateProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  buttonText: string;
  onPress: () => void;
}

export const EmptyState = ({
  icon,
  title,
  subtitle,
  buttonText,
  onPress,
}: EmptyStateProps) => {
  const { colors } = useTheme();

  return (
    <View style={styles.emptyContainer}>
      <Ionicons name={icon} size={60} color={colors.accent} />
      <Text style={[styles.emptyTitle, { color: colors.text }]}>{title}</Text>
      <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
        {subtitle}
      </Text>
      <TouchableOpacity
        style={[styles.primaryButton, { backgroundColor: colors.accent }]}
        onPress={onPress}
      >
        <Text style={styles.primaryButtonText}>{buttonText}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 24,
  },
  primaryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
});
