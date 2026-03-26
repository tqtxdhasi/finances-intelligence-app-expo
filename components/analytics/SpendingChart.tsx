import { ExpenseData } from "@/types/analytics";
import { useTheme } from "@/utils/theme";
import React from "react";
import {
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { LineChart } from "react-native-chart-kit";

const { width } = Dimensions.get("window");
const chartWidth = width - 80;

interface SpendingChartProps {
  data: ExpenseData[];
  loading: boolean;
  accentColor: string;
}

export const SpendingChart: React.FC<SpendingChartProps> = ({
  data,
  loading,
  accentColor,
}) => {
  const { colors, theme } = useTheme();
  const isDark = theme === "dark";

  const getChartConfig = () => ({
    backgroundColor: colors.surface,
    backgroundGradientFrom: colors.surface,
    backgroundGradientTo: colors.surface,
    decimalPlaces: 2,
    color: (opacity = 1) => accentColor,
    labelColor: (opacity = 1) => colors.textSecondary,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "6",
      strokeWidth: "2",
      stroke: accentColor,
    },
  });

  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        color={accentColor}
        style={styles.chartLoader}
      />
    );
  }

  const chartData = data.slice(-7);
  const labels = chartData.map((d) => d.date.slice(5));
  const values = chartData.map((d) => d.total);

  return (
    <View style={[styles.chartContainer, { backgroundColor: colors.surface }]}>
      <Text style={[styles.chartTitle, { color: colors.text }]}>
        Spending Trend
      </Text>
      <LineChart
        data={{
          labels,
          datasets: [{ data: values }],
        }}
        width={chartWidth}
        height={220}
        chartConfig={getChartConfig()}
        bezier
        style={styles.chart}
        formatYLabel={(value) => `$${parseFloat(value).toFixed(0)}`}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  chartContainer: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 16,
  },
  chart: {
    borderRadius: 8,
  },
  chartLoader: {
    marginVertical: 60,
  },
});
