import { useTheme } from "@/utils/theme";
import { Image, StyleSheet, View } from "react-native";

interface Props {
  uri?: string;
}

export const ReceiptImage: React.FC<Props> = ({ uri }) => {
  const { colors } = useTheme();

  if (!uri) return null;
  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <Image source={{ uri }} style={styles.image} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
    borderRadius: 12,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
});
