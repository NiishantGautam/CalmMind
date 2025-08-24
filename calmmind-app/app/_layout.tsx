import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { Stack } from "expo-router";
import { ElevenLabsProvider } from "@elevenlabs/react-native";

function RootLayoutWithAuth() {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    // Loader Screen
    return null;
  }

  return (
    <ElevenLabsProvider apiKey={process.env.EXPO_PUBLIC_ELEVENLABS_API_KEY}>
      <Stack>
        <Stack.Protected guard={isSignedIn}>
          {/* Show The Protected Screen if Signed In */}
          <Stack.Screen name="(protected)" options={{ headerShown: false }} />
        </Stack.Protected>

        {/* Show The Public Screen if Signed Out */}
        <Stack.Protected guard={!isSignedIn}>
          <Stack.Screen name="(public)" options={{ headerShown: false }} />
        </Stack.Protected>
      </Stack>
    </ElevenLabsProvider>
  );
}

export default function RootLayout() {
  return (
    <ClerkProvider
      tokenCache={tokenCache}
      publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY}
    >
      <RootLayoutWithAuth />
    </ClerkProvider>
  );
}
