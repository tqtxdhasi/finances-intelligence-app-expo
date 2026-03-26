import { CustomDateModal } from "@/components/analytics/CustomDateModal";
import { dummyProductDetail, dummyTopCategories, dummyTopProducts, generateDummyData } from "@/components/analytics/data";
import { InsightsSection } from "@/components/analytics/InsightsSection";
import { ProductDetailModal } from "@/components/analytics/ProductDetailModal";
import { SpendingChart } from "@/components/analytics/SpendingChart";
import { TimeFilter } from "@/components/analytics/TimeFilter";
import { TopExpensesList } from "@/components/analytics/TopExpensesList";
import { TopExpensesToggle } from "@/components/analytics/TopExpensesToggle";
import { TotalCard } from "@/components/analytics/TotalCard";
import { ExpenseData, ProductDetail, TopExpense } from "@/types/analytics";
import { useTheme } from "@/utils/theme";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";


export default function AnalyticsScreen() {
  // State
  const [timeFilter, setTimeFilter] = useState("week");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [showCustomPicker, setShowCustomPicker] = useState(false);
  const [topExpensesType, setTopExpensesType] = useState<
    "category" | "product"
  >("category");
  const [selectedProduct, setSelectedProduct] = useState<ProductDetail | null>(
    null,
  );
  const [showProductDetail, setShowProductDetail] = useState(false);
  const [loading, setLoading] = useState(false);
  const [expenseData, setExpenseData] = useState<ExpenseData[]>([]);
  const [totalExpenses, setTotalExpenses] = useState(0);

  const { colors, styles: themeStyles } = useTheme();

  // Load data based on time filter
  useEffect(() => {
    loadData();
  }, [timeFilter, customStartDate, customEndDate]);

  const loadData = () => {
    setLoading(true);
    setTimeout(() => {
      let days = 7;
      switch (timeFilter) {
        case "day":
          days = 1;
          break;
        case "week":
          days = 7;
          break;
        case "month":
          days = 30;
          break;
        case "quarter":
          days = 90;
          break;
        case "year":
          days = 365;
          break;
        case "custom":
          days = 30;
          break;
      }
      const data = generateDummyData(days);
      setExpenseData(data);
      const total = data.reduce((sum, item) => sum + item.total, 0);
      setTotalExpenses(total);
      setLoading(false);
    }, 500);
  };

  const getDateRangeText = () => {
    if (timeFilter === "custom" && customStartDate && customEndDate) {
      return `${customStartDate} to ${customEndDate}`;
    }
    const today = new Date();
    switch (timeFilter) {
      case "day":
        return today.toLocaleDateString();
      case "week":
        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);
        return `${weekAgo.toLocaleDateString()} - ${today.toLocaleDateString()}`;
      case "month":
        const monthAgo = new Date(today);
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        return `${monthAgo.toLocaleDateString()} - ${today.toLocaleDateString()}`;
      case "quarter":
        const quarterAgo = new Date(today);
        quarterAgo.setMonth(quarterAgo.getMonth() - 3);
        return `${quarterAgo.toLocaleDateString()} - ${today.toLocaleDateString()}`;
      case "year":
        const yearAgo = new Date(today);
        yearAgo.setFullYear(yearAgo.getFullYear() - 1);
        return `${yearAgo.toLocaleDateString()} - ${today.toLocaleDateString()}`;
      default:
        return "Last 7 days";
    }
  };

  const handleProductPress = (product: TopExpense) => {
    setSelectedProduct({
      ...dummyProductDetail,
      id: product.id,
      name: product.name,
      totalSpent: product.total,
    });
    setShowProductDetail(true);
  };

  const handleApplyCustomDate = () => {
    if (customStartDate && customEndDate) {
      setTimeFilter("custom");
      setShowCustomPicker(false);
    }
  };

  return (
    <ScrollView
      style={[themeStyles.container, styles.container]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.content}>
        <Text style={[themeStyles.title, styles.title]}>Analytics</Text>

        <TimeFilter
          timeFilter={timeFilter}
          onTimeFilterChange={setTimeFilter}
          onCustomPress={() => setShowCustomPicker(true)}
          dateRangeText={getDateRangeText()}
        />

        <TotalCard total={totalExpenses} />

        <SpendingChart
          data={expenseData}
          loading={loading}
          accentColor={colors.accent}
        />

        <TopExpensesToggle
          type={topExpensesType}
          onTypeChange={setTopExpensesType}
        />

        <TopExpensesList
          title="Top Expenses"
          expenses={
            topExpensesType === "category"
              ? dummyTopCategories
              : dummyTopProducts
          }
          isProduct={topExpensesType === "product"}
          onProductPress={handleProductPress}
        />

        <InsightsSection />

        <View style={styles.bottomSpacer} />
      </View>

      <ProductDetailModal
        visible={showProductDetail}
        product={selectedProduct}
        onClose={() => setShowProductDetail(false)}
      />

      <CustomDateModal
        visible={showCustomPicker}
        startDate={customStartDate}
        endDate={customEndDate}
        onStartDateChange={setCustomStartDate}
        onEndDateChange={setCustomEndDate}
        onApply={handleApplyCustomDate}
        onClose={() => setShowCustomPicker(false)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 0,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    marginBottom: 20,
  },
  bottomSpacer: {
    height: 40,
  },
});
