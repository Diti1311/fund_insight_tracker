import React, {
  useEffect,
  useState,
  createContext,
  useContext,
  ReactNode
} from "react";

interface User {
  token: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<void>;
  logout: () => Promise<void>;
}

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

const AuthContext =
  createContext<AuthContextType | undefined>(
    undefined
  );

export function AuthProvider({
  children
}: {
  children: ReactNode;
}) {
  const [user, setUser] =
    useState<User | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  useEffect(() => {
    const token =
      localStorage.getItem("token");

    if (token) {
      setUser({ token });
    }

    setIsLoading(false);
  }, []);

  const login = async (
    email: string,
    password: string
  ) => {
    const response =
      await fetch(
        `${API_URL}/api/auth/login`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({
            email,
            password
          })
        }
      );

    if (!response.ok) {
      const error =
        await response.json();

      throw new Error(
        error.message ||
          "Login failed"
      );
    }

    const data =
      await response.json();

    localStorage.setItem(
      "token",
      data.token
    );

    setUser({
      token: data.token
    });
  };

  const logout = async () => {
    localStorage.removeItem(
      "token"
    );

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}