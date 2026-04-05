// app/_layout.tsx (or RootLayout)
import { useFirstLaunch } from "@/hooks/useFirstLaunch";
import { useSyncSettings } from "@/hooks/useSyncSettings";
import { useUser } from "@/hooks/useUser";
import { Stack } from "expo-router";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import OnboardingScreen from "./onboarding";

function LayoutContent() {
  const insets = useSafeAreaInsets();
  const { loading: userLoading, userId } = useUser();
  const { isFirstLaunch, markFirstLaunchDone } = useFirstLaunch();

  // This will sync settings between store and DB
  useSyncSettings();

  if (userLoading || isFirstLaunch === null) {
    return (
      <View
        style={[
          styles.loadingContainer,
          { paddingTop: insets.top, paddingBottom: insets.bottom },
        ]}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (isFirstLaunch) {
    return (
      <View
        style={[
          styles.container,
          { paddingTop: insets.top, paddingBottom: insets.bottom },
        ]}
      >
        <OnboardingScreen onComplete={markFirstLaunchDone} />
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      <Stack screenOptions={{ headerShown: false }} />
    </View>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <LayoutContent />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
