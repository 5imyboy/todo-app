import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { ScrollView } from "react-native";
import TaskCard, { Task } from "../../components/TaskCard";

export default function Finished() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const url = `${process.env.EXPO_PUBLIC_API_URL}/task/status/completed`;
  const router = useRouter();

  useEffect(() => {
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
  }, []);

  return (
    <ScrollView>
      {tasks.map(t => <TaskCard key={t.taskId} task={t} />)}
    </ScrollView>
  );
}
