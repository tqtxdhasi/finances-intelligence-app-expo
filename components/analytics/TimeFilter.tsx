import { useTheme } from "@/utils/theme";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface TimeFilterProps {
  timeFilter: string;
  onTimeFilterChange: (filter: string) => void;
  onCustomPress: () => void;
  dateRangeText: string;
}

const filters = ["day", "week", "month", "quarter", "year", "custom"];

export const TimeFilter: React.FC<TimeFilterProps> = ({
  timeFilter,
  onTimeFilterChange,
  onCustomPress,
  dateRangeText,
}) => {
  const { colors } = useTheme();

  const handlePress = (filter: string) => {
    if (filter === "custom") {
      onCustomPress();
    } else {
      onTimeFilterChange(filter);
    }
  };

  return (
    <View style={styles.filterSection}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.filterChips}>
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterChip,
                { backgroundColor: colors.surfaceLight },
                timeFilter === filter && { backgroundColor: colors.accent },
              ]}
              onPress={() => handlePress(filter)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  { color: colors.textSecondary },
                  timeFilter === filter && {
                    color: colors.text,
                    fontWeight: "bold",
                  },
                ]}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      <Text style={[styles.dateRangeText, { color: colors.textMuted }]}>
        {dateRangeText}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  filterSection: {
    marginBottom: 20,
  },
  filterChips: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  filterChipText: {
    fontSize: 14,
  },
  dateRangeText: {
    fontSize: 12,
    marginTop: 8,
  },
});
