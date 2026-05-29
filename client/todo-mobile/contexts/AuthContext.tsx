import * as SecureStore from "expo-secure-store";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface AuthContextType {
  token: string | null;
  setToken: (token: string | null) => void;
}

const AuthContext = createContext<AuthContextType>({ token: null, setToken: () => {} });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    SecureStore.getItemAsync("token").then(t => setToken(t));
  }, []);

  const handleSetToken = (t: string | null) => {
    setToken(t);
    if (t) {
      SecureStore.setItemAsync("token", t);
    } else {
      SecureStore.deleteItemAsync("token");
    }
  };

  return (
    <AuthContext value={{ token, setToken: handleSetToken }}>
      {children}
    </AuthContext>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
