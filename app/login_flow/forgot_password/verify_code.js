import { router, useLocalSearchParams } from "expo-router";
import { useRef, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";


export default function VerifyCodeScreen() {
  const [code, setCode] = useState(["", "", "", "", ""]);
  const inputs = useRef([]);

  const handleChange = (text, index) => {
    if (/^\d?$/.test(text)) {
      const newCode = [...code];
      newCode[index] = text;
      setCode(newCode);

      if (text && index < 4) {
        inputs.current[index + 1]?.focus();
      }
    }
  };


  const { email } = useLocalSearchParams();

  const isCodeComplete = code.every((digit) => digit !== "");

  return (
    <KeyboardAvoidingView className="flex-1 bg-white pt-20 px-5">

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
          INTERNSYNC
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
        Check your Email
      </Text>


      <Text
        className="text-[16px] text-[#828693] font-semibold"
        style={{
          width: 355,
          height: 40,
          marginBottom: 20,
          fontFamily: "Inter",
          letterSpacing: -0.5,
        }}
      >
        We sent a reset link to{" "}
        <Text className="text-black font-semibold">{email}</Text> enter 5 digit
        code that was mentioned in the email
      </Text>


      <View className="flex-row justify-between mb-8" style={{ gap: 10 }}>
        {code.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => (inputs.current[index] = ref)}
            value={digit}
            keyboardType="number-pad"
            maxLength={1}
            onChangeText={(text) => handleChange(text, index)}
            style={{
              width: 55,
              height: 55,
              borderWidth: 1,
              borderColor: "#A8A8A8",
              borderRadius: 10,
              textAlign: "center",
              fontSize: 20,
              fontFamily: "Inter",
            }}
          />
        ))}
      </View>


      <TouchableOpacity
        className={`items-center justify-center ${isCodeComplete ? "bg-black" : "bg-gray-300"
          }`}
        style={{
          width: 336,
          height: 50,
          borderRadius: 67.18,
          alignSelf: "center",
        }}
        disabled={!isCodeComplete}
        onPress={() => {
          if (isCodeComplete) {
            router.push("/login_flow/forgot_password/set_new_password_screen");
          }
        }}
      >
        <Text className="text-white text-[18px] font-bold">Verify</Text>
      </TouchableOpacity>


      <Text
        className="text-center text-[#828693] mt-6"
        style={{
          width: 359,
          height: 20,
          fontSize: 16,
          fontFamily: "Inter",
          fontWeight: "600",
          letterSpacing: -0.5,
        }}
      >
        Haven’t got the email yet?{" "}
        <Text className="text-black">Resend email</Text>
      </Text>
    </KeyboardAvoidingView>
  );
}
