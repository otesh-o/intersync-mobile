// app/services/auth.js
import AsyncStorage from "@react-native-async-storage/async-storage";

// 🔥 Replace with your Firebase API key
const FIREBASE_API_KEY = "AIzaSyBhnS7Klo4XcksmSVmD2RtN7ckpz3p9xX8";

// Firebase REST API endpoint for creating a user
const FIREBASE_SIGN_UP_URL = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${FIREBASE_API_KEY}`;

// Register new user
export const register = async (email, password) => {
  try {
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

    // ✅ We got the ID token from Firebase
    const idToken = data.idToken;

    // Step 2: Send the token to your backend
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

    if (!syncResponse.ok) {
      throw new Error("Sync with backend failed");
    }

    // ✅ User synced successfully
    const userData = await syncResponse.json();

    // Step 3: Save the token so user stays logged in
    await AsyncStorage.setItem("authToken", idToken);

    // Return user data
    return userData;
  } catch (error) {
    console.error("Registration error:", error);
    throw error; // Let the screen show the error
  }
};
