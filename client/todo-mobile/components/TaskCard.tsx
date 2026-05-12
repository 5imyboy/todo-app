import * as SecureStore from "expo-secure-store";
import { Pressable, StyleSheet, Text, View } from "react-native";

export interface Task {
  taskId: number;
  userId: number;
  title: string;
  description: string;
  status: string;
  hours: number;
  minutes: number;
}

export default function TaskCard({ task, onDelete }: { task: Task; onDelete: (taskId: number) => void }) {
  const time = task.hours !== 0
    ? `${task.hours} hours`
    : `${task.minutes} minutes`;

  const handleDelete = async () => {
    try {
      const token = await SecureStore.getItemAsync("token");
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/task/delete/${task.taskId}`,
        {
          method: "DELETE",
          headers: { "Authorization": `Bearer ${token}` },
        }
      );
      if (response.status === 204) {
        onDelete(task.taskId);
        return;
      }
      if (response.status === 404) {
        console.error("Task not found:", task.taskId);
        return;
      }
      console.error("Unexpected status:", response.status);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{task.title}</Text>
      <Text style={styles.notes}>Notes: {task.description}</Text>
      <Text style={styles.time}>Time: {time}</Text>
      <View style={styles.buttonRow}>
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>←</Text>
        </Pressable>
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>→</Text>
        </Pressable>
        <Pressable style={[styles.button, styles.deleteButton]} onPress={handleDelete}>
          <Text style={styles.buttonText}>x</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "rgba(250, 250, 250, 0.25)",
    borderRadius: 12,
    padding: 12,
    marginVertical: 6,
    marginHorizontal: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 8,
  },
  notes: {
    fontSize: 14,
    marginBottom: 4,
  },
  time: {
    fontSize: 14,
    marginBottom: 8,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 8,
  },
  button: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  deleteButton: {
    borderColor: "#f87171",
  },
  buttonText: {
    fontWeight: "bold",
  },
});
