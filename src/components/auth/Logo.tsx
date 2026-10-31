import { Image, ImageStyle, StyleProp, StyleSheet } from "react-native";

type Props = {
  size?: "small" | "medium";
  style?: StyleProp<ImageStyle>;
};

export default function Logo({ size = "small", style }: Props) {
  return (
    <Image
      source={require("../../../assets/images/logo.png")}
      style={[
        size === "small" ? styles.small : styles.medium,
        style,
      ]}
      resizeMode="contain"
    />
  );
}

const styles = StyleSheet.create({
  small: {
    width: 56,
    height: 36,
  },
  medium: {
    width: 72,
    height: 48,
  },
});
