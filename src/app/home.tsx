import { useEffect, useState } from "react";
import { router } from "expo-router";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../config/firebase";
import { logout, syncUserProfile } from "../services/auth";
import { isAllowedEmailDomain } from "../helpers/emailValidator";
import TopBar from "../components/auth/TopBar";

const WELLNESS_SECTIONS = [
  {
    title: "Fully Customised Wellness Journeys",
    subtitle: "Show more",
  },
  {
    title: "Session-Based Flexibility",
    subtitle: "Show more",
  },
  {
    title: "Long-Term Plans that you can Pause whenever you like",
    subtitle: "Show more",
  },
  {
    title: "1:1 Live Online Expert Sessions",
    subtitle: "Show more",
  },
  {
    title: "Science-Backed & Clinically Informed",
    subtitle: "Show more",
  },
  {
    title: "Human Accountability & Real Support",
    subtitle: "Show more",
  },
];

export default function HomeScreen() {
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.replace("/");
        return;
      }
      if (!isAllowedEmailDomain(user.email)) {
        await logout();
        router.replace("/");
        return;
      }
      try {
        await syncUserProfile(user);
      } catch (err) {
        console.error("Error syncing user profile:", err);
      }
      setEmail(user.email ?? null);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
    router.replace("/");
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#9E3B18" />
      </View>
    );
  }

  return (
    <View style={styles.page}>
      <TopBar />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.contentWrapper}>
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeTitle}>Welcome to AuthHB 👋</Text>
            <Text style={styles.welcomeSubtitle}>
              You are successfully signed in.
            </Text>
            {email ? (
              <View style={styles.emailBadge}>
                <Text style={styles.emailLabel}>Signed in as: </Text>
                <Text style={styles.emailValue}>{email}</Text>
              </View>
            ) : null}
          </View>

          <View style={styles.grid}>
            {WELLNESS_SECTIONS.map((item) => (
              <View key={item.title} style={styles.sectionBox}>
                <Text style={styles.sectionTitle}>{item.title}</Text>
                <Text style={styles.sectionLink}>{item.subtitle}</Text>
              </View>
            ))}
          </View>

          <View style={styles.banner}>
            <Text style={styles.bannerTag}>Personalised Wellness Care</Text>
            <Text style={styles.bannerTitle}>
              Complete Wellness & Lifestyle Assessment
            </Text>
            <Text style={styles.bannerDescription}>
              We help personalise your wellness pathway through structured
              guidance, expert sessions, and continuous support tailored to your
              goals.
            </Text>

            <Pressable
              onPress={handleLogout}
              style={({ pressed }) => [
                styles.bannerLogoutButton,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.bannerLogoutText}>Logout</Text>
            </Pressable>
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
  pressed: {
    opacity: 0.85,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 32,
  },
  contentWrapper: {
    width: "100%",
    maxWidth: 1080,
    alignSelf: "center",
  },
  welcomeSection: {
    marginBottom: 28,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 6,
  },
  welcomeSubtitle: {
    fontSize: 15,
    color: "#6E6E6E",
    marginBottom: 12,
  },
  emailBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "#FCF6F4",
    borderWidth: 1,
    borderColor: "#F2E5DF",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  emailLabel: {
    fontSize: 13,
    color: "#6E6E6E",
  },
  emailValue: {
    fontSize: 13,
    fontWeight: "700",
    color: "#9E3B18",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    marginBottom: 28,
  },
  sectionBox: {
    flexGrow: 1,
    flexBasis: 320,
    backgroundColor: "#FCF6F4",
    borderWidth: 1,
    borderColor: "#F2E5DF",
    borderRadius: 12,
    paddingHorizontal: 22,
    paddingVertical: 22,
    justifyContent: "space-between",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 14,
  },
  sectionLink: {
    fontSize: 14,
    fontWeight: "500",
    color: "#3D3531",
  },
  banner: {
    width: "100%",
    backgroundColor: "#9E3B18",
    borderRadius: 20,
    paddingHorizontal: 28,
    paddingVertical: 36,
    alignItems: "center",
  },
  bannerTag: {
    fontSize: 13,
    color: "#F5D9CE",
    fontWeight: "500",
    marginBottom: 8,
    textAlign: "center",
  },
  bannerTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 12,
    textAlign: "center",
  },
  bannerDescription: {
    fontSize: 14,
    color: "#F5D9CE",
    textAlign: "center",
    maxWidth: 680,
    lineHeight: 22,
    marginBottom: 22,
  },
  bannerLogoutButton: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 8,
  },
  bannerLogoutText: {
    color: "#9E3B18",
    fontSize: 14,
    fontWeight: "700",
  },
});
