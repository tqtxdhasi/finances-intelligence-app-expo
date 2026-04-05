// components/merchants/MerchantsTab.tsx
import {
  getAllMerchantsWithStats,
  MerchantWithStats,
} from "@/hooks/merchant/getAllMerchantsWithStats";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { StatsBar } from "../StatsBar";
import { MerchantsListItem } from "./MerchantsListItem";

export const MerchantsTab = ({}) => {
  const [merchants, setMerchants] = useState<MerchantWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchMerchants = useCallback(async () => {
    try {
      setError(null);
      const data = await getAllMerchantsWithStats();
      setMerchants(data);
    } catch (err) {
      console.error("Failed to fetch merchants:", err);
      setError("Failed to load merchants. Pull to refresh.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchMerchants();
  }, [fetchMerchants]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchMerchants();
  }, [fetchMerchants]);

  if (loading && !refreshing) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error && merchants.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>{error}</Text>
      </View>
    );
  }

  const totalReceipts = merchants.reduce((sum, m) => sum + m.receiptCount, 0);
  const totalLocations = merchants.reduce(
    (sum, m) => sum + m.locations.length,
    0,
  );
  const stats = [
    { label: "Total Merchants", value: merchants.length },
    { label: "Total Locations", value: totalLocations },
    { label: "Total Receipts", value: totalReceipts },
  ];

  return (
    <View style={{ flex: 1 }}>
      <StatsBar stats={stats} />
      <FlatList
        data={merchants}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <MerchantsListItem merchant={item} onDeleteSuccess={fetchMerchants} />
        )}
        refreshing={refreshing}
        onRefresh={onRefresh}
      />
    </View>
  );
};
