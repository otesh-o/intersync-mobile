import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const extra = Constants.expoConfig?.extra || {};

const firebaseConfig = {
  apiKey: extra.firebaseApiKey || "AIzaSyBhnS7Klo4XcksmSVmD2RtN7ckpz3p9xX8",
  authDomain: extra.firebaseAuthDomain || "internsync-435f0.firebaseapp.com",
  projectId: extra.firebaseProjectId || "internsync-435f0",
  storageBucket: extra.firebaseStorageBucket || "internsync-435f0.appspot.com",
  messagingSenderId: extra.firebaseMessagingSenderId || "1028469357708",
  appId: extra.firebaseAppId || "1:1028469357708:web:d936783ea35e74eb114fa9",
  measurementId: extra.firebaseMeasurementId || "G-N5B7HE8C7K",
};

const app = initializeApp(firebaseConfig);

// 🔑 Initialize auth with AsyncStorage persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

const storage = getStorage(app);

export { auth, storage };
export default app;
