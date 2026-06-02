import { useState } from "react";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useAuth } from "../contexts/AuthContext";
import { addTask, updateTask } from "../lib/db";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { Task } from "../components/TaskCard";

export default function TaskForm() {
  const router = useRouter();
  const { task: taskParam } = useLocalSearchParams<{ task: string }>();
  const existing: Task = JSON.parse(taskParam);
  const isNewTask = existing.taskId === 0;

  const { token } = useAuth();
  const [form, setForm] = useState(existing);
  const [isHours, setIsHours] = useState(existing.hours !== 0);
  const [errors, setErrors] = useState<string[]>([]);

  const toggleTimeUnit = (value: boolean) => {
    setIsHours(value);
    setForm(prev => {
      if (value) {
        return { ...prev, hours: prev.minutes, minutes: 0 };
      } else {
        return { ...prev, minutes: prev.hours, hours: 0 };
      }
    });
  };

  const handleSubmit = async () => {
    try {
      if (!token) {
        if (isNewTask) {
          await addTask(form);
        } else {
          await updateTask(form);
        }
        router.back();
        return;
      }
      const response = await fetch(
        isNewTask
          ? `${process.env.EXPO_PUBLIC_API_URL}/task/add`
          : `${process.env.EXPO_PUBLIC_API_URL}/task/update/${form.taskId}`,
        {
          method: isNewTask ? "POST" : "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify(form),
        }
      );
      const successStatus = isNewTask ? 201 : 204;
      if (response.status === successStatus) {
        router.back();
        return;
      }
      if (response.status === 400) {
        setErrors(await response.json());
        return;
      }
      console.error("Unexpected status:", response.status);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <ScrollView keyboardShouldPersistTaps="handled" style={styles.container}>
      <Stack.Screen options={{ title: isNewTask ? "Add Task" : "Edit Task" }} />

      {errors.length > 0 && (
        <View style={styles.errorBox}>
          {errors.map(e => <Text key={e} style={styles.errorText}>{e}</Text>)}
        </View>
      )}

      <TextInput
        style={styles.titleInput}
        placeholder="Title"
        value={form.title}
        onChangeText={text => setForm(prev => ({ ...prev, title: text }))}
        maxLength={100}
      />

      <TextInput
        style={styles.notesInput}
        placeholder="Notes"
        value={form.description}
        onChangeText={text => setForm(prev => ({ ...prev, description: text }))}
        multiline
        numberOfLines={3}
        maxLength={1024}
      />

      <View style={styles.timeRow}>
        <TextInput
          style={styles.timeInput}
          placeholder={isHours ? "Hours" : "Minutes"}
          keyboardType="numeric"
          value={String(isHours ? form.hours || "" : form.minutes || "")}
          onChangeText={text => {
            const n = parseInt(text) || 0;
            setForm(prev => isHours ? { ...prev, hours: n } : { ...prev, minutes: n });
          }}
        />
        <Text style={styles.timeLabel}>{isHours ? "hours" : "minutes"}</Text>
        <Switch value={isHours} onValueChange={toggleTimeUnit} />
      </View>

      <View style={styles.buttonRow}>
        <Pressable style={[styles.button, styles.cancelButton]} onPress={() => router.back()}>
          <Text style={styles.buttonText}>x</Text>
        </Pressable>
        <Pressable style={[styles.button, styles.submitButton]} onPress={handleSubmit}>
          <Text style={styles.buttonText}>✓</Text>
        </Pressable>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  errorBox: {
    borderWidth: 1,
    borderColor: "#f87171",
    backgroundColor: "#fee2e2",
    borderRadius: 6,
    padding: 10,
    marginBottom: 12,
  },
  errorText: {
    color: "#b91c1c",
  },
  titleInput: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
    fontSize: 16,
    textAlign: "center",
  },
  notesInput: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
    textAlignVertical: "top",
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 8,
  },
  timeInput: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    width: 80,
  },
  timeLabel: {
    flex: 1,
    fontSize: 14,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 8,
  },
  button: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderWidth: 1,
  },
  cancelButton: {
    borderColor: "#f87171",
  },
  submitButton: {
    borderColor: "#4ade80",
  },
  buttonText: {
    fontWeight: "bold",
  },
});
