import { router } from "expo-router";
import { useEffect } from "react";
import { Image, View } from "react-native";
import { useAuth } from "./context/AuthContext";




const logo = require("../assets/images/logo.png");

export default function Index() {
  const { loading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (loading) return;

    const timer = setTimeout(() => {
      if (isAuthenticated) {
        router.replace("/Homepage/homepage");
      } else {
        router.replace("/welcome");
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [loading, isAuthenticated]);

  return (
    <View className="flex-1 bg-black justify-center items-center">
      <Image
        source={logo}
        style={{ width: 242, height: 242 }}
        resizeMode="contain"
      />
    </View>
  );
}
