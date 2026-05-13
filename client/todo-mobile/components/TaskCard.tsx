import * as SecureStore from "expo-secure-store";
import { useRouter } from "expo-router";
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

const STATUS_ORDER = ["NOT_STARTED", "IN_PROGRESS", "COMPLETED"];

export default function TaskCard({
  task,
  onDelete,
  onStatusChange,
}: {
  task: Task;
  onDelete: (taskId: number) => void;
  onStatusChange: (updatedTask: Task) => void;
}) {
  const time = task.hours !== 0
    ? `${task.hours} hours`
    : `${task.minutes} minutes`;

  const handleStatusChange = async (forward: boolean) => {
    const currentStatusId = STATUS_ORDER.indexOf(task.status);
    const newStatusId = forward ? currentStatusId + 1 : currentStatusId - 1;
    if (newStatusId < 0 || newStatusId >= STATUS_ORDER.length) return;

    const updatedTask = { ...task, status: STATUS_ORDER[newStatusId] };
    try {
      const token = await SecureStore.getItemAsync("token");
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/task/update/${task.taskId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify(updatedTask),
        }
      );
      if (response.status === 204) {
        onStatusChange(updatedTask);
        return;
      }
      console.error("Unexpected status:", response.status);
    } catch (e) {
      console.error(e);
    }
  };

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

  const router = useRouter();

  return (
    <Pressable
      style={styles.card}
      onLongPress={() => router.push({ pathname: "/task-form", params: { task: JSON.stringify(task) } })}
    >
      <Text style={styles.title}>{task.title}</Text>
      <Text style={styles.notes}>Notes: {task.description}</Text>
      <Text style={styles.time}>Time: {time}</Text>
      <View style={styles.buttonRow}>
        <Pressable style={styles.button} onPress={() => handleStatusChange(false)}>
          <Text style={styles.buttonText}>←</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={() => handleStatusChange(true)}>
          <Text style={styles.buttonText}>→</Text>
        </Pressable>
        <Pressable style={[styles.button, styles.deleteButton]} onPress={handleDelete}>
          <Text style={styles.buttonText}>x</Text>
        </Pressable>
      </View>
    </Pressable>
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