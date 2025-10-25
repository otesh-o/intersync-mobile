// app/services/api.js
import AsyncStorage from "@react-native-async-storage/async-storage";


const API_BASE_URL = "https://internsync-production.up.railway.app"; 


export const api = async (endpoint, options = {}) => {

  const token = await AsyncStorage.getItem("authToken");

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
