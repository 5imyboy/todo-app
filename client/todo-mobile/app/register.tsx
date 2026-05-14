import { useState } from "react";
import { Link, useRouter } from "expo-router";
import {
  Button,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function Register() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const url = `${process.env.EXPO_PUBLIC_API_URL}/register`;

  const handleSubmit = async () => {
    if (password !== confirmPassword) {
      setErrors(["Passwords do not match"]);
      return;
    }

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (response.status === 201) {
        router.replace("/login");
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
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Todo List</Text>
        <Text style={styles.subtitle}>Register:</Text>

        {errors.length > 0 && (
          <View style={styles.errorBox}>
            {errors.map(e => <Text key={e} style={styles.errorText}>{e}</Text>)}
          </View>
        )}

        <View style={styles.form}>
          <Text>Email address:</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Text>Password:</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <Text>Confirm Password:</Text>
          <TextInput
            style={styles.input}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
          <View style={styles.buttonRow}>
            <Button title="Register" onPress={handleSubmit} />
            <Link href="/login">Returning User?</Link>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 16 },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 4 },
  subtitle: { fontSize: 18, marginBottom: 16 },
  errorBox: { borderWidth: 1, borderColor: "#f87171", backgroundColor: "#fee2e2", borderRadius: 6, padding: 12, marginBottom: 12, width: "100%" },
  errorText: { color: "#b91c1c" },
  form: { width: "100%", borderWidth: 1, borderColor: "#d1d5db", borderRadius: 6, padding: 16 },
  input: { borderWidth: 1, borderColor: "#d1d5db", borderRadius: 4, paddingHorizontal: 12, paddingVertical: 8, marginTop: 4, marginBottom: 16 },
  buttonRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
});
