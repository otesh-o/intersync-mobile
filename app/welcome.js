import { router } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";

const logo = require("../assets/images/logo.png");

export default function Welcome() {
  return (
    <View className="flex-1 bg-black px-6 justify-center items-center">
      <View className="items-center mb-8">
        <Image
          source={logo}
          className="w-[182px] h-[182px] mb-[-10px]"
          resizeMode="contain"
        />

        {/* <Text
          className="text-[27.11px] text-white uppercase text-center"
          style={{ fontFamily: "ClaireNewsBold", lineHeight: 30 }}
        >
          INTERNSYNC
        </Text> */}

        <Text
          className="text-[24px] text-white font-bold text-center mt-4"
          style={{
            fontFamily: "Roboto",
            lineHeight: 35,
          }}
        >
          Find your next opportunity{"\n"}Swipe. Match. Apply.
        </Text>
      </View>

      <View className="w-full items-center mt-6">
        <TouchableOpacity
          className="bg-white w-[304px] h-[53px] rounded-full justify-center items-center"
          onPress={() => router.push("/create_account/email")}
        >
          <Text className="text-black text-lg font-bold">Create Account</Text>
        </TouchableOpacity>
        <View className="h-6" />
        <TouchableOpacity
          className="bg-white w-[304px] h-[53px] rounded-full justify-center items-center"
          onPress={() => router.push("/login_flow/login")}
        >
          <Text className="text-black text-lg font-bold">Log In</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity className="mt-10">
        <Text
          className="text-white text-[13.26px] text-center font-bold"
          style={{ fontFamily: "Roboto", lineHeight: 24 }}
        >
          Trouble logging in?
        </Text>
      </TouchableOpacity>
    </View>
  );
}

