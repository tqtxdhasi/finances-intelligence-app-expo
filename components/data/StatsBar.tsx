import { useTheme } from "@/utils/theme";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface Stat {
  label: string;
  value: string | number;
}

interface StatsBarProps {
  stats: Stat[];
}

export const StatsBar: React.FC<StatsBarProps> = ({ stats }) => {
  const { colors } = useTheme();

  return (
    <View style={styles.statsBar}>
      {stats.map((stat, index) => (
        <View
          key={index}
          style={[styles.statBox, { backgroundColor: colors.surface }]}
        >
          <Text style={[styles.statNumber, { color: colors.accent }]}>
            {stat.value}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
            {stat.label}
          </Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  statsBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    gap: 12,
  },
  statBox: {
    flex: 1,
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "bold",
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
  },
});
