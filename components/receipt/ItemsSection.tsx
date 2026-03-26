import { useTheme } from "@/utils/theme";
import { Ionicons } from "@expo/vector-icons";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface EditableItem {
  id: string;
  name: string;
  quantity: string;
  unit: string;
  price: string;
}

interface Props {
  items: EditableItem[];
  isEditing: boolean;
  currency: string;
  onUpdateItem: (id: string, field: keyof EditableItem, value: string) => void;
  onAddItem: () => void;
  onRemoveItem: (id: string) => void;
}

export const ItemsSection: React.FC<Props> = ({
  items,
  isEditing,
  currency,
  onUpdateItem,
  onAddItem,
  onRemoveItem,
}) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.section, { backgroundColor: colors.surface }]}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Items</Text>
        {isEditing && (
          <TouchableOpacity style={styles.addButton} onPress={onAddItem}>
            <Ionicons name="add-circle" size={24} color={colors.accent} />
            <Text style={[styles.addButtonText, { color: colors.accent }]}>
              Add Item
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {items.map((item) => (
        <View
          key={item.id}
          style={[styles.itemCard, { backgroundColor: colors.surfaceLight }]}
        >
          <View style={styles.itemHeader}>
            {isEditing ? (
              <TextInput
                style={[
                  styles.itemNameInput,
                  { backgroundColor: colors.surfaceLight, color: colors.text },
                ]}
                value={item.name}
                onChangeText={(text) => onUpdateItem(item.id, "name", text)}
                placeholder="Item name"
                placeholderTextColor={colors.textMuted}
              />
            ) : (
              <Text style={[styles.itemName, { color: colors.text }]}>
                {item.name}
              </Text>
            )}
            {isEditing && (
              <TouchableOpacity onPress={() => onRemoveItem(item.id)}>
                <Ionicons name="trash-outline" size={20} color={colors.error} />
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.itemDetails}>
            {isEditing ? (
              <>
                <View style={styles.itemField}>
                  <Text
                    style={[
                      styles.itemFieldLabel,
                      { color: colors.textSecondary },
                    ]}
                  >
                    Qty
                  </Text>
                  <TextInput
                    style={[
                      styles.itemSmallInput,
                      {
                        backgroundColor: colors.surfaceLight,
                        color: colors.text,
                      },
                    ]}
                    value={item.quantity}
                    onChangeText={(text) =>
                      onUpdateItem(item.id, "quantity", text)
                    }
                    keyboardType="numeric"
                    placeholderTextColor={colors.textMuted}
                  />
                </View>
                <View style={styles.itemField}>
                  <Text
                    style={[
                      styles.itemFieldLabel,
                      { color: colors.textSecondary },
                    ]}
                  >
                    Unit
                  </Text>
                  <TextInput
                    style={[
                      styles.itemSmallInput,
                      {
                        backgroundColor: colors.surfaceLight,
                        color: colors.text,
                      },
                    ]}
                    value={item.unit}
                    onChangeText={(text) => onUpdateItem(item.id, "unit", text)}
                    placeholderTextColor={colors.textMuted}
                  />
                </View>
                <View style={styles.itemField}>
                  <Text
                    style={[
                      styles.itemFieldLabel,
                      { color: colors.textSecondary },
                    ]}
                  >
                    Price
                  </Text>
                  <TextInput
                    style={[
                      styles.itemSmallInput,
                      {
                        backgroundColor: colors.surfaceLight,
                        color: colors.text,
                      },
                    ]}
                    value={item.price}
                    onChangeText={(text) =>
                      onUpdateItem(item.id, "price", text)
                    }
                    keyboardType="decimal-pad"
                    placeholderTextColor={colors.textMuted}
                  />
                </View>
              </>
            ) : (
              <>
                <Text
                  style={[styles.itemDetail, { color: colors.textSecondary }]}
                >
                  {item.quantity} {item.unit}
                </Text>
                <Text style={[styles.itemPrice, { color: colors.accent }]}>
                  {currency} {parseFloat(item.price || "0").toFixed(2)}
                </Text>
              </>
            )}
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
    borderRadius: 12,
    padding: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 0,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  addButtonText: {
    fontSize: 14,
  },
  itemCard: {
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  itemNameInput: {
    fontSize: 16,
    fontWeight: "bold",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flex: 1,
    marginRight: 8,
  },
  itemDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemField: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  itemFieldLabel: {
    fontSize: 12,
  },
  itemSmallInput: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    fontSize: 14,
    width: 60,
    textAlign: "center",
  },
  itemDetail: {
    fontSize: 14,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: "bold",
  },
});
