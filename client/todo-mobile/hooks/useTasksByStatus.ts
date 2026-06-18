import { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";
import { Task } from "../components/TaskCard";
import { useAuth } from "../contexts/AuthContext";
import { getTasksByStatus } from "../lib/db";

export function useTasksByStatus(apiSlug: string, dbStatus: string) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const { token, setToken } = useAuth();
  const url = `${process.env.EXPO_PUBLIC_API_URL}/task/status/${apiSlug}`;

  useFocusEffect(
    useCallback(() => {
      const loadTasks = async () => {
        try {
          if (!token) {
            setTasks(await getTasksByStatus(dbStatus));
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

  return { tasks, setTasks };
}
