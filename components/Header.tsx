import { useTheme } from "@/utils/theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface HeaderProps {
  title: string;
  viewMode: "list" | "grid";
  onViewModeToggle: () => void;
  onFilterPress: () => void;
}

const Header: React.FC<HeaderProps> = ({
  title,
  viewMode,
  onViewModeToggle,
  onFilterPress,
}) => {
  const { colors, styles: themeStyles } = useTheme();

  return (
    <View style={styles.header}>
      <Text style={[themeStyles.title, styles.title]}>{title}</Text>
      <View style={styles.headerActions}>
        <TouchableOpacity onPress={onViewModeToggle}>
          <Ionicons
            name={viewMode === "list" ? "grid-outline" : "list-outline"}
            size={24}
            color={colors.text}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={onFilterPress} style={styles.filterIcon}>
          <Ionicons name="filter-outline" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    fontSize: 28,
  },
  headerActions: {
    flexDirection: "row",
  },
  filterIcon: {
    marginLeft: 16,
  },
});
