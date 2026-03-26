import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { useTheme } from "@/utils/theme";

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder = "Search...",
}) => {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.searchContainer,
        { backgroundColor: colors.surfaceLight },
      ]}
    >
      <Ionicons name="search-outline" size={20} color={colors.textMuted} />
      <TextInput
        style={[styles.searchInput, { color: colors.text }]}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
});