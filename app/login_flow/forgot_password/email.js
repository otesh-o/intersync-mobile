import { router } from "expo-router";
import { useState } from "react";
import { View, Text, TouchableOpacity, Image, TextInput } from "react-native";

export default function ForgotPasswordEmail() {
  const [email, setEmail] = useState("");

  const isDisabled = email.trim() === "";

  return (
    <View className="flex-1 bg-white pt-20 px-5">
      
      <View className="items-center mb-10">
        <TouchableOpacity
          onPress={() => router.back()}
          className="absolute left-0"
        >
          <Image
            source={require("../../../assets/images/back.png")}
            className="w-6 h-6 tint-gray-500"
          />
        </TouchableOpacity>

        <Text
          className="text-[27.11px] text-black uppercase"
          style={{ fontFamily: "ClaireNewsBold", lineHeight: 30 }}
        >
          INTERN SYNC
        </Text>
      </View>

      
      <Text
        className="text-[24px] text-black font-bold"
        style={{
          width: 318,
          height: 28,
          marginBottom: 10,
          fontFamily: "Roboto",
        }}
      >
        Forgot Password
      </Text>

      
      <Text
        className="text-[16px] text-[#828693] font-semibold"
        style={{
          width: 355,
          height: 20,
          marginBottom: 20,
          fontFamily: "Inter",
          letterSpacing: -0.5,
        }}
      >
        Please enter your email to reset the password
      </Text>

      
      <TextInput
        placeholder="Enter your email"
        placeholderTextColor="#A8A8A8"
        value={email}
        onChangeText={setEmail}
        style={{
          width: 336,
          height: 53,
          borderColor: "#A8A8A8",
          borderWidth: 1,
          borderRadius: 26.5,
          paddingHorizontal: 20,
          marginBottom: 40,
          fontFamily: "Inter",
        }}
      />

      
      <TouchableOpacity
        disabled={isDisabled}
        className="items-center justify-center"
        style={{
          width: 336,
          height: 50,
          borderRadius: 67.18,
          alignSelf: "center",
          backgroundColor: isDisabled ? "#ccc" : "#000",
        }}
        onPress={() => {
          if (!isDisabled) {
            router.push({
              pathname: "/login_flow/forgot_password/verify_code",
              params: { email: email },
            });
          }
        }}
      >
        <Text
          className="text-[18px] font-bold"
          style={{ color: isDisabled ? "#888" : "#fff" }}
        >
          Reset Password
        </Text>
      </TouchableOpacity>
    </View>
  );
}
