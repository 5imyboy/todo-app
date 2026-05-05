import { Tabs, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { Button } from "react-native";

export default function TabLayout() {
  const router = useRouter();

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync("token");
    router.replace("/login");
  };

  return (
    <Tabs screenOptions={{ headerRight: () => <Button title="Logout" onPress={handleLogout} /> }}>
      <Tabs.Screen name="not-started" options={{ title: "Not Started" }} />
      <Tabs.Screen name="in-progress" options={{ title: "In Progress" }} />
      <Tabs.Screen name="finished" options={{ title: "Finished" }} />
    </Tabs>
  );
}
