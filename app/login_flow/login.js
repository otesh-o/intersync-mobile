// app/login_flow/Login.js
import { router } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";


const logo = require("../../assets/images/logo.png");
const emailIcon = require("../../assets/images/email.png");
const backIcon = require("../../assets/images/back.png");

export default function Login() {
  return (
    <View className="flex-1 bg-black px-6 justify-center items-center">
      <TouchableOpacity
        onPress={() => router.back()}
        className="absolute top-14 left-6 z-10"
        accessibilityLabel="Go back"
      >
        <Image
          source={backIcon}
          className="w-6 h-6"
          style={{ tintColor: "white" }}
          resizeMode="contain"
        />
      </TouchableOpacity>
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
          Welcome Back!
        </Text>
      </View>

      <View className="w-full items-center mt-6">
        <TouchableOpacity
          className="flex-row bg-white w-[304px] h-[53px] rounded-full justify-center items-center mb-4"
          onPress={() => router.push("/login_flow/with_email")}
        >
          <Image
            source={emailIcon}
            className="w-6 h-6 absolute left-6"
            resizeMode="contain"
          />
          <Text className="text-black text-lg font-bold">Login with Email</Text>
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

