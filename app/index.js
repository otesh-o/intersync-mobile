import { useEffect } from "react";
import { View, Image } from "react-native";
import { router } from "expo-router";




const logo = require("../assets/images/logo.png");

export default function Index() {
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/welcome");
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

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
