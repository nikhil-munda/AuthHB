import { Pressable, StyleSheet, View } from "react-native";
import { router } from "expo-router";
import { auth } from "../../config/firebase";
import { isAllowedEmailDomain } from "../../helpers/emailValidator";
import Logo from "./Logo";

export default function TopBar() {
  const handleLogoPress = () => {
    if (auth.currentUser && isAllowedEmailDomain(auth.currentUser.email)) {
      router.replace("/home");
    } else {
      router.replace("/");
    }
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.inner}>
        <Pressable
          onPress={handleLogoPress}
          style={({ pressed }) => [pressed && styles.pressed]}
          accessibilityRole="button"
          accessibilityLabel="AuthHB Home"
        >
          <Logo size="small" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F5ECE8",
  },
  inner: {
    width: "100%",
    maxWidth: 1120,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  pressed: {
    opacity: 0.7,
  },
});
