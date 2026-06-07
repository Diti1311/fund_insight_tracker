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
        "http://localhost:5000/api/auth/login",
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
      throw new Error(
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