// app/services/api.js
import * as SecureStore from "expo-secure-store";

import { API_BASE_URL } from "./config";

export const api = async (endpoint, options = {}) => {
  if (!API_BASE_URL) {
    console.error("CRITICAL: API_BASE_URL is undefined. Check app.config.js and environment variables.");
    throw new Error("Application configuration error. Please contact support.");
  }

  const token = await SecureStore.getItemAsync("auth-token");

  if (!token) {
    throw new Error("No authentication token found. Please log in.");
  }


  const isFormData = options.body instanceof FormData;


  const config = {
    method: "GET",
    ...options,
    headers: {
      ...(!isFormData && { "Content-Type": "application/json" }),
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  };


  try {

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);


    let data;
    try {
      data = await response.json();
    } catch (jsonError) {
      console.error("JSON parse error:", jsonError);
      throw new Error("Invalid JSON response from server");
    }


    if (!data.success) {
      throw new Error(data.message || "Request failed on server");
    }

    return data;
  } catch (error) {
    console.error("API call failed:", error);


    if (error.message.includes("Network request failed")) {
      throw new Error("No internet connection. Please check your network.");
    }

    throw error;
  }
};

