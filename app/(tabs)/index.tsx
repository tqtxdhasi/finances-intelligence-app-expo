// app/screens/ReceiptsScreen.tsx
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useGroupedReceipts } from "@/hooks/receipt/useGroupedReceipts";
import { useTheme } from "@/utils/theme";
import Header from "../../components/Header";
import ReceiptItem from "../../components/ReceiptItem";
import SearchBar from "../../components/SearchBar";
import TimelineHeader from "../../components/TimelineHeader";

interface FilterState {
  dateFrom: string;
  dateTo: string;
  category: string;
  minPrice: string;
  maxPrice: string;
  currency: string;
}

export default function ReceiptsScreen() {
  const router = useRouter();
  const { colors, styles: themeStyles } = useTheme();
  const [searchText, setSearchText] = useState("");
  const [sortOption, setSortOption] = useState("date_desc");
  const [filters, setFilters] = useState<FilterState>({
    dateFrom: "",
    dateTo: "",
    category: "",
    minPrice: "",
    maxPrice: "",
    currency: "",
  });

  // Build API params from UI state
  const apiParams = useMemo(
    () => ({
      search: searchText || undefined,
      dateFrom: filters.dateFrom || undefined,
      dateTo: filters.dateTo || undefined,
      minTotal: filters.minPrice ? parseFloat(filters.minPrice) : undefined,
      maxTotal: filters.maxPrice ? parseFloat(filters.maxPrice) : undefined,
      currency: filters.currency || undefined,
      sortBy: sortOption.includes("date")
        ? "date"
        : sortOption.includes("total")
          ? "total"
          : "merchant",
      sortOrder: sortOption.includes("desc") ? "DESC" : "ASC",
    }),
    [searchText, filters, sortOption],
  );

  // Use the grouped receipts hook with the current params
  const {
    groupedReceipts,
    loading,
    refreshing,
    hasMore,
    loadMore,
    refresh,
    updateFilters,
    total,
  } = useGroupedReceipts(apiParams);

  // Whenever apiParams changes, trigger a refresh
  useEffect(() => {
    updateFilters(apiParams);
  }, [apiParams, updateFilters]);

  // Clear all filters and search
  const handleClearFilters = () => {
    setSearchText("");
    setFilters({
      dateFrom: "",
      dateTo: "",
      category: "",
      minPrice: "",
      maxPrice: "",
      currency: "",
    });
    setSortOption("date_desc");
  };

  // Grouped receipt type
  interface GroupedReceipt {
    date: string;
    receipts: any[];
    totalAmount: number;
  }

  const renderGroupedReceipt = ({ item }: { item: GroupedReceipt }) => (
    <View>
      <TimelineHeader date={item.date} totalAmount={item.totalAmount} />
      {item.receipts.map((receipt) => (
        <ReceiptItem key={receipt.id} item={receipt} viewMode="list" />
      ))}
    </View>
  );

  // Determine empty state message
  const renderEmptyState = () => {
    if (total === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyTitle, { color: colors.text }]}>
            ✨ No receipts yet
          </Text>
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            Start tracking your expenses by adding your first receipt.
          </Text>
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: colors.accent }]}
            onPress={() => router.push("/(tabs)/add")}
          >
            <Text style={[styles.addButtonText, { color: colors.text }]}>
              + Add New Receipt
            </Text>
          </TouchableOpacity>
        </View>
      );
    } else if (groupedReceipts.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyTitle, { color: colors.text }]}>
            🔍 No matching receipts
          </Text>
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            Try adjusting your search or filters.
          </Text>
          <TouchableOpacity
            style={[
              styles.clearButton,
              { backgroundColor: colors.surfaceLight },
            ]}
            onPress={handleClearFilters}
          >
            <Text style={[styles.clearButtonText, { color: colors.text }]}>
              Clear Filters
            </Text>
          </TouchableOpacity>
        </View>
      );
    }
    return null;
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header
        title="Receipts"
        onAddReceiptPress={() => router.push("/(tabs)/add")}
      />

      <SearchBar
        value={searchText}
        onChangeText={setSearchText}
        placeholder="Search merchant..."
      />

      <FlatList
        data={groupedReceipts}
        renderItem={renderGroupedReceipt}
        keyExtractor={(item) => item.date}
        contentContainerStyle={styles.listContainer}
        onEndReached={loadMore}
        onEndReachedThreshold={0.2}
        onRefresh={refresh}
        refreshing={refreshing}
        ListFooterComponent={
          loading ? (
            <ActivityIndicator size="large" color={colors.accent} />
          ) : null
        }
        ListEmptyComponent={!loading ? renderEmptyState() : null}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    paddingBottom: 20,
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 24,
  },
  addButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  clearButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  clearButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
