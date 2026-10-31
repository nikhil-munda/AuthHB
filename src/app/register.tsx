import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import * as Application from "expo-application";
import { onAuthStateChanged } from "firebase/auth";
import { Link, router } from "expo-router";
import { auth } from "../config/firebase";
import {
  getFirebaseErrorMessage,
  logout,
  signInWithGoogleCredential,
  signUpWithEmail,
  syncUserProfile,
} from "../services/auth";
import {
  emailValidator,
  isAllowedEmailDomain,
  RESTRICTED_DOMAIN_MESSAGE,
} from "../helpers/emailValidator";
import { passwordValidator } from "../helpers/passwordValidator";
import { nameValidator } from "../helpers/nameValidator";
import TopBar from "../components/auth/TopBar";
import Header from "../components/auth/Header";
import AuthTextInput from "../components/auth/AuthTextInput";
import AuthButton from "../components/auth/AuthButton";

WebBrowser.maybeCompleteAuthSession();

const nativeGoogleRedirectUri = `${Application.applicationId ?? "com.nikhilmunda.authhb"}:/oauth2redirect`;

export default function RegisterScreen() {
  const [initializing, setInitializing] = useState(true);
  const [name, setName] = useState({ value: "", error: "" });
  const [email, setEmail] = useState({ value: "", error: "" });
  const [password, setPassword] = useState({ value: "", error: "" });
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user && isAllowedEmailDomain(user.email)) {
        try {
          await syncUserProfile(user);
          router.replace("/home");
        } catch (err) {
          console.error("Profile sync error on register auth check:", err);
          router.replace("/home");
        }
      } else {
        if (user && !isAllowedEmailDomain(user.email)) {
          await logout();
        }
        setInitializing(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    redirectUri:
      Platform.OS === "android" ? nativeGoogleRedirectUri : undefined,
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;
      handleFirebaseGoogleLogin(id_token);
    }
  }, [response]);

  const handleFirebaseGoogleLogin = async (idToken: string) => {
    try {
      setLoading(true);
      setGeneralError(null);

      const result = await signInWithGoogleCredential(idToken);
      const userEmail = result.user.email?.toLowerCase().trim() ?? "";

      if (!isAllowedEmailDomain(userEmail)) {
        await logout();
        setGeneralError(RESTRICTED_DOMAIN_MESSAGE);
        Alert.alert("Access restricted", RESTRICTED_DOMAIN_MESSAGE);
        return;
      }

      await syncUserProfile(result.user);
      router.replace("/home");
    } catch (err) {
      console.error("Firebase login error:", err);
      const failureMessage = "Something went wrong while signing in.";
      setGeneralError(failureMessage);
      Alert.alert("Login failed", failureMessage);
    } finally {
      setLoading(false);
    }
  };

  const onSignUpPressed = async () => {
    setGeneralError(null);
    const nameError = nameValidator(name.value);
    const emailError = emailValidator(email.value);
    const passwordError = passwordValidator(password.value);

    if (nameError || emailError || passwordError) {
      setName({ ...name, error: nameError });
      setEmail({ ...email, error: emailError });
      setPassword({ ...password, error: passwordError });
      return;
    }

    const normalizedEmail = email.value.trim().toLowerCase();
    if (!isAllowedEmailDomain(normalizedEmail)) {
      setEmail({ ...email, error: RESTRICTED_DOMAIN_MESSAGE });
      Alert.alert("Access restricted", RESTRICTED_DOMAIN_MESSAGE);
      return;
    }

    try {
      setLoading(true);
      const userCredential = await signUpWithEmail(
        normalizedEmail,
        password.value,
        name.value
      );
      const userEmail = userCredential.user.email?.toLowerCase().trim() ?? "";

      if (!isAllowedEmailDomain(userEmail)) {
        await logout();
        setGeneralError(RESTRICTED_DOMAIN_MESSAGE);
        Alert.alert("Access restricted", RESTRICTED_DOMAIN_MESSAGE);
        return;
      }

      await syncUserProfile(userCredential.user, name.value);
      router.replace("/home");
    } catch (err: any) {
      console.error("Registration error:", err);
      const msg = getFirebaseErrorMessage(err);
      setGeneralError(msg);
      Alert.alert("Registration Failed", msg);
    } finally {
      setLoading(false);
    }
  };

  if (initializing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#9E3B18" />
      </View>
    );
  }

  return (
    <View style={styles.page}>
      <TopBar />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          <Text style={styles.badge}>GET STARTED</Text>
          <Header>Create Account</Header>
          <Text style={styles.subtitle}>
            Join AuthHB to begin your customised wellness journey.
          </Text>

          <AuthButton
            title="Continue with Google"
            mode="outlined"
            disabled={!request || loading}
            onPress={() => promptAsync()}
          />

          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or sign up with email</Text>
            <View style={styles.dividerLine} />
          </View>

          <AuthTextInput
            label="Full Name"
            placeholder="Your full name"
            returnKeyType="next"
            value={name.value}
            onChangeText={(text) => setName({ value: text, error: "" })}
            errorText={name.error}
          />

          <AuthTextInput
            label="Email Address"
            placeholder="you@hbplus.fit"
            returnKeyType="next"
            value={email.value}
            onChangeText={(text) => setEmail({ value: text, error: "" })}
            errorText={email.error}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
          />

          <AuthTextInput
            label="Password"
            placeholder="At least 6 characters"
            returnKeyType="done"
            value={password.value}
            onChangeText={(text) => setPassword({ value: text, error: "" })}
            errorText={password.error}
            secureTextEntry
            autoCapitalize="none"
          />

          <AuthButton
            title="Create Account"
            onPress={onSignUpPressed}
            loading={loading}
            style={styles.button}
          />

          {generalError ? (
            <Text style={styles.errorText}>{generalError}</Text>
          ) : null}

          <View style={styles.row}>
            <Text style={styles.rowText}>Already have an account? </Text>
            <Link href="/" replace asChild>
              <Pressable>
                <Text style={styles.link}>Login</Text>
              </Pressable>
            </Link>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 36,
  },
  card: {
    width: "100%",
    maxWidth: 460,
    backgroundColor: "#FCF6F4",
    borderWidth: 1,
    borderColor: "#F2E5DF",
    borderRadius: 16,
    padding: 28,
    alignItems: "center",
  },
  badge: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
    color: "#9E3B18",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: "#6E6E6E",
    marginBottom: 20,
    textAlign: "center",
    lineHeight: 20,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginVertical: 14,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E8DCD6",
  },
  dividerText: {
    marginHorizontal: 12,
    fontSize: 12,
    color: "#8C7E79",
    fontWeight: "500",
  },
  button: {
    marginTop: 12,
  },
  row: {
    flexDirection: "row",
    marginTop: 18,
    alignItems: "center",
  },
  rowText: {
    fontSize: 14,
    color: "#6E6E6E",
  },
  link: {
    fontSize: 14,
    fontWeight: "700",
    color: "#9E3B18",
  },
  errorText: {
    color: "#C93B2B",
    fontSize: 13,
    marginTop: 12,
    textAlign: "center",
  },
});
