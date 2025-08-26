import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  ImageBackground,
  ScrollView,
} from "react-native";
import { useConversation } from "@elevenlabs/react-native";
import { theme } from "@/theme";
import { useUser } from "@clerk/clerk-expo";
import { Redirect, useLocalSearchParams } from "expo-router";
import { sessions } from "@/utils/sessions";
import { LinearGradient } from "expo-linear-gradient";

export default function SessionScreen() {
  const { user } = useUser();
  const { sessionId } = useLocalSearchParams();
  const session =
    sessions.find((session) => session.id === Number(sessionId)) ?? sessions[0];

  if (!sessionId) {
    return <Redirect href="/" />;
  }

  const conversation = useConversation({
    onConnect: () => console.log("Connected to conversation"),
    onDisconnect: () => console.log("Disconnected from conversation"),
    onMessage: (message) => console.log("Received message:", message),
    onError: (error) => console.error("Conversation error:", error),
  });

  const startConversation = async () => {
    try {
      await conversation.startSession({
        agentId: process.env.EXPO_PUBLIC_AGENT_ID,
        dynamicVariables: {
          username: user?.username ?? "friend",
          time_of_day: "today",
          session_title: session.title,
          goal: session.description,
          mood: session.event,
        },
      });
    } catch (error) {
      console.error("Failed to start conversation:", error);
    }
  };

  const endConversation = async () => {
    try {
      await conversation.endSession();
    } catch (error) {
      console.error("Failed to end conversation:", error);
    }
  };

  // Get theme colors based on session type
  const getSessionTheme = () => {
    switch (session.id) {
      case 1: // Guts' Struggle
        return {
          primary: "#8B0000",
          secondary: "#2F1B14",
          accent: "#FFD700",
          gradient: ["#1a1a1a", "#2F1B14", "#8B0000"],
        };
      case 2: // Black Swordsman
        return {
          primary: "#000000",
          secondary: "#1C1C1C",
          accent: "#C0C0C0",
          gradient: ["#000000", "#1C1C1C", "#2F2F2F"],
        };
      case 3: // Band of the Hawk
        return {
          primary: "#4169E1",
          secondary: "#191970",
          accent: "#FFD700",
          gradient: ["#000080", "#191970", "#4169E1"],
        };
      case 4: // Casca's Resilience
        return {
          primary: "#8B4513",
          secondary: "#5D4E75",
          accent: "#DDA0DD",
          gradient: ["#2F1B14", "#5D4E75", "#8B4513"],
        };
      case 5: // Eclipse
        return {
          primary: "#800080",
          secondary: "#4B0082",
          accent: "#FF4500",
          gradient: ["#000000", "#4B0082", "#800080"],
        };
      case 6: // Berserker's Peace
        return {
          primary: "#8B0000",
          secondary: "#006400",
          accent: "#40E0D0",
          gradient: ["#006400", "#2F4F4F", "#8B0000"],
        };
      default:
        return {
          primary: theme.colorTeal,
          secondary: theme.colorMediumBlue,
          accent: "#FFD700",
          gradient: [theme.colorBlack, theme.colorGray, theme.colorTeal],
        };
    }
  };

  const sessionTheme = getSessionTheme();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={sessionTheme.primary}
      />

      <ImageBackground
        source={session.image}
        style={styles.backgroundImage}
        imageStyle={styles.backgroundImageStyle}
      >
        <LinearGradient
          colors={[...sessionTheme.gradient, "rgba(0,0,0,0.8)"]}
          style={styles.gradientOverlay}
        >
          <ScrollView 
            style={styles.scrollContainer}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.header}>
              <View style={styles.sessionBadge}>
                <Text style={styles.sessionNumber}>Session {session.id}</Text>
              </View>
              <Text style={[styles.title, { color: sessionTheme.accent }]}>
                {session.title}
              </Text>
              <Text style={[styles.subtitle, { color: "#E0E0E0" }]}>
                {session.event}
              </Text>
              <View style={styles.userGreeting}>
                <Text style={styles.greetingText}>
                  Welcome back, {user?.firstName ?? "Warrior"} ⚔️
                </Text>
              </View>
            </View>

            <View style={styles.content}>
            <View
              style={[styles.sessionInfo, { borderColor: sessionTheme.accent }]}
            >
              <Text
                style={[styles.sessionTitle, { color: sessionTheme.accent }]}
              >
                🧘‍♂️ {session.title}
              </Text>
              <Text style={styles.sessionDescription}>
                {session.description}
              </Text>

              <View style={styles.sessionMetrics}>
                <View style={styles.metric}>
                  <Text style={styles.metricValue}>15-20</Text>
                  <Text style={styles.metricLabel}>Minutes</Text>
                </View>
                <View style={styles.metric}>
                  <Text style={styles.metricValue}>🎯</Text>
                  <Text style={styles.metricLabel}>Focused</Text>
                </View>
                <View style={styles.metric}>
                  <Text style={styles.metricValue}>🌟</Text>
                  <Text style={styles.metricLabel}>Guided</Text>
                </View>
              </View>
            </View>

            <View style={styles.actionContainer}>
              <TouchableOpacity
                style={[
                  styles.primaryButton,
                  { backgroundColor: sessionTheme.primary },
                ]}
                onPress={startConversation}
              >
                <Text style={styles.primaryButtonText}>🎙️ Begin Journey</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.secondaryButton,
                  { borderColor: sessionTheme.accent },
                ]}
                onPress={endConversation}
              >
                <Text
                  style={[
                    styles.secondaryButtonText,
                    { color: sessionTheme.accent },
                  ]}
                >
                  ⏸️ End Session
                </Text>
              </TouchableOpacity>
            </View>

            <View
              style={[
                styles.tipsContainer,
                { backgroundColor: "rgba(0,0,0,0.6)" },
              ]}
            >
              <Text style={[styles.tipsTitle, { color: sessionTheme.accent }]}>
                ⚔️ Warrior's Preparation:
              </Text>
              <Text style={styles.tipText}>
                🏰 Find your sanctuary - a quiet, sacred space
              </Text>
              <Text style={styles.tipText}>
                🎧 Equip your headphones for crystal-clear guidance
              </Text>
              <Text style={styles.tipText}>
                💬 Speak from the heart - your inner voice matters
              </Text>
              <Text style={styles.tipText}>
                ⏰ Take your time - this is your moment of peace
              </Text>
            </View>
            </View>
          </ScrollView>
        </LinearGradient>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  backgroundImageStyle: {
    opacity: 0.3,
  },
  gradientOverlay: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 30,
    alignItems: "center",
  },
  sessionBadge: {
    backgroundColor: "rgba(255, 215, 0, 0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#FFD700",
  },
  sessionNumber: {
    color: "#FFD700",
    fontSize: 12,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
    textShadowColor: "rgba(0, 0, 0, 0.8)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 15,
    fontStyle: "italic",
  },
  userGreeting: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  greetingText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
    minHeight: 600, // Ensure minimum height for proper layout
  },
  sessionInfo: {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    padding: 24,
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 2,
  },
  sessionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  sessionDescription: {
    fontSize: 16,
    lineHeight: 24,
    color: "#E0E0E0",
    textAlign: "center",
    marginBottom: 20,
  },
  sessionMetrics: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    paddingVertical: 12,
  },
  metric: {
    alignItems: "center",
  },
  metricValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFD700",
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    color: "#C0C0C0",
    textTransform: "uppercase",
  },
  actionContainer: {
    gap: 16,
    marginBottom: 20,
  },
  primaryButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  secondaryButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 2,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  tipsContainer: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  tipText: {
    fontSize: 14,
    color: "#C0C0C0",
    marginBottom: 8,
    lineHeight: 20,
  },
});
