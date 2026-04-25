// app/_layout.js

import { useFonts } from "expo-font";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { JobsProvider } from "./context/JobsContext";
import { ProfileProvider } from "./context/ProfileContext";
import { SavedJobsProvider } from "./context/SavedJobsContext";
import { SignupProvider } from "./context/SignupContext";
import "./globals.css";

import { Raleway_400Regular, Raleway_500Medium } from "@expo-google-fonts/raleway";
import { Roboto_400Regular, Roboto_700Bold } from "@expo-google-fonts/roboto";

const ClaireNewsBold = require("../assets/fonts/ClaireNewsBold.otf");

// New: Authenticated App Wrapper
function AuthenticatedApp() {
  const { loading, isAuthenticated, hasSelectedPlan } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === "(auth)";
    const inAppGroup = ["Homepage", "profile_page", "context"].includes(segments[0]);
    const isPlanPage = segments[0] === "payment_plan";

    if (isAuthenticated) {
      if (!hasSelectedPlan && !isPlanPage && !inAuthGroup) {
        // Force plan selection if they've logged in but haven't chosen a plan
        console.log("Plan not selected, redirecting to plan page...");
        router.replace("/payment_plan/plan");
      }
    } else {
      // If NOT authenticated, they can only be in auth group or welcome
      if (inAppGroup || isPlanPage) {
        router.replace("/");
      }
    }
  }, [isAuthenticated, hasSelectedPlan, loading, segments]);

  // Show loader while checking auth
  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#000" />
        <Text style={{ marginTop: 16, fontSize: 16, color: "#555" }}>
          Verifying session...
        </Text>
      </View>
    );
  }

  // Only render Stack when auth state is known
  return (
    <ProfileProvider>
      <SavedJobsProvider>
        <JobsProvider>
          <Stack screenOptions={{ headerShown: false }} />
        </JobsProvider>
      </SavedJobsProvider>
    </ProfileProvider>
  );
}

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
        <Text style={{ marginTop: 16, fontSize: 16, color: "#555" }}>
          Loading fonts...
        </Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SignupProvider>
        <AuthProvider>
          {/* AuthenticatedApp now contains the data providers */}
          <AuthenticatedApp />
        </AuthProvider>
      </SignupProvider>
    </GestureHandlerRootView>
  );
}

