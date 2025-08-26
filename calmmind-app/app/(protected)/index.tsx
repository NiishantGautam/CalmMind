import { StyleSheet, Text, View, Pressable, ScrollView } from "react-native";
import { theme } from "@/theme";
import { sessions } from "@/utils/sessions";
import { useRouter } from "expo-router";

export default function Index() {
  const router = useRouter();

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      {sessions.map((session) => {
        return (
          <Pressable
            key={session.id}
            style={styles.session}
            onPress={() =>
              router.navigate({
                pathname: "/session",
                params: { sessionId: session.id },
              })
            }
          >
            <Text>{session.title}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({

  session: {
    borderWidth: 2,
    padding: 16,
    marginVertical: 6,
  },
});
