import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";

export default function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [errors, setErrors] = useState([]);
  const url = `${process.env.NEXT_PUBLIC_API_URL}/login`;

  const handleSubmit = () => {
    const init = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password })
    };
    fetch(url, init)
      .then(response => {
        if (response.status === 200 || response.status === 401) {
          return response.json();
        } else {
          return Promise.reject(`Unexpected Status Error: ${response.status}`);
        }
      }).then(data => {
        if (data.userId) {
          router.push("/(tabs)/not-started");
        } else {
          setErrors(data);
        }
      }).catch(console.log);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Todo List</Text>
      <Text style={styles.subtitle}>Login:</Text>

      {errors.length > 0 && (
        <View style={styles.errorBox}>
          {errors.map(e => <Text key={e} style={styles.errorText}>{e}</Text>)}
        </View>
      )}

      <View style={styles.form}>
        <Text>Email address:</Text>
        <TextInput
          style={styles.input}
          id="email"
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          defaultValue={email}
        />
        <Text>Password:</Text>
        <TextInput
          style={styles.input}
          id="password"
          onChangeText={setPassword}
          secureTextEntry
        />
        <View style={styles.buttonRow}>
          <Button title="Login" onPress={handleSubmit} />
          <Link href="/(tabs)/not-started">New User?</Link>
        </View>
      </View>
    </View>
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
