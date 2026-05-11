import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { Text, View } from "react-native";

interface Task {
  taskId: number;
  title: string;
  status: string;
  userId: number;
}

export default function In_Progress() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const url = `${process.env.EXPO_PUBLIC_API_URL}/task/status/in-progress`;
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
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Edit app/index.tsx to edit this screen.</Text>
      <View className="row-span-10 h-full w-8/10 grid grid-cols-3 flex flex-row gap-[32px] items-center rounded">
        <View className="bg-sky-400 h-full col-span-1 rounded-2xl">
          {tasks.map(t => <Text key={t.taskId}> {t.title} </Text>)}
        </View>
      </View>
    </View>
  );
}
