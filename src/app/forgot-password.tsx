import { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Link } from "expo-router";
import { getFirebaseErrorMessage, resetPassword } from "../services/auth";
import {
  emailValidator,
  isAllowedEmailDomain,
  RESTRICTED_DOMAIN_MESSAGE,
} from "../helpers/emailValidator";
import TopBar from "../components/auth/TopBar";
import Header from "../components/auth/Header";
import AuthTextInput from "../components/auth/AuthTextInput";
import AuthButton from "../components/auth/AuthButton";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState({ value: "", error: "" });
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const onSendPressed = async () => {
    setStatusMessage(null);
    const emailError = emailValidator(email.value);

    if (emailError) {
      setEmail({ ...email, error: emailError });
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
      await resetPassword(normalizedEmail);
      const successText =
        "Password reset instructions have been sent to your email.";
      setStatusMessage({ type: "success", text: successText });
      Alert.alert("Email Sent", successText);
    } catch (err: any) {
      console.error("Forgot password error:", err);
      const msg = getFirebaseErrorMessage(err);
      setStatusMessage({ type: "error", text: msg });
      Alert.alert("Reset Failed", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.page}>
      <TopBar />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          <Text style={styles.badge}>ACCOUNT RECOVERY</Text>
          <Header>Forgot Password</Header>
          <Text style={styles.subtitle}>
            Enter your registered email address and we will send you a link to
            reset your password.
          </Text>

          <AuthTextInput
            label="Email Address"
            placeholder="you@hbplus.fit"
            returnKeyType="done"
            value={email.value}
            onChangeText={(text) => setEmail({ value: text, error: "" })}
            errorText={email.error}
            description="You will receive an email with a password reset link."
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
          />

          <AuthButton
            title="Send Reset Link"
            onPress={onSendPressed}
            loading={loading}
            style={styles.button}
          />

          {statusMessage ? (
            <Text
              style={
                statusMessage.type === "success"
                  ? styles.successText
                  : styles.errorText
              }
            >
              {statusMessage.text}
            </Text>
          ) : null}

          <Link href="/" replace asChild>
            <Pressable style={styles.backButton}>
              <Text style={styles.backText}>← Back to Login</Text>
            </Pressable>
          </Link>
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
  button: {
    marginTop: 12,
  },
  backButton: {
    marginTop: 18,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  backText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#9E3B18",
  },
  successText: {
    color: "#1D7A46",
    fontSize: 13,
    marginTop: 14,
    textAlign: "center",
  },
  errorText: {
    color: "#C93B2B",
    fontSize: 13,
    marginTop: 14,
    textAlign: "center",
  },
});
