import { Tabs, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { Button, Image, Pressable, StyleSheet, Text, View } from "react-native";

export default function TabLayout() {
  const router = useRouter();
  const ICON_SIZE = 50;

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync("token");
    router.replace("/login");
  };

  return (
    <View style={{ flex: 1 }}>
      <Tabs screenOptions={{ headerRight: () => <Button title="Logout" onPress={handleLogout} /> }}>
        <Tabs.Screen name="not-started" options={{ title: "Not Started", tabBarIcon: () => <Image source={require("../../assets/images/not-started.png")} style={{ width: ICON_SIZE, height: ICON_SIZE }} /> }} />
        <Tabs.Screen name="in-progress" options={{ title: "In Progress", tabBarIcon: () => <Image source={require("../../assets/images/in-progress.png")} style={{ width: ICON_SIZE, height: ICON_SIZE }} /> }} />
        <Tabs.Screen name="finished" options={{ title: "Finished", tabBarIcon: () => <Image source={require("../../assets/images/completed.png")} style={{ width: ICON_SIZE, height: ICON_SIZE }} /> }} />
      </Tabs>

      <Pressable 
        style={styles.addButton} 
        onPress={() => router.push({ 
          pathname: "/task-form", 
          params: { 
            task: JSON.stringify({ 
              taskId: 0, 
              userId: 0, 
              title: "", 
              description: "", 
              status: "NOT_STARTED", 
              hours: 0, 
              minutes: 0 
            }) 
          } 
        })}
      >
        <Text style={styles.addButtonText}>+</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  addButton: {
    position: "absolute",
    right: 24,
    bottom: 80,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#06b6d4",
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    color: "white",
    fontSize: 36,
    lineHeight: 40,
    fontWeight: "300",
  },
});
