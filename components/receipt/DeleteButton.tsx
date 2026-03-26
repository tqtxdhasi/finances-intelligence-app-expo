import { useTheme } from "@/utils/theme";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

interface Props {
  onPress: () => void;
}

export const DeleteButton: React.FC<Props> = ({ onPress }) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.deleteButton,
        { backgroundColor: colors.surfaceLight, borderColor: colors.error },
      ]}
      onPress={onPress}
    >
      <Ionicons name="trash-outline" size={20} color={colors.error} />
      <Text style={[styles.deleteButtonText, { color: colors.error }]}>
        Delete Receipt
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 16,
    marginBottom: 32,
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
