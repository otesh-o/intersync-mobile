import { View, Text, Image, TouchableOpacity } from "react-native";
import { router } from "expo-router";

const logo = require("../../assets/images/logo.png");

export default function Login() {
  return (
    <View className="flex-1 bg-black px-6 justify-center items-center">
      <View className="items-center mb-8">
        <Image
          source={logo}
          className="w-[182px] h-[182px] mb-[-10px]"
          resizeMode="contain"
        />

        <Text
          className="text-[27.11px] text-white uppercase text-center"
          style={{ fontFamily: "ClaireNewsBold", lineHeight: 30 }}
        >
          INTERNSYNC
        </Text>

        <Text
          className="text-[24px] text-white font-bold text-center mt-4"
          style={{
            fontFamily: "Roboto",
            lineHeight: 35,
          }}
        >
          Welcome Back!
        </Text>
      </View>

      <View className="w-full items-center mt-6">
        <TouchableOpacity
          className="bg-white w-[304px] h-[53px] rounded-full justify-center items-center mb-4"
          onPress={() => router.push("/login/email")}
        >
          <Text className="text-black text-lg font-bold">Login with Email</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-white w-[304px] h-[53px] rounded-full justify-center items-center mb-4"
          onPress={() => console.log("Google login")}
        >
          <Text className="text-black text-lg font-bold">
            Login with Google
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-white w-[304px] h-[53px] rounded-full justify-center items-center"
          onPress={() => console.log("LinkedIn login")}
        >
          <Text className="text-black text-lg font-bold">
            Login with LinkedIn
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        className="mt-10"
        onPress={() => router.push("/create_account/email")}
      >
        <Text
          className="text-white text-[13.26px] text-center font-bold"
          style={{ fontFamily: "Roboto", lineHeight: 24 }}
        >
          New here? Create an account
        </Text>
      </TouchableOpacity>
    </View>
  );
}
