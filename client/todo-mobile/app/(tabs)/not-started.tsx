import { useCallback, useState } from "react";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import { ScrollView } from "react-native";
import TaskCard, { Task } from "../../components/TaskCard";

export default function Not_Started() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const url = `${process.env.EXPO_PUBLIC_API_URL}/task/status/not-started`;
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      const loadTasks = async () => {
        try {
          const token = await SecureStore.getItemAsync("token");
          const response = await fetch(url, {
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` },
          });
          if (response.status === 401 || response.status === 403) {
            await SecureStore.deleteItemAsync("token");
            router.replace("/login");
            return;
          }
          if (response.status !== 200) {
            console.error("Unexpected status:", response.status);
            return;
          }
          setTasks(await response.json());
        } catch (e) {
          console.error(e);
        }
      };
      loadTasks();
    }, [])
  );

  return (
    <ScrollView>
      {tasks.map(t => (
        <TaskCard
          key={t.taskId}
          task={t}
          onDelete={(id) => setTasks(prev => prev.filter(t => t.taskId !== id))}
          onStatusChange={(updated) => setTasks(prev => prev.filter(t => t.taskId !== updated.taskId))}
        />
      ))}
    </ScrollView>
  );
}
