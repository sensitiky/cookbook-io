import { Stack } from "expo-router";
import { useHandlers } from "@/assets/handlers/handler";
import { useState } from "react";
import { View, ActivityIndicator } from "react-native";

export default function RootLayout() {
  const { isAuthenticated } = useHandlers();
  const [loading, setLoading] = useState(true);
  setTimeout(() => setLoading(false), 1000);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="(home)/home"
        options={{ headerTitle: "", headerShown: false }}
      />
      <Stack.Screen
        name="(main)/main"
        options={{ headerTitle: "", headerShown: false }}
      />
      <Stack.Screen
        name="(settings)/settings"
        options={{ headerTitle: "", headerShown: false }}
      />
      <Stack.Screen
        name="(settings)/edit"
        options={{ headerTitle: "", headerShown: false }}
      />
    </Stack>
  );
}
