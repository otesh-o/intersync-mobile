// app/services/auth.js
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

// ===== FIREBASE AUTHENTICATION COMPONENTS (COMMENTED OUT) =====
// The key is now securely loaded from your .env file
// const FIREBASE_API_KEY = process.env.EXPO_PUBLIC_FIREBASE_API_KEY;

// Firebase REST API endpoints
// const FIREBASE_SIGN_UP_URL = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${FIREBASE_API_KEY}`;
// const FIREBASE_REFRESH_TOKEN_URL = `https://securetoken.googleapis.com/v1/token?key=${FIREBASE_API_KEY}`;

// Check if token is valid
export const isTokenValid = async () => {
  try {
    // FIREBASE AUTH: Token validation logic
    // const token = await AsyncStorage.getItem("authToken");
    // if (!token) return false;
    
    // Simple validation - in a real app, you might want to decode the JWT and check its expiration
    // For Firebase tokens, they typically expire after 1 hour
    // return true;
    
    // Temporary mock implementation (Firebase auth disabled)
    return true;
  } catch (error) {
    console.error("Error checking token validity:", error);
    return false;
  }
};

// Authenticated API call with automatic token refresh
export const authenticatedFetch = async (url, options = {}) => {
  try {
    // FIREBASE AUTH: Token retrieval and authentication
    // Get the current token
    // let token = await AsyncStorage.getItem("authToken");
    
    // Set up headers with authentication
    const headers = {
      ...options.headers,
      "Content-Type": "application/json",
      // "Authorization": `Bearer ${token}`
    };
    
    // Make the API call
    let response = await fetch(url, {
      ...options,
      headers
    });
    
    // FIREBASE AUTH: Token refresh logic
    // If we get a 401 (Unauthorized), try to refresh the token
    /*
    if (response.status === 401) {
      console.log("Token expired, attempting to refresh...");
      
      try {
        // Refresh the token
        token = await refreshToken();
        
        // Update headers with new token
        headers.Authorization = `Bearer ${token}`;
        
        // Retry the API call with the new token
        response = await fetch(url, {
          ...options,
          headers
        });
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        Alert.alert(
          "Session Expired",
          "Your session has expired. Please log in again.",
          [{ text: "OK" }]
        );
        throw new Error("Authentication failed after token refresh attempt");
      }
    }
    */
    
    return response;
  } catch (error) {
    console.error("API call failed:", error);
    throw error;
  }
};

// Refresh token function
export const refreshToken = async () => {
  try {
    // FIREBASE AUTH: Token refresh logic
    /*
    // Get the refresh token from storage
    const refreshToken = await AsyncStorage.getItem("refreshToken");
    
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }
    
    // Call Firebase token refresh endpoint
    const response = await fetch(FIREBASE_REFRESH_TOKEN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || "Failed to refresh token");
    }
    
    // Save the new tokens
    await AsyncStorage.setItem("authToken", data.id_token);
    await AsyncStorage.setItem("refreshToken", data.refresh_token);
    
    return data.id_token;
    */
    
    // Temporary mock implementation (Firebase auth disabled)
    return "mock-token";
  } catch (error) {
    console.error("Token refresh failed:", error.message);
    // Clear tokens if refresh fails
    await AsyncStorage.removeItem("authToken");
    await AsyncStorage.removeItem("refreshToken");
    throw error;
  }
};

// Login user
export const login = async (email, password) => {
  try {
    // FIREBASE AUTH: Firebase authentication logic
    /*
    // Firebase sign-in endpoint
    const signInUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`;
    
    // Sign in with Firebase
    const response = await fetch(signInUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        returnSecureToken: true,
      }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || "Login failed");
    }
    
    // Save tokens
    await AsyncStorage.setItem("authToken", data.idToken);
    await AsyncStorage.setItem("refreshToken", data.refreshToken);
    
    // Sync with backend using our authenticated fetch
    const syncResponse = await authenticatedFetch(
      "https://internsync-production.up.railway.app/v1/user/sync",
      {
        method: "POST",
        body: JSON.stringify({ idToken: data.idToken }),
      }
    );
    
    if (!syncResponse.ok) {
      const errorText = await syncResponse.text();
      throw new Error(`Backend sync failed: ${errorText}`);
    }
    
    const userData = await syncResponse.json();
    return userData;
    */
    
    // Temporary mock implementation (Firebase auth disabled)
    return {
      id: "mock-user-id",
      email: email,
      displayName: "Mock User"
    };
  } catch (error) {
    console.error("Login error:", error.message);
    throw error;
  }
};

// Register new user
export const register = async (email, password) => {
  try {
    // FIREBASE AUTH: Firebase registration logic
    /*
    // Step 1: Create user in Firebase (via web API)
    const response = await fetch(FIREBASE_SIGN_UP_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
        returnSecureToken: true, // This gives us the ID token
      }),
    });

    const data = await response.json();

    // If Firebase returns an error (e.g., email already in use)
    if (!response.ok) {
      throw new Error(data.error.message);
    }

    // ✅ We got the ID token and refresh token from Firebase
    const idToken = data.idToken;
    const refreshToken = data.refreshToken;

    // Step 2: Send the token to your backend using our authenticated fetch
    const syncResponse = await fetch(
      "https://internsync-production.up.railway.app/v1/user/sync",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ idToken }),
      }
    );

    // MODIFIED: Check if the backend sync failed
    if (!syncResponse.ok) {
      // Create a new error and attach the full server response to it
      const err = new Error("Sync with backend failed");
      err.response = syncResponse; 
      throw err;
    }

    // ✅ User synced successfully
    const userData = await syncResponse.json();

    // Step 3: Save both tokens so user stays logged in and can refresh
    await AsyncStorage.setItem("authToken", idToken);
    await AsyncStorage.setItem("refreshToken", refreshToken);

    // Return user data
    return userData;
    */
    
    // Temporary mock implementation (Firebase auth disabled)
    return {
      id: "mock-user-id",
      email: email,
      displayName: "New User"
    };
  } catch (error) {
    // FIREBASE AUTH: Error handling for Firebase registration
    /*
    // MODIFIED: Catch block with detailed logging
    // Check if the error came from our backend sync and has the response object
    if (error.message === "Sync with backend failed" && error.response) {
      const errorBody = await error.response.text(); // Use .text() in case the error isn't valid JSON
      console.error("--- BACKEND SYNC FAILED ---");
      console.error("Status:", error.response.status);
      console.error("Response Body:", errorBody);
      console.error("---------------------------");
      // Throw a more specific error for the UI to catch and display
      throw new Error(`Sync failed: ${errorBody}`);
    } else {
      // Handle other errors (like Firebase issues or network failures)
      console.error("Registration error:", error.message);
      throw error;
    }
    */
    
    console.error("Registration error:", error.message);
    throw error;
  }
};
