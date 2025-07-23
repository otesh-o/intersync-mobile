import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import { View, ActivityIndicator } from "react-native";
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

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}
