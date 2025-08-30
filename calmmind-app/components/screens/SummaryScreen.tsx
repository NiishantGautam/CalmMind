import { View, StyleSheet, ScrollView, Text } from "react-native";
import Gradient from "@/components/animations/skia/components/gradient";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ConversationResponse } from "@/utils/types";

export default function SummaryScreen() {
  const { conversationId } = useLocalSearchParams();
  const { conversation, setConversation } = useState<ConversationResponse>();

  console.log("Conversation ID", conversationId);

  useEffect(() => {
    getSummary()
  }, []);

  async function getSummary() {
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_BASE_URL}/api/conversations?conversationId=${conversationId}}`,
    );
    const data = ({ conversation: ConversationResponse } =
      await response.json());
    setConversation(data.conversation);
  }

  return (
    <Text>
      <Gradient isSpeaking={false} position="bottom" />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{ paddingHorizontal: 16 }}

      >
        <Text>{conversatio?.agentId}</Text>
      </ScrollView>
    </>
  );
}
