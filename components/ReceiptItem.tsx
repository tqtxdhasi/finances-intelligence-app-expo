import { useTheme } from "@/utils/theme";
import { useRouter } from "expo-router";
import React from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width / 2 - 20;

interface ReceiptItemProps {
  item: {
    id: string;
    merchant: string;
    date: string;
    total: number;
    thumbnail: string;
    currency?: string;
  };
  viewMode: "list" | "grid";
  onPress?: () => void;
}

const formatDateTime = (dateTimeString: string) => {
  const date = new Date(dateTimeString);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const inputDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );

  let dateStr = "";
  if (inputDate.getTime() === today.getTime()) {
    dateStr = "Today";
  } else if (inputDate.getTime() === yesterday.getTime()) {
    dateStr = "Yesterday";
  } else {
    dateStr = date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  }

  const timeStr = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return `${dateStr} at ${timeStr}`;
};

const ReceiptItem: React.FC<ReceiptItemProps> = ({
  item,
  viewMode,
  onPress,
}) => {
  const router = useRouter();
  const { colors, styles: themeStyles } = useTheme();
  const currency = item.currency || "USD";

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push({
        pathname: "/receipt/[id]",
        params: { id: item.id },
      });
    }
  };

  if (viewMode === "list") {
    return (
      <TouchableOpacity
        style={[styles.listItem, { backgroundColor: colors.surface }]}
        onPress={handlePress}
      >
        <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
        <View style={styles.listContent}>
          <Text style={[styles.merchant, { color: colors.text }]}>
            {item.merchant}
          </Text>
          <Text style={[styles.date, { color: colors.textSecondary }]}>
            {formatDateTime(item.date)}
          </Text>
          <Text style={[styles.total, { color: colors.accent }]}>
            {item.total.toFixed(2)} {currency}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[styles.gridItem, { backgroundColor: colors.surface }]}
      onPress={handlePress}
    >
      <Image source={{ uri: item.thumbnail }} style={styles.gridThumbnail} />
      <Text style={[styles.gridMerchant, { color: colors.text }]}>
        {item.merchant}
      </Text>
      <Text style={[styles.date, { color: colors.textSecondary }]}>
        {formatDateTime(item.date)}
      </Text>
      <Text style={[styles.gridTotal, { color: colors.accent }]}>
        {item.total.toFixed(2)} {currency}
      </Text>
    </TouchableOpacity>
  );
};

export default ReceiptItem;

const styles = StyleSheet.create({
  listItem: {
    flexDirection: "row",
    borderRadius: 12,
    marginBottom: 12,
    padding: 12,
    alignItems: "center",
    marginHorizontal: 16,
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  listContent: {
    flex: 1,
  },
  merchant: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    marginBottom: 4,
  },
  total: {
    fontSize: 16,
    fontWeight: "bold",
  },
  gridItem: {
    width: CARD_WIDTH,
    borderRadius: 12,
    alignItems: "center",
    padding: 12,
    margin: 8,
  },
  gridThumbnail: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginBottom: 8,
  },
  gridMerchant: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 4,
  },
  gridTotal: {
    fontSize: 14,
  },
});
