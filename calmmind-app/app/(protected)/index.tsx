import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { theme } from "@/theme";
import SignOutButton from "@/components/clerk/SignOutButton";


export default function App() {
  return (
    <View style={styles.container}>
      <Text>Home Screen</Text>
      <SignOutButton />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colorWhite,
    alignItems: "center",
    justifyContent: "center",
  },
});
