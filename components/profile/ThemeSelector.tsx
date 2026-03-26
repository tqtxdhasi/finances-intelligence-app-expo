import { useTheme } from "@/utils/theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Props {
  theme: "light" | "dark";
  onThemeChange: (theme: "light" | "dark") => void;
}

export default function ThemeSelector({ theme, onThemeChange }: Props) {
  const { colors } = useTheme();

  return (
    <View style={styles.themeOptions}>
      <TouchableOpacity
        style={[
          styles.themeOption,
          theme === "dark" && styles.selectedThemeOption,
          { borderColor: colors.border },
        ]}
        onPress={() => onThemeChange("dark")}
      >
        <Ionicons
          name="moon"
          size={24}
          color={theme === "dark" ? colors.accent : colors.textSecondary}
        />
        <Text
          style={[
            styles.themeOptionText,
            theme === "dark" && { color: colors.accent },
          ]}
        >
          Dark
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.themeOption,
          theme === "light" && styles.selectedThemeOption,
          { borderColor: colors.border },
        ]}
        onPress={() => onThemeChange("light")}
      >
        <Ionicons
          name="sunny"
          size={24}
          color={theme === "light" ? colors.accent : colors.textSecondary}
        />
        <Text
          style={[
            styles.themeOptionText,
            theme === "light"
              ? { color: colors.accent }
              : { color: colors.textSecondary },
          ]}
        >
          Light
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  themeOptions: {
    flexDirection: "row",
    gap: 16,
  },
  themeOption: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderRadius: 8,
  },
  selectedThemeOption: {
    borderWidth: 2,
  },
  themeOptionText: {
    fontSize: 16,
    fontWeight: "500",
  },
});
