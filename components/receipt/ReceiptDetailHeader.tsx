import { useTheme } from "@/utils/theme";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Props {
  onBack: () => void;
  isEditing: boolean;
  saving: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSave: () => void;
}

export const ReceiptDetailHeader: React.FC<Props> = ({
  onBack,
  isEditing,
  saving,
  onEdit,
  onCancel,
  onSave,
}) => {
  const { colors } = useTheme();

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color={colors.text} />
      </TouchableOpacity>
      <Text style={[styles.title, { color: colors.text }]}>
        Receipt Details
      </Text>
      {!isEditing ? (
        <TouchableOpacity onPress={onEdit} style={styles.editButton}>
          <Ionicons name="pencil" size={24} color={colors.accent} />
        </TouchableOpacity>
      ) : (
        <View style={styles.headerButtons}>
          <TouchableOpacity
            onPress={onSave}
            style={[
              styles.saveHeaderButton,
              { backgroundColor: colors.accent },
            ]}
            disabled={saving}
          >
            <Text style={[styles.saveHeaderButtonText, { color: colors.text }]}>
              {saving ? "Saving..." : "Save"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onCancel}
            style={[
              styles.cancelButton,
              { backgroundColor: colors.surfaceLight },
            ]}
          >
            <Text style={[styles.cancelButtonText, { color: colors.text }]}>
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  editButton: {
    padding: 8,
  },
  headerButtons: {
    flexDirection: "row",
    gap: 12,
  },
  cancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  cancelButtonText: {
    fontSize: 14,
  },
  saveHeaderButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  saveHeaderButtonText: {
    fontSize: 14,
    fontWeight: "bold",
  },
});
