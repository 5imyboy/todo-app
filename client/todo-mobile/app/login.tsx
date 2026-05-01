import { Link } from "expo-router";
import { Button, View } from "react-native";

export default function Login() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Link href="/(tabs)/not-started" push asChild>
        <Button title="Login" />
      </Link>
    </View>
  );
}


