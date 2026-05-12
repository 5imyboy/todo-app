import { useState } from "react";
import * as SecureStore from "expo-secure-store";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";

const EMPTY_FORM = {
  title: "",
  description: "",
  hours: 0,
  minutes: 0,
  status: "NOT_STARTED",
};

export default function AddTaskModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [isHours, setIsHours] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const handleClose = () => {
    setForm(EMPTY_FORM);
    setIsHours(false);
    setErrors([]);
    onClose();
  };

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
      const token = await SecureStore.getItemAsync("token");
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/task/add`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify(form),
        }
      );
      if (response.status === 201) {
        handleClose();
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
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <ScrollView keyboardShouldPersistTaps="handled">

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
              <Pressable style={[styles.button, styles.cancelButton]} onPress={handleClose}>
                <Text style={styles.buttonText}>x</Text>
              </Pressable>
              <Pressable style={[styles.button, styles.submitButton]} onPress={handleSubmit}>
                <Text style={styles.buttonText}>✓</Text>
              </Pressable>
            </View>

          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  sheet: {
    backgroundColor: "white",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
    paddingBottom: 40,
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
