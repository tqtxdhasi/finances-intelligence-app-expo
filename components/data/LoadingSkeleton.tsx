// components/common/LoadingSkeleton.tsx
import { useTheme } from "@/utils/theme";
import React from "react";
import { StyleSheet, View } from "react-native";

interface LoadingSkeletonProps {
  count?: number; // number of skeleton items to show
}

export const LoadingSkeleton = ({ count = 3 }: LoadingSkeletonProps) => {
  const { colors } = useTheme();

  return (
    <View style={styles.skeletonContainer}>
      {Array.from({ length: count }).map((_, index) => (
        <View
          key={index}
          style={[styles.skeletonItem, { backgroundColor: colors.surface }]}
        >
          <View
            style={[
              styles.skeletonIcon,
              { backgroundColor: colors.border || "#e0e0e0" },
            ]}
          />
          <View style={styles.skeletonContent}>
            <View
              style={[
                styles.skeletonTitle,
                { backgroundColor: colors.border || "#e0e0e0" },
              ]}
            />
            <View
              style={[
                styles.skeletonText,
                { backgroundColor: colors.border || "#e0e0e0" },
              ]}
            />
            <View
              style={[
                styles.skeletonText,
                { backgroundColor: colors.border || "#e0e0e0", width: "60%" },
              ]}
            />
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  skeletonContainer: {
    paddingHorizontal: 16,
  },
  skeletonItem: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    marginBottom: 12,
    padding: 8,
  },
  skeletonIcon: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  skeletonContent: {
    flex: 1,
    gap: 8,
  },
  skeletonTitle: {
    height: 18,
    width: "70%",
    borderRadius: 4,
  },
  skeletonText: {
    height: 14,
    width: "50%",
    borderRadius: 4,
  },
});
