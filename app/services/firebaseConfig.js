import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const extra = Constants.expoConfig?.extra || {};

const firebaseConfig = {
  apiKey: extra.firebaseApiKey,
  authDomain: extra.firebaseAuthDomain,
  projectId: extra.firebaseProjectId,
  storageBucket: extra.firebaseStorageBucket,
  messagingSenderId: extra.firebaseMessagingSenderId,
  appId: extra.firebaseAppId,
  measurementId: extra.firebaseMeasurementId,
};

let app;
let auth;
let storage;

if (firebaseConfig.apiKey) {
  app = initializeApp(firebaseConfig);
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
  storage = getStorage(app);
} else {
  console.error("❌ CRITICAL: Firebase API Key is missing. Check your eas.json or environment variables.");
  // Provide dummy objects to prevent immediate crashes in other files
  app = {};
  auth = {
    onAuthStateChanged: (cb) => {
      console.warn("Firebase Auth not initialized: onAuthStateChanged called");
      return () => {};
    },
    currentUser: null,
  };
  storage = {};
}

export { auth, storage };
export default app;

