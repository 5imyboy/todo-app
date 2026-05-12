import { useState } from "react";
import { Tabs, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { Button, Pressable, StyleSheet, Text, View } from "react-native";
import AddTaskModal from "../../components/AddTaskModal";

export default function TabLayout() {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync("token");
    router.replace("/login");
  };

  return (
    <View style={{ flex: 1 }}>
      <Tabs screenOptions={{ headerRight: () => <Button title="Logout" onPress={handleLogout} /> }}>
        <Tabs.Screen name="not-started" options={{ title: "Not Started" }} />
        <Tabs.Screen name="in-progress" options={{ title: "In Progress" }} />
        <Tabs.Screen name="finished" options={{ title: "Finished" }} />
      </Tabs>

      <Pressable style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.addButtonText}>+</Text>
      </Pressable>

      <AddTaskModal visible={modalVisible} onClose={() => setModalVisible(false)} />
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
