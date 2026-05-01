import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="not-started" options={{ title: "Not Started" }} />
      <Tabs.Screen name="in-progress" options={{ title: "In Progress" }} />
      <Tabs.Screen name="finished" options={{ title: "Finished" }} />
    </Tabs>
  );
}
