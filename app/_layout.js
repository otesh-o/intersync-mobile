// app/_layout.js

import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import { View, ActivityIndicator, Text } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "./globals.css";
import { ProfileProvider } from "./context/ProfileContext";
import { SignupProvider } from "./context/SignupContext";
import { AuthProvider } from "./context/AuthContext";
import { SavedJobsProvider } from "./context/SavedJobsContext";
import { JobsProvider } from "./context/JobsContext";



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



  console.log("🏗️ RootLayout: App starting...");

  if (!fontsLoaded) {
    console.log("🔤 Fonts not loaded yet — showing spinner");
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#000" />
        <Text style={{ marginTop: 16, fontSize: 16, color: "#555" }}>
          Loading fonts...
        </Text>
      </View>
    );
  }

  console.log("✅ Fonts loaded — rendering app layout");

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* Wrap everything in context providers */}
      <SignupProvider>
        {/* Manages signup flow (email/password) */}
        <AuthProvider>
          {/* Handles login state, auth checks */}
          <ProfileProvider>
            {/* Loads user profile on startup */}
            <SavedJobsProvider>
              {/* Manages saved jobs list */}
              <JobsProvider>
                {/* Provides job listings */}
                <AppContent />
              </JobsProvider>
            </SavedJobsProvider>
          </ProfileProvider>
        </AuthProvider>
      </SignupProvider>
    </GestureHandlerRootView>
  );
}


function AppContent() {
  console.log("🎨 AppContent rendered — Stack mounted");

  return <Stack screenOptions={{ headerShown: false }} />;
}
