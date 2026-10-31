import { ReactNode } from "react";
import { StyleSheet, Text } from "react-native";

type Props = {
  children: ReactNode;
};

export default function Header({ children }: Props) {
  return <Text style={styles.header}>{children}</Text>;
}

const styles = StyleSheet.create({
  header: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1A1A1A",
    paddingVertical: 4,
    textAlign: "center",
  },
});
