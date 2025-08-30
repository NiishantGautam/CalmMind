import { Text, View, StyleSheet, ScrollView } from "react-native";
import { useConversation } from "@elevenlabs/react-native";
import { theme } from "@/theme";
import { useUser } from "@clerk/clerk-expo";
import { Redirect, useLocalSearchParams, useRouter } from "expo-router";
import { sessions } from "@/utils/sessions";
import Button from "@/components/ui/Button";
import React from "react";
import * as Brightness from "expo-brightness";
import {router} from "expo-router";

import Gradient from "../animations/skia/components/gradient";

export default function SessionScreen() {
  const { user } = useUser();
  const { sessionId } = useLocalSearchParams();
  const router = useRouter();

  const session =
    sessions.find((session) => session.id === Number(sessionId)) ?? sessions[0];

  const [isStarting, setIsStarting] = React.useState(false);
  const [conversationId, setConversationId] = React.useState<string | null>(
    null,
  );

  if (!sessionId) {
    return <Redirect href="/" />;
  }

  const conversation = useConversation({
    onConnect: ({ conversationId }) => {
      setConversationId(conversationId);
      console.log("Conversation Started with iD", conversationId);
    },
    onDisconnect: () => console.log("Disconnected from conversation"),
    onMessage: (message) => console.log("Received message:", message),
    onError: (error) => console.error("Conversation error:", error),

    clientTools: {
      handleSetBrightness: async (parameters: unknown) => {
        const { brightnessValue } = parameters as { brightnessValue: number };
        console.log(`Setting Brightness to`, { brightnessValue });

        const { status } = await Brightness.requestPermissionsAsync();
        if (status === "granted") {
          await Brightness.setSystemBrightnessAsync(brightnessValue);
          return brightnessValue;
        }
      },
    },
  });

  const startConversation = async () => {
    if (isStarting) return;

    try {
      setIsStarting(true);
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
    } finally {
      setIsStarting(false);
    }
  };

  const endConversation = async () => {
    try {
      await conversation.endSession();
      router.push({
        pathname: "/summary",
        params: {conversationId: conversationId},
      })
    } catch (error) {
      console.error("Failed to end conversation:", error);
    }
  };

  const canStart = conversation.status == "disconnected" && !isStarting;
  const canEnd = conversation.status == "connected";

  return (
    <>
      <Gradient
        position="top"
        isSpeaking={
          conversation.status === "connected" ||
          conversation.status === "connecting"
        }
      />

      <View style={styles.container}>
        <Text>Session Screen with ID: {session.id}</Text>
        <Text style={{ fontSize: 32, fontWeight: "bold" }}>
          {session.title}
        </Text>
        <Text style={{ fontSize: 16, fontWeight: 500, opacity: 0.5 }}>
          {session.description}
        </Text>
        <Button
          onPress={canStart ? startConversation : endConversation}
          disabled={!canStart && !canEnd}
        >
          {canStart ? "Start Conversatoin" : "End conversation "}
        </Button>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
});
