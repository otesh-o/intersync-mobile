// app/services/api.js
import AsyncStorage from "@react-native-async-storage/async-storage";

// 🔗 Your backend base URL (no trailing slash or spaces!)
const API_BASE_URL = "https://internsync-production.up.railway.app"; // ✅ No spaces

/**
 * Generic API caller with automatic auth header
 */
export const api = async (endpoint, options = {}) => {
  // 1. Get the stored auth token
  const token = await AsyncStorage.getItem("authToken");

  if (!token) {
    throw new Error("No authentication token found. Please log in.");
  }

  // 2. Build request config
  const config = {
    method: "GET", // default
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // ← This proves who you are
      ...options.headers,
    },
  };

  try {
    // 3. Make the fetch call
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    // 4. Parse JSON response
    let data;
    try {
      data = await response.json();
    } catch (jsonError) {
      console.error("JSON parse error:", jsonError);
      throw new Error("Invalid JSON response from server");
    }

    // 5. Check if backend returned success: true
    if (!data.success) {
      throw new Error(data.message || "Request failed on server");
    }

    return data;
  } catch (error) {
    console.error("API call failed:", error); // 👈 Helps debugging

    // Improve network error message
    if (error.message.includes("Network request failed")) {
      throw new Error("No internet connection. Please check your network.");
    }

    throw error;
  }
};
