import { createContext, useContext } from "react";

interface AuthContextValue {
  login: (email: string, password: string) => Promise<void>;
}

const login = async (email: string, password: string): Promise<void> => {
  try {
    const response = await fetch("", {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    const data = response.json();
    console.log("Login succesful", data);
  } catch (error) {
    console.error("Error in login", error);
    throw error;
  }
};
const defaultAuthContextValue: AuthContextValue = {
  login,
};
const AuthContext = createContext<AuthContextValue>(defaultAuthContextValue);

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used witihin an AuthProvider");
  }
  return context;
};
