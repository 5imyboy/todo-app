import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { Text, View } from "react-native";

interface Task {
  taskId: number;
  title: string;
  status: string;
  userId: number;
}

async function loadTasks(url: string) {
  try {
    const token = await SecureStore.getItemAsync("token");
    const response = await fetch(`${url}`, {
      method: "GET",
      headers: { "Authorization": `Bearer ${token}` },
    });
    if (!(response.status === 200 || response.status === 400)) {
      return Promise.reject(`Unexpected Status Code: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (e) {
    console.error(e);
  }
}

export default function Finished() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const url = `${process.env.EXPO_PUBLIC_API_URL}/task/status/completed`;

  useEffect(() => {
    const loadAll = async () => {
      await loadTasks(url).then(setTasks);
    }
    loadAll();
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
