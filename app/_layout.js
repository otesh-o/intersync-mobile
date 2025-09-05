// app/_layout.js

import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import { View, ActivityIndicator } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "./globals.css";

// 👇 Import all providers
import { ProfileProvider } from "./context/ProfileContext";
import { AuthProvider } from "./context/AuthContext";
import { SavedJobsProvider } from "./context/SavedJobsContext";
import { JobsProvider } from "./context/JobsContext"; // ✅ Add this

// ✅ Font imports
const ClaireNewsBold = require("../assets/fonts/ClaireNewsBold.otf");

const Raleway_400Regular = require("../node_modules/@expo-google-fonts/raleway/400Regular/Raleway_400Regular.ttf");
const Raleway_500Medium = require("../node_modules/@expo-google-fonts/raleway/500Medium/Raleway_500Medium.ttf");

const Roboto_400Regular = require("../node_modules/@expo-google-fonts/roboto/400Regular/Roboto_400Regular.ttf");
const Roboto_700Bold = require("../node_modules/@expo-google-fonts/roboto/700Bold/Roboto_700Bold.ttf");

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    ClaireNewsBold,
    Roboto: Roboto_400Regular,
    "Roboto-Bold": Roboto_700Bold,
    Raleway: Raleway_400Regular,
    "Raleway-Medium": Raleway_500Medium,
  });

  if (!fontsLoaded) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <ProfileProvider>
          <SavedJobsProvider>
            <JobsProvider>
              {" "}
              {/* ✅ Wrap here */}
              <Stack screenOptions={{ headerShown: false }} />
            </JobsProvider>
          </SavedJobsProvider>
        </ProfileProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
