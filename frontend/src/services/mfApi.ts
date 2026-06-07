export interface Scheme {
  schemeCode: number;
  schemeName: string;
}

export interface NavData {
  date: string;
  nav: string;
}

export interface SchemeDetails {
  meta: {
    fund_house: string;
    scheme_type: string;
    scheme_category: string;
    scheme_code: number;
    scheme_name: string;
  };
  data: NavData[];
}

const BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

export const mfApi = {
  searchSchemes: async (
    query: string
  ): Promise<Scheme[]> => {

    if (!query.trim()) return [];

    const response = await fetch(
      `${BASE_URL}/api/funds/search?q=${encodeURIComponent(
        query
      )}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch schemes");
    }

    return response.json();
  },

  getSchemeDetails: async (
    schemeCode: number | string
  ): Promise<SchemeDetails> => {

    const response = await fetch(
      `${BASE_URL}/api/funds/${schemeCode}`
    );

    if (!response.ok) {
      throw new Error(
        "Failed to fetch scheme details"
      );
    }

    return response.json();
  }
};