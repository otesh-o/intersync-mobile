// ========================================================================
// FILE: app/_layout.js
// This version includes the minimal changes required to fix the
// PanGestureHandler error.
// ========================================================================
import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import { View, ActivityIndicator } from "react-native";
import { GestureHandlerRootView } from 'react-native-gesture-handler'; // 1. Import this
import "./globals.css";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    ClaireNewsBold: require("../assets/fonts/ClaireNewsBold.otf"), 
  });

  if (!fontsLoaded) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // 2. Wrap your Stack with the GestureHandlerRootView
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </GestureHandlerRootView>
  );
}
