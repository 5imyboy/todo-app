import { Stack } from "expo-router";
import { useEffect } from "react";
import { initDB } from "../lib/db";
import { AuthProvider } from "../contexts/AuthContext";

export default function RootLayout() {
  useEffect(() => {
    initDB().catch(e => console.error("DB init failed:", e));
  }, []);

  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ title: "Login" }} />
        <Stack.Screen name="register" options={{ title: "Register" }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="task-form" options={{ presentation: "modal" }} />
      </Stack>
    </AuthProvider>
  );
}
