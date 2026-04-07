// hooks/useReceipts.ts
import { useCallback, useEffect, useReducer, useRef } from "react";
import { Alert } from "react-native";

import {
  CreateReceiptDTO,
  QueryParams,
  Receipt,
  UpdateReceiptDTO,
} from "@/types/receipt";
import { deleteReceiptById } from "./deleteReceiptById";
import { getAllReceipts } from "./getAllReceipts";
import { updateReceiptById } from "./updateReceiptById";

// --- Types ---
type State = {
  receipts: Receipt[];
  loading: boolean;
  refreshing: boolean;
  total: number;
  page: number;
  hasMore: boolean;
  params: QueryParams;
};

type Action =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_REFRESHING"; payload: boolean }
  | {
      type: "SET_RECEIPTS";
      payload: {
        receipts: Receipt[];
        total: number;
        hasMore: boolean;
        isRefresh: boolean;
        page: number;
      };
    }
  | {
      type: "SET_PARAMS";
      payload: QueryParams | ((prev: QueryParams) => QueryParams);
    };

const initialState: State = {
  receipts: [],
  loading: false,
  refreshing: false,
  total: 0,
  page: 1,
  hasMore: true,
  params: {},
};

// --- Reducer ---
function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_REFRESHING":
      return { ...state, refreshing: action.payload };
    case "SET_RECEIPTS":
      const { receipts, total, hasMore, isRefresh, page } = action.payload;
      return {
        ...state,
        receipts: isRefresh ? receipts : [...state.receipts, ...receipts],
        total,
        hasMore,
        page,
        loading: false,
        refreshing: false,
      };
    case "SET_PARAMS":
      const newParams =
        typeof action.payload === "function"
          ? action.payload(state.params)
          : action.payload;
      return {
        ...state,
        params: newParams,
        page: 1,
        hasMore: true,
        receipts: [], // clear existing receipts when filters change
      };
    default:
      return state;
  }
}

// --- Hook ---
export const useReceiptsD1 = (initialParams: QueryParams = {}) => {
  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    params: initialParams,
  });
  const { receipts, loading, refreshing, total, page, hasMore, params } = state;

  const isFetching = useRef(false);
  const isMounted = useRef(true);

  // Load receipts – stable as long as `params` doesn't change
  const loadReceipts = useCallback(
    async (pageNum: number, isRefresh: boolean) => {
      if (isFetching.current) return;
      isFetching.current = true;

      if (!isRefresh) {
        dispatch({ type: "SET_LOADING", payload: true });
      } else {
        dispatch({ type: "SET_REFRESHING", payload: true });
      }

      try {
        const response = await getAllReceipts({
          ...params,
          page: pageNum,
          limit: 20,
        });

        if (isMounted.current) {
          dispatch({
            type: "SET_RECEIPTS",
            payload: {
              receipts: response.receipts,
              total: response.total,
              hasMore: response.hasMore,
              isRefresh,
              page: pageNum,
            },
          });
        }
      } catch (error) {
        console.error("Failed to load receipts:", error);
        if (isMounted.current) {
          Alert.alert("Error", "Failed to load receipts");
          dispatch({ type: "SET_LOADING", payload: false });
          dispatch({ type: "SET_REFRESHING", payload: false });
        }
      } finally {
        isFetching.current = false;
      }
    },
    [params], // Only re‑create when filter parameters change
  );

  // Initial load or filter change
  useEffect(() => {
    loadReceipts(1, true);
  }, [params, loadReceipts]); // loadReceipts depends on params, but both are stable when params doesn't change

  // Cleanup
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const refresh = useCallback(() => {
    if (!isFetching.current) {
      loadReceipts(1, true);
    }
  }, [loadReceipts]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore && !isFetching.current) {
      loadReceipts(page + 1, false);
    }
  }, [loading, hasMore, page, loadReceipts]);

  const createReceiptService = useCallback(
    async (data: CreateReceiptDTO) => {
      dispatch({ type: "SET_LOADING", payload: true });
      try {
        const newReceipt = await createReceipt(data);
        await refresh();
        Alert.alert("Success", "Receipt created successfully");
        return newReceipt;
      } catch (error) {
        console.error("Failed to create receipt:", error);
        Alert.alert("Error", "Failed to create receipt");
        throw error;
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    },
    [refresh],
  );

  const updateReceipt = useCallback(
    async (id: string, data: UpdateReceiptDTO) => {
      dispatch({ type: "SET_LOADING", payload: true });
      try {
        const updatedReceipt = await updateReceiptById(id, data);
        // Optimistic update
        dispatch({
          type: "SET_RECEIPTS",
          payload: {
            receipts: receipts.map((r) => (r.id === id ? updatedReceipt : r)),
            total,
            hasMore,
            isRefresh: true,
            page,
          },
        });
        Alert.alert("Success", "Receipt updated successfully");
        return updatedReceipt;
      } catch (error) {
        console.error("Failed to update receipt:", error);
        Alert.alert("Error", "Failed to update receipt");
        throw error;
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    },
    [receipts, total, hasMore, page],
  );

  const deleteReceipt = useCallback(
    async (id: string) => {
      dispatch({ type: "SET_LOADING", payload: true });
      try {
        await deleteReceiptById(id);
        dispatch({
          type: "SET_RECEIPTS",
          payload: {
            receipts: receipts.filter((r) => r.id !== id),
            total: total - 1,
            hasMore,
            isRefresh: true,
            page,
          },
        });
        Alert.alert("Success", "Receipt deleted successfully");
      } catch (error) {
        console.error("Failed to delete receipt:", error);
        Alert.alert("Error", "Failed to delete receipt");
        throw error;
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    },
    [receipts, total, hasMore, page],
  );

  // ⭐ Stable updateFilters – never changes reference
  const updateFilters = useCallback((newParams: Partial<QueryParams>) => {
    dispatch({
      type: "SET_PARAMS",
      payload: (prev: QueryParams) => ({ ...prev, ...newParams }),
    });
  }, []); // No dependencies → stable identity

  return {
    receipts,
    loading,
    refreshing,
    total,
    hasMore,
    loadMore,
    refresh,
    createReceiptService,
    updateReceipt,
    deleteReceipt,
    updateFilters,
    params,
  };
};
