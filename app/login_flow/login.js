// app/login_flow/Login.js
import { View, Text, Image, TouchableOpacity } from "react-native";
import { router } from "expo-router";

// Import images
const logo = require("../../assets/images/logo.png");
const googleIcon = require("../../assets/images/google.png"); // Ensure this exists
const emailIcon = require("../../assets/images/email.png"); // Ensure this exists

export default function Login() {
  return (
    <View className="flex-1 bg-black px-6 justify-center items-center">
      {/* Logo & Welcome Text */}
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

      {/* Action Buttons */}
      <View className="w-full items-center mt-6">
        {/* Login with Email */}
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

        {/* Login with Google */}
        <TouchableOpacity
          className="flex-row bg-white w-[304px] h-[53px] rounded-full justify-center items-center"
          onPress={() => {
            // FIREBASE AUTH: Google login implementation
            alert("Google login is currently unavailable.");
          }}
        >
          <Image
            source={googleIcon}
            className="w-6 h-6 absolute left-6"
            resizeMode="contain"
          />
          <Text className="text-black text-lg font-bold">
            Login with Google
          </Text>
        </TouchableOpacity>
      </View>

      {/* Sign Up Link */}
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
