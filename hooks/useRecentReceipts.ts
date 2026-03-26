// hooks/useRecentReceipts.ts
import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";
import { Receipt } from "../types/receipt";
import { getAllReceipts } from "./receipt/getAllReceipts";

export const useRecentReceipts = (limit: number = 5) => {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const loadRecent = useCallback(
    async (pageNum: number = 1, isRefresh: boolean = false) => {
      if (loading && !isRefresh) return;

      setLoading(true);
      try {
        const response = await getAllReceipts({
          page: pageNum,
          limit,
          sortBy: "date",
          sortOrder: "DESC",
        });

        if (isRefresh) {
          setReceipts(response.receipts);
          setPage(1);
        } else {
          setReceipts((prev) => [...prev, ...response.receipts]);
          setPage(pageNum);
        }

        setHasMore(response.hasMore);
      } catch (error) {
        console.error("Failed to load recent receipts:", error);
        Alert.alert("Error", "Failed to load recent receipts");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [limit, loading],
  );

  const refresh = useCallback(() => {
    setRefreshing(true);
    loadRecent(1, true);
  }, [loadRecent]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      loadRecent(page + 1);
    }
  }, [loading, hasMore, page, loadRecent]);

  useEffect(() => {
    loadRecent(1, true);
  }, []);

  return {
    receipts,
    loading,
    refreshing,
    hasMore,
    loadMore,
    refresh,
  };
};
