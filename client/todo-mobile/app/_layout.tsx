import { Stack, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect } from "react";

export default function RootLayout() {
  const router = useRouter();

  useEffect(() => {
    SecureStore.getItemAsync("token").then(token => {
      if (token) {
        router.replace("/(tabs)/not-started");
      } else {
        router.replace("/login");
      }
    });
  }, []);

  return (
    <Stack>
      <Stack.Screen name="login" options={{ title: "Login" }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="add-task" options={{ title: "Add Task", presentation: "modal" }} />
    </Stack>
  );
}
