import { useTheme } from "@/utils/theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface Insight {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  title: string;
  text: string;
}

const insights: Insight[] = [
  {
    icon: "trending-up",
    iconColor: "#4caf50",
    title: "Spending Trend",
    text: "Your spending is increasing compared to last period",
  },
  {
    icon: "restaurant",
    iconColor: "#8c00ff",
    title: "Top Category",
    text: "Groceries accounts for 35% of your total spending",
  },
  {
    icon: "flash",
    iconColor: "#ff9800",
    title: "Most Frequent Purchase",
    text: "You buy Milk every 3.2 days on average",
  },
];

export const InsightsSection: React.FC = () => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>Insights</Text>
      {insights.map((insight, index) => (
        <View
          key={index}
          style={[styles.insightCard, { backgroundColor: colors.surface }]}
        >
          <Ionicons name={insight.icon} size={24} color={insight.iconColor} />
          <View style={styles.insightContent}>
            <Text style={[styles.insightTitle, { color: colors.text }]}>
              {insight.title}
            </Text>
            <Text style={[styles.insightText, { color: colors.textSecondary }]}>
              {insight.text}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  insightCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 4,
  },
  insightText: {
    fontSize: 12,
  },
});
