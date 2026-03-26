import { useTheme } from "@/utils/theme";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface TimelineHeaderProps {
  date: string;
  totalAmount?: number;
  currency?: string;
}

const TimelineHeader: React.FC<TimelineHeaderProps> = ({
  date,
  totalAmount,
  currency = "USD",
}) => {
  const { colors, styles: themeStyles } = useTheme();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    }
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.surfaceLight, borderColor: colors.border },
      ]}
    >
      <Text style={[styles.date, { color: colors.accent }]}>
        {formatDate(date)}
      </Text>
      {totalAmount !== undefined && (
        <Text style={[styles.total, { color: colors.textSecondary }]}>
          {totalAmount.toFixed(2)} {currency}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 8,
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  date: {
    fontSize: 16,
    fontWeight: "bold",
  },
  total: {
    fontSize: 14,
    fontWeight: "500",
  },
});

export default TimelineHeader;
