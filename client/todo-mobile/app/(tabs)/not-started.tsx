import { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { ScrollView } from "react-native";
import TaskCard, { Task } from "../../components/TaskCard";
import { useAuth } from "../../contexts/AuthContext";
import { getTasksByStatus } from "../../lib/db";

export default function Not_Started() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const { token, setToken } = useAuth();
  const url = `${process.env.EXPO_PUBLIC_API_URL}/task/status/not-started`;

  useFocusEffect(
    useCallback(() => {
      const loadTasks = async () => {
        try {
          if (!token) {
            setTasks(await getTasksByStatus("NOT_STARTED"));
            return;
          }
          const response = await fetch(url, {
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` },
          });
          if (response.status === 401 || response.status === 403) {
            setToken(null);
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
    }, [token])
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
