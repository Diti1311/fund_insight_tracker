import { Scheme } from "./mfApi";

export interface WatchlistItem {
  schemeCode: number;
  schemeName: string;
  addedAt: number;
}

export interface User {
  token: string;
}

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

export const mockBackend = {
  login: async (
    email: string,
    password: string
  ) => {

    const response = await fetch(
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
      throw new Error("Login failed");
    }

    const data =
      await response.json();

    localStorage.setItem(
      "token",
      data.token
    );

    return data;
  },

  logout: async (): Promise<void> => {
    localStorage.removeItem(
      "token"
    );
  },

  getCurrentUser: () => {

    const token =
      localStorage.getItem(
        "token"
      );

    return token
      ? { token }
      : null;
  },

  getWatchlist: async () => {

    const token =
      localStorage.getItem(
        "token"
      );

    const response =
      await fetch(
        `${API_URL}/api/watchlist`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );

    if (!response.ok) {
      throw new Error(
        "Failed to load watchlist"
      );
    }

    return response.json();
  },

  addToWatchlist: async (
    scheme: Scheme
  ) => {

    const token =
      localStorage.getItem(
        "token"
      );

    const response =
      await fetch(
        `${API_URL}/api/watchlist`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`
          },

          body: JSON.stringify({
            schemeCode:
              scheme.schemeCode,
            schemeName:
              scheme.schemeName
          })
        }
      );

    if (!response.ok) {

      if (
        response.status === 409
      ) {
        throw new Error(
          "Fund already exists"
        );
      }

      throw new Error(
        "Failed to add fund"
      );
    }

    return response.json();
  },

  removeFromWatchlist:
    async (
      schemeCode: number
    ) => {

      const token =
        localStorage.getItem(
          "token"
        );

      const response =
        await fetch(
          `${API_URL}/api/watchlist/${schemeCode}`,
          {
            method: "DELETE",

            headers: {
              Authorization:
                `Bearer ${token}`
            }
          }
        );

      if (!response.ok) {
        throw new Error(
          "Failed to delete fund"
        );
      }
    }
};