import { View, StyleSheet, ScrollView } from "react-native";
import Gradient from "@/components/animations/skia/components/gradient";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { ConversationResponse } from "@/utils/types";

export default function SummaryScreen() {
  const { conversationId } = useLocalSearchParams();
  const { conversation, setConversation } = useState<ConversationResponse>();

  console.log("Conversation ID", conversationId);
  return (
    <>
      <Gradient isSpeaking={false} position="bottom" />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{ paddingHorizontal: 16 }}
      ></ScrollView>
    </>
  );
}
