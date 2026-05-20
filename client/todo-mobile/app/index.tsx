import { Redirect } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import { View } from "react-native";

export default function Index() {
  const [route, setRoute] = useState<string | null>(null);

  useEffect(() => {
    SecureStore.getItemAsync("token").then(token => {
      setRoute(token ? "/(tabs)/not-started" : "/login");
    });
  }, []);

  if (!route) return <View />;
  return <Redirect href={route as any} />;
}
