import { useMemo } from "react";
import { QueryParams } from "../../types/receipt";
import { useReceiptsD1 } from "./useReceipts";

interface GroupedReceipt {
  date: string;
  receipts: any[];
  totalAmount: number;
}

/**
 * Hook to fetch and group receipts by day
 * Automatically handles filtering, sorting, pagination, and grouping
 */
export const useGroupedReceipts = (initialParams: QueryParams = {}) => {
  const {
    receipts,
    loading,
    refreshing,
    total,
    hasMore,
    loadMore,
    refresh,
    updateFilters,
    params,
  } = useReceiptsD1(initialParams);

  // Group receipts by date (YYYY-MM-DD) and sort groups newest first
  const groupedReceipts = useMemo(() => {
    const groups: Record<string, GroupedReceipt> = {};

    receipts.forEach((receipt) => {
      const date = receipt.date.split("T")[0]; // Extract date part
      if (!groups[date]) {
        groups[date] = {
          date,
          receipts: [],
          totalAmount: 0,
        };
      }
      groups[date].receipts.push(receipt);
      groups[date].totalAmount += receipt.total;
    });

    // Sort groups by date descending (newest first)
    return Object.values(groups).sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  }, [receipts]);

  return {
    groupedReceipts, // Array of { date, receipts, totalAmount }
    loading, // Initial loading state
    refreshing, // Pull-to-refresh state
    total, // Total number of receipts (all pages)
    hasMore, // Whether more receipts are available
    loadMore, // Function to load next page
    refresh, // Function to refresh the list
    updateFilters, // Function to apply new filters/sort
    params, // Current active params
    rawReceipts: receipts, // Raw receipts if needed
  };
};
