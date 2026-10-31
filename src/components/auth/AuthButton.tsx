import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  ViewStyle,
} from "react-native";

type Props = {
  title: string;
  onPress: () => void;
  mode?: "contained" | "outlined";
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
};

export default function AuthButton({
  title,
  onPress,
  mode = "contained",
  loading = false,
  disabled = false,
  style,
}: Props) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      disabled={isDisabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        mode === "contained" ? styles.contained : styles.outlined,
        pressed && styles.pressed,
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          color={mode === "contained" ? "#FFFFFF" : "#9E3B18"}
        />
      ) : (
        <Text
          style={[
            styles.text,
            mode === "contained" ? styles.containedText : styles.outlinedText,
          ]}
        >
          {title}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: "100%",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 6,
  },
  contained: {
    backgroundColor: "#9E3B18",
  },
  outlined: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E4D5CE",
  },
  pressed: {
    opacity: 0.85,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontSize: 15,
    fontWeight: "600",
  },
  containedText: {
    color: "#FFFFFF",
  },
  outlinedText: {
    color: "#1A1A1A",
  },
});
