import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useAuth } from "../contexts/AuthContext";
import { updateTask, deleteTask } from "../lib/db";

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

  const { token } = useAuth();
  const router = useRouter();

  const handleStatusChange = async (forward: boolean) => {
    const currentStatusId = STATUS_ORDER.indexOf(task.status);
    const newStatusId = forward ? currentStatusId + 1 : currentStatusId - 1;
    if (newStatusId < 0 || newStatusId >= STATUS_ORDER.length) return;

    const updatedTask = { ...task, status: STATUS_ORDER[newStatusId] };
    try {
      if (!token) {
        await updateTask(updatedTask);
        onStatusChange(updatedTask);
        return;
      }
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
      if (response.status !== 204) {
        console.error("Unexpected status:", response.status);
        return;
      }
      onStatusChange(updatedTask);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async () => {
    try {
      if (!token) {
        await deleteTask(task.taskId);
        onDelete(task.taskId);
        return;
      }
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/task/delete/${task.taskId}`,
        {
          method: "DELETE",
          headers: { "Authorization": `Bearer ${token}` },
        }
      );
      if (response.status === 404) {
        console.error("Task not found:", task.taskId);
        return;
      }
      if (response.status !== 204) {
        console.error("Unexpected status:", response.status);
        return;
      }
      onDelete(task.taskId);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && { backgroundColor: "rgba(80, 185, 255, 0.9)" }]}
      onLongPress={() => router.push({ pathname: "/task-form", params: { task: JSON.stringify(task) } })}
    >
      <Text style={styles.title}>{task.title}</Text>
      <Text style={styles.notes}>{task.description}</Text>
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
    backgroundColor: "rgba(142, 214, 255, 0.81)",
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