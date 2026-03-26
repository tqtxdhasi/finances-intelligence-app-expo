import { useTheme } from "@/utils/theme";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabLayout() {
  const { colors, theme } = useTheme();

  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          const getIconName = () => {
            if (route.name === "index") {
              return focused ? "receipt" : "receipt-outline";
            }
            if (route.name === "add") {
              return focused ? "add-circle" : "add-circle-outline";
            }
            if (route.name === "analytics") {
              return focused ? "bar-chart" : "bar-chart-outline";
            }
            if (route.name === "data") {
              return focused ? "folder-open" : "folder-outline";
            }
            if (route.name === "profile") {
              return focused ? "person" : "person-outline";
            }
            return focused ? "help-circle" : "help-circle-outline";
          };

          return <Ionicons name={getIconName()} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopWidth: theme === "dark" ? 0 : 1,
          borderTopColor: colors.border,
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        headerShown: false,
      })}
    >
      <Tabs.Screen name="index" options={{ title: "Receipts" }} />
      <Tabs.Screen name="add" options={{ title: "Add" }} />
      <Tabs.Screen name="analytics" options={{ title: "Analytics" }} />
      <Tabs.Screen name="data" options={{ title: "Data" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
    </Tabs>
  );
}
