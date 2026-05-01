import { Link, Tabs } from "expo-router";
import { Button } from "react-native";

const logoutButton = (
  <Link href="/login" push asChild>
    <Button title="Logout" />
  </Link>
);

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerRight: () => logoutButton }}>
      <Tabs.Screen name="not-started" options={{ title: "Not Started" }} />
      <Tabs.Screen name="in-progress" options={{ title: "In Progress" }} />
      <Tabs.Screen name="finished" options={{ title: "Finished" }} />
    </Tabs>
  );
}
