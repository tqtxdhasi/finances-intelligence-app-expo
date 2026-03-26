import { ProductDetail } from "@/types/analytics";
import { useTheme } from "@/utils/theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { BarChart } from "react-native-chart-kit";

const { width } = Dimensions.get("window");
const chartWidth = width - 80;

interface ProductDetailModalProps {
  visible: boolean;
  product: ProductDetail | null;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  visible,
  product,
  onClose,
}) => {
  const { colors } = useTheme();

  const getChartConfig = () => ({
    backgroundColor: colors.surface,
    backgroundGradientFrom: colors.surface,
    backgroundGradientTo: colors.surface,
    decimalPlaces: 2,
    color: (opacity = 1) => colors.accent,
    labelColor: (opacity = 1) => colors.textSecondary,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "6",
      strokeWidth: "2",
      stroke: colors.accent,
    },
  });

  if (!product) return null;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View
          style={[styles.modalContainer, { backgroundColor: colors.surface }]}
        >
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              {product.name}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Stats Cards */}
            <View style={styles.statsGrid}>
              <View
                style={[
                  styles.statCard,
                  { backgroundColor: colors.surfaceLight },
                ]}
              >
                <Text
                  style={[styles.statLabel, { color: colors.textSecondary }]}
                >
                  Total Spent
                </Text>
                <Text style={[styles.statValue, { color: colors.accent }]}>
                  ${product.totalSpent.toFixed(2)}
                </Text>
              </View>
              <View
                style={[
                  styles.statCard,
                  { backgroundColor: colors.surfaceLight },
                ]}
              >
                <Text
                  style={[styles.statLabel, { color: colors.textSecondary }]}
                >
                  Total Quantity
                </Text>
                <Text style={[styles.statValue, { color: colors.accent }]}>
                  {product.totalQuantity.toFixed(1)}
                </Text>
              </View>
              <View
                style={[
                  styles.statCard,
                  { backgroundColor: colors.surfaceLight },
                ]}
              >
                <Text
                  style={[styles.statLabel, { color: colors.textSecondary }]}
                >
                  Avg Price
                </Text>
                <Text style={[styles.statValue, { color: colors.accent }]}>
                  ${product.averagePrice.toFixed(2)}
                </Text>
              </View>
              <View
                style={[
                  styles.statCard,
                  { backgroundColor: colors.surfaceLight },
                ]}
              >
                <Text
                  style={[styles.statLabel, { color: colors.textSecondary }]}
                >
                  Frequency
                </Text>
                <Text style={[styles.statValue, { color: colors.accent }]}>
                  Every {product.averageFrequencyDays} days
                </Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Ionicons
                name="calendar-outline"
                size={20}
                color={colors.textSecondary}
              />
              <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                Last purchased: {product.lastPurchaseDate}
              </Text>
            </View>

            {/* Mini Chart */}
            <View
              style={[
                styles.chartContainer,
                { backgroundColor: colors.surfaceLight },
              ]}
            >
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Consumption Over Time
              </Text>
              <BarChart
                data={{
                  labels:
                    product.history.slice(-7).map((h) => h.date.slice(5)) || [],
                  datasets: [
                    {
                      data:
                        product.history.slice(-7).map((h) => h.quantity) || [],
                    },
                  ],
                }}
                width={chartWidth}
                height={220}
                chartConfig={getChartConfig()}
                style={styles.chart}
                showValuesOnTopOfBars
                fromZero
              />
            </View>

            {/* History List */}
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Purchase History
            </Text>
            {product.history.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.historyItem,
                  { backgroundColor: colors.surfaceLight },
                ]}
              >
                <View>
                  <Text style={[styles.historyDate, { color: colors.text }]}>
                    {item.date}
                  </Text>
                  <Text
                    style={[
                      styles.historyQuantity,
                      { color: colors.textSecondary },
                    ]}
                  >
                    {item.quantity} units
                  </Text>
                </View>
                <Text style={[styles.historyPrice, { color: colors.accent }]}>
                  ${item.price.toFixed(2)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    borderRadius: 20,
    padding: 20,
    width: "90%",
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    borderRadius: 12,
    padding: 12,
    flex: 1,
    minWidth: "45%",
  },
  statLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 20,
  },
  infoText: {
    fontSize: 14,
  },
  chartContainer: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  chart: {
    borderRadius: 8,
  },
  historyItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  historyDate: {
    fontSize: 14,
    marginBottom: 4,
  },
  historyQuantity: {
    fontSize: 12,
  },
  historyPrice: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
