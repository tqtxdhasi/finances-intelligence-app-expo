import { dummyMerchants } from "@/data/dummyData";
import { Merchant } from "@/types/data";
import React from "react";
import { FlatList, View } from "react-native";
import { MerchantsListItem } from "./MerchantsListItem";
import { StatsBar } from "./StatsBar";

interface MerchantsTabProps {
  onEditMerchant: (merchant: Merchant) => void;
  onDeleteMerchant: (merchant: Merchant) => void;
}

export const MerchantsTab: React.FC<MerchantsTabProps> = ({
  onEditMerchant,
  onDeleteMerchant,
}) => {
  const totalReceipts = dummyMerchants.reduce(
    (sum, m) => sum + m.receiptCount,
    0,
  );

  const totalLocations = dummyMerchants.reduce(
    (sum, m) => sum + m.locations.length,
    0,
  );

  const stats = [
    { label: "Total Merchants", value: dummyMerchants.length },
    { label: "Total Locations", value: totalLocations },
    { label: "Total Receipts", value: totalReceipts },
  ];

  return (
    <View style={{ flex: 1 }}>
      <StatsBar stats={stats} />
      <FlatList
        data={dummyMerchants}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <MerchantsListItem
            merchant={item}
            onEdit={onEditMerchant}
            onDelete={onDeleteMerchant}
          />
        )}
      />
    </View>
  );
};
