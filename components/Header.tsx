import { useTheme } from "@/utils/theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface HeaderProps {
  title: string;
  onAddReceiptPress: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, onAddReceiptPress }) => {
  const { colors, styles: themeStyles } = useTheme();

  return (
    <View style={styles.header}>
      <Text style={[themeStyles.title, styles.title]}>{title}</Text>
      <TouchableOpacity onPress={onAddReceiptPress}>
        <View style={styles.addButton}>
          <Ionicons name="add-circle-outline" size={24} color={colors.accent} />
          <Text style={[styles.addButtonText, { color: colors.accent }]}>
            Add Receipt
          </Text>
        </View>
      </TouchableOpacity>
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
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: "500",
  },
});
