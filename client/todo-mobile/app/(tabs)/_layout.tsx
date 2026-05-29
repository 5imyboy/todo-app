import { Tabs, useRouter } from "expo-router";
import { Button, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useAuth } from "../../contexts/AuthContext";

export default function TabLayout() {
  const router = useRouter();
  const { token, setToken } = useAuth();
  const ICON_SIZE = 50;
  const NULL_TASK = {
    task: JSON.stringify({
      taskId: 0,
      userId: 0,
      title: "",
      description: "",
      status: "NOT_STARTED",
      hours: 0,
      minutes: 0
    })
  };

  const handleLogout = () => {
    setToken(null);
  };

  return (
    <View style={{ flex: 1 }}>
      <Tabs screenOptions={{
        headerRight: () => (
          <View style={{flexDirection: "row", gap: 8 }}>
            <Pressable
              style={styles.addButton}
              onPress={() => router.push({
                pathname: "/task-form",
                params: NULL_TASK
              })}
            >
              <Text style={styles.addButtonText}>+</Text>
            </Pressable>
            {token
              ? <Button title="Logout" onPress={handleLogout} />
              : <Button title="Sign In" onPress={() => router.push("/login")} />
            }
          </View>
        )
      }}>
        <Tabs.Screen name="not-started" options={{ title: "Not Started", tabBarIcon: () => <Image source={require("../../assets/images/not-started.png")} style={{ width: ICON_SIZE, height: ICON_SIZE }} /> }} />
        <Tabs.Screen name="in-progress" options={{ title: "In Progress", tabBarIcon: () => <Image source={require("../../assets/images/in-progress.png")} style={{ width: ICON_SIZE, height: ICON_SIZE }} /> }} />
        <Tabs.Screen name="finished" options={{ title: "Finished", tabBarIcon: () => <Image source={require("../../assets/images/completed.png")} style={{ width: ICON_SIZE, height: ICON_SIZE }} /> }} />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#06b6d4",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  addButtonText: {
    color: "white",
    fontSize: 24,
    lineHeight: 28,
    fontWeight: "300",
  },
});
