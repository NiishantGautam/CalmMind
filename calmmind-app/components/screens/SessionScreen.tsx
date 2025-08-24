import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
} from "react-native";
import { useConversation } from "@elevenlabs/react-native";
import { theme } from "@/theme";
import { useUser } from "@clerk/clerk-expo";

export default function SessionScreen() {
  const { user } = useUser();
  const conversation = useConversation({
    onConnect: () => console.log("Connected to conversation"),
    onDisconnect: () => console.log("Disconnected from conversation"),
    onMessage: (message) => console.log("Received message:", message),
    onError: (error) => console.error("Conversation error:", error),
    onModeChange: (mode) => console.log("Conversation mode changed:", mode),
    onStatusChange: (prop) =>
      console.log("Conversation status changed:", prop.status),
    onCanSendFeedbackChange: (prop) =>
      console.log("Can send feedback changed:", prop.canSendFeedback),
    onUnhandledClientToolCall: (params) =>
      console.log("Unhandled client tool call:", params),
  });

  const startConversation = async () => {
    try {
      await conversation.startSession({
        agentId: process.env.EXPO_PUBLIC_AGENT_ID,
        dynamicVariables: {
          username: user?.username ?? "friend",
          time_of_day: "today",
          session_title: "a short reset",
          goal: "staying consistent",
          mood: "feeling a bit unsettled",
        },
      });
    } catch (e) {
      console.log(e);
    }
  };

  const endConversation = async () => {
    try {
      await conversation.endSession();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <Text style={styles.title}>
          Mindful Session with {user?.firstName ?? "friend"}
        </Text>
        <Text style={styles.subtitle}>
          Connect with your AI mindfulness guide
        </Text>
      </View>

      <View style={styles.content}>
        <View style={styles.sessionInfo}>
          <Text style={styles.sessionTitle}>Today's Reset Session</Text>
          <Text style={styles.sessionDescription}>
            A guided conversation to help you stay centered and consistent with
            your mindfulness practice.
          </Text>
        </View>

        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={startConversation}
          >
            <Text style={styles.primaryButtonText}>Start Session</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={endConversation}
          >
            <Text style={styles.secondaryButtonText}>End Session</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tipsContainer}>
          <Text style={styles.tipsTitle}>Session Tips:</Text>
          <Text style={styles.tipText}>• Find a quiet, comfortable space</Text>
          <Text style={styles.tipText}>
            • Use headphones for better audio quality
          </Text>
          <Text style={styles.tipText}>
            • Speak naturally and take your time
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colorWhite,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 32,
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: theme.colorBlack,
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: theme.colorGray,
    textAlign: "center",
    lineHeight: 22,
  },

  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  sessionInfo: {
    backgroundColor: "#F8F9FA",
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
  },
  sessionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: theme.colorBlack,
    marginBottom: 8,
  },
  sessionDescription: {
    fontSize: 16,
    color: theme.colorGray,
    lineHeight: 24,
  },
  actionContainer: {
    marginBottom: 40,
    gap: 16,
  },
  primaryButton: {
    backgroundColor: "#6366F1",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: "center",
    shadowColor: "#6366F1",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },

  primaryButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#EF4444",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "#EF4444",
    fontSize: 18,
    fontWeight: "600",
  },
  tipsContainer: {
    backgroundColor: "#FEF3C7",
    borderRadius: 12,
    padding: 16,
    marginTop: "auto",
    marginBottom: 32,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#92400E",
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    color: "#92400E",
    marginBottom: 4,
    lineHeight: 20,
  },
});
