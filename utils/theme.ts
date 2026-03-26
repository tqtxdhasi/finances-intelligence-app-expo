import { useSettingsStore } from "../stores/settingsStore";

// Helper to adjust color brightness
function adjustColor(color: string, percent: number): string {
  // Parse the color
  const hex = color.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // Adjust each channel
  const adjust = (channel: number) => {
    const newChannel = channel + (channel * percent) / 100;
    return Math.min(255, Math.max(0, Math.floor(newChannel)));
  };

  const newR = adjust(r);
  const newG = adjust(g);
  const newB = adjust(b);

  // Convert back to hex
  return `#${newR.toString(16).padStart(2, "0")}${newG.toString(16).padStart(2, "0")}${newB.toString(16).padStart(2, "0")}`;
}

// Color palette based on accent color and theme
export const getThemeColors = (
  accentColor: string,
  theme: "light" | "dark",
) => {
  const isDark = theme === "dark";

  return {
    // Core colors
    background: isDark ? "#121212" : "#f5f5f5",
    surface: isDark ? "#1e1e1e" : "#ffffff",
    surfaceLight: isDark ? "#2a2a2a" : "#f0f0f0",

    // Text colors
    text: isDark ? "#ffffff" : "#121212",
    textSecondary: isDark ? "#aaaaaa" : "#666666",
    textMuted: isDark ? "#6b6b6b" : "#999999",

    // Accent colors (dynamic)
    accent: accentColor,
    accentLight: `${accentColor}20`, // 20% opacity
    accentDark: adjustColor(accentColor, -20),

    // Status colors
    success: "#4caf50",
    warning: "#ff9800",
    error: "#ff4444",
    info: "#2196f3",

    // Border colors
    border: isDark ? "#2a2a2a" : "#e0e0e0",
    borderLight: isDark ? "#3a3a3a" : "#f0f0f0",
  };
};

// Hook for theme-aware styles
export const useTheme = () => {
  const { accentColor, theme } = useSettingsStore();
  const colors = getThemeColors(accentColor, theme);

  return {
    colors,
    theme,
    // Common style shortcuts
    styles: {
      container: {
        flex: 1,
        backgroundColor: colors.background,
      },
      card: {
        backgroundColor: colors.surface,
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: colors.border,
      },
      title: {
        fontSize: 20,
        fontWeight: "bold" as const,
        color: colors.text,
      },
      subtitle: {
        fontSize: 14,
        color: colors.textSecondary,
      },
      button: {
        backgroundColor: colors.accent,
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 16,
        alignItems: "center" as const,
      },
      buttonText: {
        color: colors.text,
        fontSize: 16,
        fontWeight: "bold" as const,
      },
    },
  };
};
